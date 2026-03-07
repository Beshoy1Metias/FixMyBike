"use client";

import { useEffect, useState } from "react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { useSession } from "next-auth/react";

export default function PushNotificationProvider() {
    const { data: session } = useSession();
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const registerDevice = async () => {
            if (!session?.user?.id) return;

            try {
                const beamsClient = new PusherPushNotifications.Client({
                    instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID!,
                });

                await beamsClient.start();
                await beamsClient.addDeviceInterest(session.user.id);
                // Also register for global broadcasts if needed
                // await beamsClient.addDeviceInterest("global");
                
                setIsRegistered(true);
                console.log("Device registered for push notifications");
            } catch (error) {
                console.error("Failed to register device for push notifications:", error);
            }
        };

        if (session?.user?.id && !isRegistered) {
            registerDevice();
        }
    }, [session, isRegistered]);

    return null; // This provider doesn't render anything visible
}
