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
```
components/ : 재사용 가능한 UI 컴포넌트
pages/ : 주요 화면(페이지) 컴포넌트
api/ : 백엔드 API 연동 함수
```

---

3. 의존성 설치
   프로젝트 루트(lms-frontend)에서:
```
npm install axios react-router-dom
```

4. 선생님(Teacher) 관점 주요 기능
```
그룹 관리
   내가 담당하는 그룹 목록 조회
   그룹 생성/수정/삭제
   그룹에 학생 추가/삭제
학생 관리
   내 그룹에 소속된 학생 목록 조회
   학생별 학습 진도/점수 확인
   피드(학습자료) 관리
   내 그룹에 피드(강의, 문제 등) 생성/수정/삭제
   피드별로 학생들의 결과(진도, 점수 등) 확인
피드 결과 관리
   특정 피드에 대한 전체 학생의 결과(진도, 점수 등) 통계 조회
```
5. 학생(Student) 관점 주요 기능
```
내 정보/내 그룹
   내 정보(프로필) 조회/수정
   내가 속한 그룹 목록 조회
학습 피드
   내 그룹에서 배정된 피드(학습자료) 목록 조회
   피드 상세(강의 보기, 문제 풀기 등)
   피드 결과(진도, 점수 등) 제출
학습 결과
   내가 제출한 피드 결과(진도, 점수 등) 목록/상세 조회
```
6. 공통/관리자 기능 (참고)
```
전체 사용자 관리(관리자)
전체 그룹/피드/결과 관리(관리자)
```
