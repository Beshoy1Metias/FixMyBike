import * as PusherPushNotifications from "@pusher/push-notifications-server";

// Server-side Beams client
export const beamsClient = new PusherPushNotifications.default({
  instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID!,
  secretKey: process.env.PUSHER_BEAMS_SECRET_KEY!,
});

export const publishToUser = async (userId: string, title: string, body: string, deepLink?: string) => {
    try {
        await beamsClient.publishToInterests([userId], {
            web: {
                notification: {
                    title,
                    body,
                    deep_link: deepLink,
                },
            },
        });
        console.log(`Push notification sent to user: ${userId}`);
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};
