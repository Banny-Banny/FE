module.exports = {
  arrowParens: 'always', // 화살표 함수 파라미터가 하나여도 괄호 사용 (예: (x) => x)
  bracketSameLine: true, // JSX 태그의 닫는 괄호(>)를 다음 줄로 내리지 않고 끝에 붙임
  bracketSpacing: true, // 객체 리터럴 괄호 사이에 공백 추가 (예: { foo: bar })
  singleQuote: true, // 문자열에 쌍따옴표("") 대신 홑따옴표('') 사용
  trailingComma: 'all', // 객체나 배열의 마지막 항목 뒤에도 항상 콤마 추가 (Git Diff 관리 용이)
  semi: true, // 문장 끝에 세미콜론(;)을 항상 붙임
  printWidth: 100, // 한 줄의 길이가 100자를 넘으면 자동으로 줄바꿈
  tabWidth: 2, // 들여쓰기 간격은 스페이스 2칸
  endOfLine: 'auto', // OS(맥/윈도우)에 따른 줄바꿈 문자(LF/CRLF) 차이 자동 처리
  insertFinalNewline: false, // 파일 끝에 빈 줄 추가하지 않음
};
