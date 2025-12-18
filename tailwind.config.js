// 임시 설정. 추후 수정 필요.
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4에서는 content 경로를 지정해야 합니다
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './commons/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // 색상 토큰 정의 (Figma 디자인 시스템과 연동)
      colors: {
        // Black 팔레트
        black: {
          50: '#EEF1F4', // Light
          100: '#E2E6EC', // Light Hover
          200: '#CED4DB', // Light Active
          500: '#2F3740', // Normal
          600: '#242A30', // Normal Hover
          700: '#1F2429', // Normal Active
          800: '#0D1013', // Dark
          900: '#0D1013', // Dark Hover
          950: '#080A0C', // Dark Active
          darker: '#000000', // Darker
        },
        // White 팔레트
        white: {
          50: '#FFFFFF', // Light
          100: '#F3F4F6', // Light Hover
          200: '#E5E7EB', // Light Active
          500: '#FFFFFF', // Normal
          600: '#F3F4F6', // Normal Hover
          700: '#E5E7EB', // Normal Active
          800: '#DBDDDF', // Dark
          900: '#CACBCD', // Dark Hover
          950: '#B8B9BB', // Dark Active
          darker: '#A6A7A9', // Darker
        },
        // Red 팔레트
        red: {
          50: '#FCEEEE', // Light
          100: '#FAE1E1', // Light Hover
          200: '#F8D3D3', // Light Active
          500: '#EB3434', // Normal
          600: '#DE2F2F', // Normal Hover
          700: '#CC2C2C', // Normal Active
          800: '#8F0F0F', // Dark
          900: '#820D0D', // Dark Hover
          950: '#740C0C', // Dark Active
          darker: '#660A0A', // Darker
        },
        // Green 팔레트
        green: {
          50: '#EDFAF2', // Light
          100: '#E0F5E7', // Light Hover
          200: '#D3F0DD', // Light Active
          500: '#2DD75A', // Normal
          600: '#29C652', // Normal Hover
          700: '#26B64B', // Normal Active
          800: '#0D7A2C', // Dark
          900: '#0C6F27', // Dark Hover
          950: '#0A6423', // Dark Active
          darker: '#09591E', // Darker
        },
        // Blue 팔레트
        blue: {
          50: '#EEF4FC', // Light
          100: '#E0EBF8', // Light Hover
          200: '#D3E2F4', // Light Active
          500: '#337BF3', // Normal
          600: '#2F71DE', // Normal Hover
          700: '#2B68CA', // Normal Active
          800: '#0E3C8B', // Dark
          900: '#0D367E', // Dark Hover
          950: '#0B3072', // Dark Active
          darker: '#0A2B66', // Darker
        },
      },
      // 간격(Spacing) 토큰
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
      },
      // 반경(Radius) 토큰
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        full: '9999px',
      },
      // 타이포그래피 토큰
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1' }],
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  },
  plugins: [],
};
