import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hudsonsworld.game',
  appName: "Hudson's World",
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Add plugins here later if needed
  }
};

export default config;