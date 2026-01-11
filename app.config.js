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
      image: './assets/images/modal_egg.png', // 1. 여기에 실제 이미지 경로 추가!
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.timeegg.app',
      associatedDomains: ['applinks:be-production-8aa2.up.railway.app'],
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'TimeEgg이(가) 위치 정보를 사용하여 주변 타임캡슐을 찾습니다.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'TimeEgg이(가) 위치 정보를 사용하여 주변 타임캡슐을 찾습니다.',
        LSApplicationQueriesSchemes: [
          'supertoss',
          'toss',
          'kakaotalk',
          'kakaopay',
          'kakaolink',
          'kakaobank',
          'kb-acp',
          'liivbank',
          'newliiv',
          'kbbank',
          'nhappcardansimclick',
          'nhallonepayansimclick',
          'nonghyupcardansimclick',
          'lottesmartpay',
          'lotteappcard',
          'mpocket.online.ansimclick',
          'samsungpay',
          'shinhan-sr-ansimclick',
          'smshinhanansimclick',
          'com.wooricard.wcard',
          'newsmartpib',
          'citispay',
          'citicardappkr',
          'citimobileapp',
          'cloudpay',
          'hanawalletmembers',
          'hdcardappcardansimclick',
          'smhyundaiansimclick',
          'ispmobile',
        ],
      },
    },
    android: {
      package: 'com.timeegg.app',
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
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
          image: './assets/images/modal_egg.png', // 2. 플러그인 설정에도 경로 추가!
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
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            '$(PRODUCT_NAME)이(가) 위치 정보를 사용하여 주변 타임캡슐을 찾습니다.',
          locationAlwaysPermission:
            '$(PRODUCT_NAME)이(가) 위치 정보를 사용하여 주변 타임캡슐을 찾습니다.',
          locationWhenInUsePermission:
            '$(PRODUCT_NAME)이(가) 위치 정보를 사용하여 주변 타임캡슐을 찾습니다.',
        },
      ],
      [
        'expo-audio',
        {
          microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      kakaoApiKey: process.env.EXPO_PUBLIC_KAKAO_API_KEY,
      kakaoMapApiKey: process.env.EXPO_PUBLIC_KAKAO_MAP_API_KEY,
      kakaoRestApiKey: process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY,
      oauthRedirectUri: process.env.EXPO_PUBLIC_OAUTH_CALLBACK,
    },
  },
};
