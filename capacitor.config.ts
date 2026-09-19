import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keli26.festival',
  appName: 'KELI26 Festival Scanner',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#050b18',
      showSpinner: false,
    },
  },
};

export default config;