module.exports = {
  expo: {
    name: 'TimeEgg',
    slug: 'timeegg',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'timeegg',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.timeegg.app',
      associatedDomains: ['applinks:be-production-8aa2.up.railway.app'],
    },
    android: {
      package: 'com.timeegg.app',
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'timeegg',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          imageWidth: 200,
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      kakaoApiKey: process.env.EXPO_PUBLIC_KAKAO_API_KEY,
      oauthRedirectUri: process.env.EXPO_PUBLIC_OAUTH_CALLBACK,
    },
  },
};
