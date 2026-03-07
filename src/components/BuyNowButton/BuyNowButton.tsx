'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BuyNowButtonProps {
  listingId: string;
  listingType: 'bike' | 'part';
  price: number;
  isSold: boolean;
  disabled?: boolean;
}

export default function BuyNowButton({ 
  listingId, 
  listingType, 
  price, 
  isSold,
  disabled = false 
}: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBuyNow = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId,
          listingType,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to initiate checkout');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSold) {
    return (
      <button 
        disabled 
        className="button button-secondary" 
        style={{ width: '100%', cursor: 'not-allowed', opacity: 0.6 }}
      >
        Sold
      </button>
    );
  }

  return (
    <button
      onClick={handleBuyNow}
      disabled={isLoading || disabled}
      className="button button-primary"
      style={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 'var(--space-2)',
        fontWeight: 600
      }}
    >
      {isLoading ? (
        <>
          <span className="spinner" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
          Processing...
        </>
      ) : (
        `Buy Now for €${price.toLocaleString()}`
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
