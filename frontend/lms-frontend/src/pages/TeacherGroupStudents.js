import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function TeacherGroupStudents({}) {
    const { teacherId, groupId } = useParams();
    const [students, setStudents] = useState([]);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);

    // 학생 추가 관련 상태
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState("");

    const api = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
    });

    // 그룹 및 그룹 학생 목록 불러오기
    useEffect(() => {
        const fetchGroupAndStudents = async () => {
            setLoading(true);
            try {
                const groupRes = await api.get(`/groups/${groupId}/`);
                setGroup(groupRes.data);
                const studentsRes = await api.get(`/groupstudents/?group=${groupId}`);
                // studentsRes.data는 groupstudent 객체 배열이므로, student 필드만 추출
                const studentList = await Promise.all(
                    studentsRes.data.map(async (gs) => {
                        const studentRes = await api.get(`/users/${gs.student}/`);
                        // 학생별 진도/점수(FeedResult)도 조회
                        const feedResultsRes = await api.get(`/feedresults/?student=${gs.student}&feed__group=${groupId}`);
                        return {
                            ...studentRes.data,
                            feedResults: feedResultsRes.data,
                        };
                    })
                );
                setStudents(studentList);
            } catch (err) {
                alert("학생 목록을 불러오지 못했습니다.");
            }
            setLoading(false);
        };
        fetchGroupAndStudents();
        // eslint-disable-next-line
    }, [groupId]);

    // 전체 학생 목록 불러오기 (학생 추가용)
    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const res = await api.get("/users/?role=student");
                setAllStudents(res.data);
            } catch (err) {
                // 무시
            }
        };
        fetchAllStudents();
        // eslint-disable-next-line
    }, []);

    // 학생 추가
    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!selectedStudentId) return;
        try {
            await api.post("/groupstudents/", {
                group: groupId,
                student: selectedStudentId,
            });
            setSelectedStudentId("");
            // 추가 후 목록 새로고침
            setLoading(true);
            const studentsRes = await api.get(`/groupstudents/?group=${groupId}`);
            const studentList = await Promise.all(
                studentsRes.data.map(async (gs) => {
                    const studentRes = await api.get(`/users/${gs.student}/`);
                    const feedResultsRes = await api.get(`/feedresults/?student=${gs.student}&feed__group=${groupId}`);
                    return {
                        ...studentRes.data,
                        feedResults: feedResultsRes.data,
                    };
                })
            );
            setStudents(studentList);
            setLoading(false);
        } catch (err) {
            alert("학생 추가 실패 (이미 그룹에 속해있을 수 있습니다)");
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2>
                그룹 학생 관리 {group && `- ${group.name}`}
                <span style={{ float: "right" }}>
                    <Link to={`/teacher/${teacherId}/groups`}>그룹 목록으로</Link>
                </span>
            </h2>
            {/* 학생 추가 폼 */}
            <form onSubmit={handleAddStudent} style={{ marginBottom: 20 }}>
                <label>
                    학생 추가:{" "}
                    <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        required
                    >
                        <option value="">학생 선택</option>
                        {allStudents
                            .filter(
                                (stu) =>
                                    !students.some((s) => s.user_id === stu.user_id)
                            )
                            .map((stu) => (
                                <option key={stu.user_id} value={stu.user_id}>
                                    {stu.name} ({stu.email})
                                </option>
                            ))}
                    </select>
                </label>
                <button type="submit" style={{ marginLeft: 10 }}>
                    추가
                </button>
            </form>
            {loading ? (
                <div>로딩중...</div>
            ) : (
                <table border="1" cellPadding="8" style={{ width: "100%" }}>
                    <thead>
                    <tr>
                        <th>학생명</th>
                        <th>이메일</th>
                        <th>진도/점수(최근)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr key={student.user_id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>
                                {student.feedResults.length === 0
                                    ? "기록 없음"
                                    : student.feedResults
                                        .map(
                                            (fr) =>
                                                `피드:${fr.feed} 상태:${fr.status} 점수:${fr.score ?? "-"}`
                                        )
                                        .join(" / ")}
                            </td>
                        </tr>
                    ))}
                    {students.length === 0 && (
                        <tr>
                            <td colSpan={3} style={{ textAlign: "center" }}>
                                학생이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TeacherGroupStudents;