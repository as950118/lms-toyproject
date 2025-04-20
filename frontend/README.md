# LMS Toy Project - Frontend

이 디렉토리는 LMS Toy Project의 React 기반 프론트엔드 애플리케이션입니다.

---

## 1. 프로젝트 생성

아래 명령어로 frontend 디렉토리에서 React 프로젝트를 생성하세요.

```bash
cd frontend
npx create-react-app lms-frontend --template cra-template
cd lms-frontend
```

---

2. 주요 폴더 구조
```
   frontend/
   └── lms-frontend/
      ├── public/
      ├── src/
      │    ├── components/
      │    ├── pages/
      │    ├── api/
      │    ├── App.js (또는 App.tsx)
      │    └── index.js (또는 index.tsx)
      ├── package.json
      └── ...
```
components/ : 재사용 가능한 UI 컴포넌트
pages/ : 주요 화면(페이지) 컴포넌트
api/ : 백엔드 API 연동 함수

---

3. 의존성 설치
   프로젝트 루트(lms-frontend)에서:
```
npm install axios react-router-dom
```