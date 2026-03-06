import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.fixmybike.app',
    appName: 'fix-my-bike',
    webDir: 'out',
    server: {
        androidScheme: 'https'
    }
};

export default config;
