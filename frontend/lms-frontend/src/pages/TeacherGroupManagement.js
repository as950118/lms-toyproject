import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * 선생님 그룹 관리 페이지
 * - 내 그룹 목록 조회
 * - 그룹 생성
 * - 그룹 삭제
 *
 * @param {Object} props
 * @param {number} props.teacherId - 현재 로그인한 선생님의 user_id
 */
function TeacherGroupManagement({ teacherId }) {
    const [groups, setGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: "", level: "", grade: "" });
    const [loading, setLoading] = useState(false);

    // API base URL 환경변수 사용 (백엔드 주소)
    const api = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
    });

    // 그룹 목록 불러오기
    const fetchGroups = async () => {
        setLoading(true);
        try {
            // teacherId로 필터링 (백엔드에서 지원 필요)
            const res = await api.get(`/groups/?teacher=${teacherId}`);
            setGroups(res.data);
        } catch (err) {
            alert("그룹 목록을 불러오지 못했습니다.");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (teacherId) fetchGroups();
        // eslint-disable-next-line
    }, [teacherId]);

    // 그룹 생성
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await api.post("/groups/", {
                ...newGroup,
                teacher: teacherId,
            });
            setNewGroup({ name: "", level: "", grade: "" });
            fetchGroups();
        } catch (err) {
            alert("그룹 생성 실패");
        }
    };

    // 그룹 삭제
    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await api.delete(`/groups/${groupId}/`);
            fetchGroups();
        } catch (err) {
            alert("삭제 실패");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
    <h2>내 그룹 관리</h2>
    <form onSubmit={handleCreateGroup} style={{ marginBottom: 20 }}>
    <input
        type="text"
    placeholder="그룹명"
    value={newGroup.name}
    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
    required
    />
    <input
        type="text"
    placeholder="수준(예: 초급)"
    value={newGroup.level}
    onChange={(e) => setNewGroup({ ...newGroup, level: e.target.value })}
    required
    />
    <input
        type="text"
    placeholder="학년"
    value={newGroup.grade}
    onChange={(e) => setNewGroup({ ...newGroup, grade: e.target.value })}
    required
    />
    <button type="submit" style={{ marginLeft: 10 }}>그룹 생성</button>
    </form>
    {loading ? (
        <div>로딩중...</div>
    ) : (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
            <tr>
                <th>그룹명</th>
        <th>수준</th>
        <th>학년</th>
        <th>관리</th>
        </tr>
        </thead>
        <tbody>
        {groups.map((group) => (
                <tr key={group.group_id}>
                    <td>{group.name}</td>
                    <td>{group.level}</td>
                    <td>{group.grade}</td>
                    <td>
                    {/* 수정 기능은 별도 구현 필요 */}
                    <button onClick={() => handleDeleteGroup(group.group_id)}>
        삭제
        </button>
        </td>
        </tr>
    ))}
        {groups.length === 0 && (
            <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
            그룹이 없습니다.
        </td>
        </tr>
        )}
        </tbody>
        </table>
    )}
    </div>
);
}

export default TeacherGroupManagement;