import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { listingId, listingType } = await req.json();

    if (!listingId || !listingType) {
      return NextResponse.json({ error: 'Missing listingId or listingType' }, { status: 400 });
    }

    let listing;
    let priceInPence;
    let title;
    let sellerId;

    if (listingType === 'bike') {
      listing = await prisma.bikeListing.findUnique({
        where: { id: listingId },
        include: { user: true },
      });
      if (!listing) return NextResponse.json({ error: 'Bike listing not found' }, { status: 404 });
      priceInPence = Math.round(listing.price * 100);
      title = listing.title;
      sellerId = listing.userId;
    } else if (listingType === 'part') {
      listing = await prisma.partListing.findUnique({
        where: { id: listingId },
        include: { user: true },
      });
      if (!listing) return NextResponse.json({ error: 'Part listing not found' }, { status: 404 });
      priceInPence = Math.round(listing.price * 100);
      title = listing.title;
      sellerId = listing.userId;
    } else {
      return NextResponse.json({ error: 'Invalid listingType' }, { status: 400 });
    }

    if (listing.isSold) {
      return NextResponse.json({ error: 'Item already sold' }, { status: 400 });
    }

    // Get or create Stripe customer for the current user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name || undefined,
      });
      stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: title,
              description: `Payment for ${listingType}: ${title}`,
            },
            unit_amount: priceInPence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${listingType}s/${listingId}?payment=cancelled`,
      metadata: {
        listingId,
        listingType,
        buyerId: user.id,
        sellerId,
      },
    });

    // Create a pending order
    await prisma.order.create({
      data: {
        buyerId: user.id,
        sellerId: sellerId,
        bikeListingId: listingType === 'bike' ? listingId : undefined,
        partListingId: listingType === 'part' ? listingId : undefined,
        amount: listing.price,
        currency: 'GBP',
        status: 'PENDING',
        stripeSessionId: checkoutSession.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
