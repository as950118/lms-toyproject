# LMS Toy Project

## 1. 테이블 정의

### 1.1. 사용자 (User)

| 컬럼명         | 타입      | 설명                        |
| -------------- | --------- | --------------------------- |
| user_id        | INT (PK)  | 사용자 고유 ID              |
| name           | STRING    | 이름                        |
| email          | STRING    | 이메일                      |
| password_hash  | STRING    | 비밀번호 해시               |
| role           | ENUM      | 'teacher', 'student'        |
| created_at     | DATETIME  | 생성일시                    |

---

### 1.2. 수준 (Level)

| 컬럼명     | 타입      | 설명                        |
| ---------- | --------- | --------------------------- |
| level_id   | INT (PK)  | 수준 고유 ID                |
| name       | STRING    | 수준명 (예: 초급, 중급 등)  |
| description| STRING    | 설명                        |

---

### 1.3. 학년 (Grade)

| 컬럼명     | 타입      | 설명                        |
| ---------- | --------- | --------------------------- |
| grade_id   | INT (PK)  | 학년 고유 ID                |
| name       | STRING    | 학년명                      |
| description| STRING    | 설명                        |

---

### 1.4. 그룹 (Group)

| 컬럼명     | 타입      | 설명                        |
| ---------- | --------- | --------------------------- |
| group_id   | INT (PK)  | 그룹 고유 ID                |
| name       | STRING    | 그룹명                      |
| level_id   | INT (FK)  | 수준 ID (Level.level_id)    |
| grade_id   | INT (FK)  | 학년 ID (Grade.grade_id)    |
| teacher_id | INT (FK)  | 담당 선생님 (User.user_id)  |

---

### 1.5. 그룹-학생 매핑 (GroupStudent)

| 컬럼명           | 타입      | 설명                        |
| ---------------- | --------- | --------------------------- |
| group_student_id | INT (PK)  | 매핑 고유 ID                |
| group_id         | INT (FK)  | 그룹 ID (Group.group_id)    |
| student_id       | INT (FK)  | 학생 ID (User.user_id)      |
| joined_at        | DATETIME  | 그룹 가입일                 |

---

### 1.6. 피드 (Feed)

| 컬럼명      | 타입      | 설명                              |
| ----------- | --------- | --------------------------------- |
| feed_id     | INT (PK)  | 피드 고유 ID                      |
| group_id    | INT (FK)  | 그룹 ID (Group.group_id)          |
| title       | STRING    | 피드 제목                         |
| description | STRING    | 피드 설명                         |
| feed_type   | ENUM      | 'video', 'multiple_choice', 'grammar', ... |
| created_at  | DATETIME  | 생성일시                          |

---

### 1.7. 동영상 피드 (VideoFeed)

| 컬럼명           | 타입      | 설명                        |
| ---------------- | --------- | --------------------------- |
| feed_id          | INT (PK, FK) | 피드 ID (Feed.feed_id)   |
| video_url        | STRING    | 동영상 URL                  |
| duration_seconds | INT       | 동영상 길이(초)             |

---

### 1.8. 퀴즈 피드 (QuizFeed)

| 컬럼명        | 타입      | 설명                        |
| ------------- | --------- | --------------------------- |
| feed_id       | INT (PK, FK) | 피드 ID (Feed.feed_id)   |
| question      | STRING    | 문제 내용                   |
| question_type | ENUM      | 문제 유형                   |
| options       | JSON      | 선택지                      |
| answer        | STRING    | 정답                        |

---

### 1.9. 피드-학생 결과 (FeedResult)

| 컬럼명         | 타입      | 설명                              |
| -------------- | --------- | --------------------------------- |
| feed_result_id | INT (PK)  | 결과 고유 ID                      |
| feed_id        | INT (FK)  | 피드 ID (Feed.feed_id)            |
| student_id     | INT (FK)  | 학생 ID (User.user_id)            |
| status         | ENUM      | 'not_started', 'in_progress', 'completed' |
| score          | INT       | 점수 (nullable, 문제 유형일 때)   |
| submitted_at   | DATETIME  | 제출일시                          |

---

### 1.10. 동영상 결과 (VideoResult)

| 컬럼명            | 타입      | 설명                        |
| ----------------- | --------- | --------------------------- |
| feed_result_id    | INT (PK, FK) | 결과 ID (FeedResult.feed_result_id) |
| watch_time_seconds| INT       | 시청 시간(초)               |

---

### 1.11. 퀴즈 결과 (QuizResult)

| 컬럼명           | 타입      | 설명                        |
| ---------------- | --------- | --------------------------- |
| feed_result_id   | INT (PK, FK) | 결과 ID (FeedResult.feed_result_id) |
| selected_answer  | STRING    | 선택한 답                   |
| is_correct       | BOOLEAN   | 정답 여부                   |

---

### 1.12. 피드 스케줄 (FeedSchedule)

| 컬럼명         | 타입      | 설명                        |
| -------------- | --------- | --------------------------- |
| schedule_id    | INT (PK)  | 스케줄 고유 ID              |
| feed_id        | INT (FK)  | 피드 ID (Feed.feed_id)      |
| scheduled_time | DATETIME  | 예정 시간                   |
| duration_minutes| INT      | 학습 가능 시간(분)          |

---

## 2. 관계 설명

- **User**: 선생님과 학생 모두 포함. `role`로 구분
- **Level/Grade**: 그룹의 수준과 학년을 정규화
- **Group**: 선생님이 여러 그룹을 가질 수 있음. 그룹은 한 명의 선생님이 담당. 수준/학년은 별도 테이블 참조
- **GroupStudent**: 학생은 여러 그룹에 속할 수 있음 (예: 레벨별, 과목별)
- **Feed**: 그룹 단위로 생성. 같은 그룹 학생들에게 동일 피드가 배포됨. 피드 유형별 상세 정보는 별도 테이블로 분리
- **FeedResult**: 학생별 피드 결과 기록. 학습 진도, 점수 등. 유형별 결과는 별도 테이블로 분리
- **FeedSchedule**: 피드의 스케줄 관리

---

## 3. ERD 다이어그램 (Mermaid)
```mermaid
erDiagram
    USER {
        int user_id PK
        string name
        string email
        string password_hash
        enum role
        datetime created_at
    }
    LEVEL {
        int level_id PK
        string name
        string description
    }
    GRADE {
        int grade_id PK
        string name
        string description
    }
    GROUP {
        int group_id PK
        string name
        int level_id FK
        int grade_id FK
        int teacher_id FK
    }
    GROUPSTUDENT {
        int group_student_id PK
        int group_id FK
        int student_id FK
        datetime joined_at
    }
    FEED {
        int feed_id PK
        int group_id FK
        string title
        string description
        enum feed_type
        datetime created_at
    }
    VIDEO_FEED {
        int feed_id PK, FK
        string video_url
        int duration_seconds
    }
    QUIZ_FEED {
        int feed_id PK, FK
        string question
        enum question_type
        string options
        string answer
    }
    FEEDRESULT {
        int feed_result_id PK
        int feed_id FK
        int student_id FK
        enum status
        int score
        datetime submitted_at
    }
    VIDEO_RESULT {
        int feed_result_id PK, FK
        int watch_time_seconds
    }
    QUIZ_RESULT {
        int feed_result_id PK, FK
        string selected_answer
        boolean is_correct
    }
    FEED_SCHEDULE {
        int schedule_id PK
        int feed_id FK
        datetime scheduled_time
        int duration_minutes
    }

    USER ||--o{ GROUP : "teaches"
    LEVEL ||--o{ GROUP : "is_level_of"
    GRADE ||--o{ GROUP : "is_grade_of"
    GROUP ||--o{ GROUPSTUDENT : "has"
    USER ||--o{ GROUPSTUDENT : "joins"
    GROUP ||--o{ FEED : "has"
    FEED ||--o{ FEEDRESULT : "assigned"
    USER ||--o{ FEEDRESULT : "submits"
    FEED ||--|| VIDEO_FEED : "video_detail"
    FEED ||--|| QUIZ_FEED : "quiz_detail"
    FEEDRESULT ||--|| VIDEO_RESULT : "video_result"
    FEEDRESULT ||--|| QUIZ_RESULT : "quiz_result"
    FEED ||--o{ FEED_SCHEDULE : "scheduled"
```