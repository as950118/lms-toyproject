import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TeacherGroupManagement from "./pages/TeacherGroupManagement";
import TeacherGroupStudents from "./pages/TeacherGroupStudents";
import TeacherGroupFeeds from "./pages/TeacherGroupFeeds";
import TeacherFeedResults from "./pages/TeacherFeedResults";
// import StudentDashboard from "./pages/StudentDashboard"; // 학생화면 추가시

function App() {
    // 예시: teacherId를 임시로 1로 지정 (실제론 로그인 정보에서 받아야 함)
    const teacherId = 1;

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/teacher/:teacherId/groups"
                    element={<TeacherGroupManagement />}
                />
                <Route
                    path="/teacher/:teacherId/groups/:groupId/students"
                    element={<TeacherGroupStudents />}
                />
                <Route
                    path="/teacher/:teacherId/groups/:groupId/feeds"
                    element={<TeacherGroupFeeds />}
                />
                <Route
                    path="/teacher/:teacherId/feeds/:feedId/results"
                    element={<TeacherFeedResults />}
                />
                {/* <Route path="/student/dashboard" element={<StudentDashboard />} /> */}
                {/* 다른 라우트도 추가 가능 */}
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;