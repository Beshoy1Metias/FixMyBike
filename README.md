# FixMyBike 🚲

FixMyBike is a community-driven marketplace and service platform for cyclists. It connects bike owners with local mechanics, allows users to buy and sell parts and accessories, and provides a space for finding or selling complete bikes.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, TypeScript)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Google OAuth & Credentials)
- **Real-time Messaging**: [Pusher Channels](https://pusher.com/channels)
- **Push Notifications**: [Pusher Beams](https://pusher.com/beams)
- **File Storage**: [AWS S3](https://aws.amazon.com/s3/) (Presigned URLs for secure uploads)
- **Emails**: [SendGrid](https://sendgrid.com/) / [Resend](https://resend.com/)
- **Styling**: Vanilla CSS (CSS Modules) with a dark-themed, glassmorphic design system.
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (Neon recommended)
- Pusher and AWS S3 accounts

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd fix-my-bike
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the variables listed in the [Environment Variables](#-environment-variables) section below.

4. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Deployment

The app is optimized for [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add all environment variables to the Vercel project settings.
4. Vercel will automatically run the build and deploy.

## 🔑 Environment Variables

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string (include `?sslmode=require` for Neon). |
| `NEXTAUTH_URL` | The base URL of your app (e.g., `https://your-app.vercel.app`). |
| `NEXTAUTH_SECRET` | A random string used to hash tokens. |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret. |
| `NEXT_PUBLIC_PUSHER_KEY` | Pusher Channels Public Key. |
| `PUSHER_APP_ID` | Pusher Channels App ID. |
| `PUSHER_SECRET` | Pusher Channels Secret. |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Pusher Channels Cluster (e.g., `eu`). |
| `NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID` | Pusher Beams Instance ID. |
| `PUSHER_BEAMS_SECRET_KEY` | Pusher Beams Secret Key. |
| `AWS_ACCESS_KEY_ID` | AWS IAM User Access Key. |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM User Secret Key. |
| `AWS_REGION` | AWS S3 Bucket Region. |
| `AWS_BUCKET_NAME` | AWS S3 Bucket Name. |

## 🌟 Key Features

- **Advanced Search & Filtering**: Client-side filtering for bikes, parts, and mechanics with debounced search.
- **Real-time Chat**: Direct messaging between buyers, sellers, and mechanics.
- **Admin Dashboard**: Comprehensive stats for site administrators.
- **SEO Optimized**: Dynamic location-based landing pages (e.g., `/bikes/in/padova`).
- **Multilingual Support**: English and Italian translations throughout the app.
- **Responsive Design**: Mobile-first approach with high-quality touch targets and a dedicated mobile navigation drawer.
