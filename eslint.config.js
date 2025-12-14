const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = defineConfig([
  // 1. Expo 기본 설정 불러오기
  expoConfig,

  // 2. Prettier와 충돌하는 ESLint 포맷팅 규칙 끄기
  prettierConfig,

  // 3. 커스텀 플러그인 및 규칙 설정
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier 규칙을 어기면 빨간 줄(Error) 표시
      'prettier/prettier': 'error',

      // Import 문 자동 정렬 (저장 시 알파벳 순서로 정리됨)
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // 4. 무시할 폴더 설정
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
]);
