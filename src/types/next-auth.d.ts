import "next-auth";

// Extend the NextAuth session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}
