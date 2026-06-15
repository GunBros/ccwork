export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'body-min-lines': ({ body }) => {
          const lines = (body || '').split('\n').filter((line) => line.trim() !== '');
          return [lines.length >= 2, '본문은 최소 2줄 이상 작성해야 합니다.'];
        },
      },
    },
  ],
  rules: {
    'subject-empty': [2, 'never'],  // 제목 필수
    'body-empty': [2, 'never'],     // 본문 필수
    'body-min-lines': [2, 'always'], // 본문 최소 2줄
  },
};
