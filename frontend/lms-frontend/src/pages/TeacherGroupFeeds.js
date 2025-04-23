import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function TeacherGroupFeeds({}) {
    const { teacherId, groupId } = useParams();
    const [feeds, setFeeds] = useState([]);
    const [group, setGroup] = useState(null);
    const [newFeed, setNewFeed] = useState({
        title: "",
        description: "",
        feed_type: "video",
        content_url: "",
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
    });

    useEffect(() => {
        const fetchGroupAndFeeds = async () => {
            setLoading(true);
            try {
                const groupRes = await api.get(`/groups/${groupId}/`);
                setGroup(groupRes.data);
                const feedsRes = await api.get(`/feeds/?group=${groupId}`);
                setFeeds(feedsRes.data);
            } catch (err) {
                alert("피드 목록을 불러오지 못했습니다.");
            }
            setLoading(false);
        };
        fetchGroupAndFeeds();
        // eslint-disable-next-line
    }, [groupId]);

    const handleCreateFeed = async (e) => {
        e.preventDefault();
        try {
            await api.post("/feeds/", {
                ...newFeed,
                group: groupId,
            });
            setNewFeed({
                title: "",
                description: "",
                feed_type: "video",
                content_url: "",
            });
            // 새로고침
            const feedsRes = await api.get(`/feeds/?group=${groupId}`);
            setFeeds(feedsRes.data);
        } catch (err) {
            alert("피드 생성 실패");
        }
    };

    const handleDeleteFeed = async (feedId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await api.delete(`/feeds/${feedId}/`);
            setFeeds(feeds.filter((f) => f.feed_id !== feedId));
        } catch (err) {
            alert("삭제 실패");
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2>
                그룹 피드 관리 {group && `- ${group.name}`}
                <span style={{ float: "right" }}>
          <Link to={`/teacher/groups`}>그룹 목록으로</Link>
        </span>
            </h2>
            <form onSubmit={handleCreateFeed} style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="피드 제목"
                    value={newFeed.title}
                    onChange={(e) => setNewFeed({ ...newFeed, title: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="설명"
                    value={newFeed.description}
                    onChange={(e) =>
                        setNewFeed({ ...newFeed, description: e.target.value })
                    }
                    required
                />
                <select
                    value={newFeed.feed_type}
                    onChange={(e) =>
                        setNewFeed({ ...newFeed, feed_type: e.target.value })
                    }
                >
                    <option value="video">동영상</option>
                    <option value="multiple_choice">객관식</option>
                    <option value="grammar">문법</option>
                </select>
                <input
                    type="text"
                    placeholder="콘텐츠 URL"
                    value={newFeed.content_url}
                    onChange={(e) =>
                        setNewFeed({ ...newFeed, content_url: e.target.value })
                    }
                />
                <button type="submit" style={{ marginLeft: 10 }}>
                    피드 생성
                </button>
            </form>
            {loading ? (
                <div>로딩중...</div>
            ) : (
                <table border="1" cellPadding="8" style={{ width: "100%" }}>
                    <thead>
                    <tr>
                        <th>제목</th>
                        <th>설명</th>
                        <th>유형</th>
                        <th>URL</th>
                        <th>관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {feeds.map((feed) => (
                        <tr key={feed.feed_id}>
                            <td>
                                <Link to={`/teacher/feeds/${feed.feed_id}/results`}>
                                    {feed.title}
                                </Link>
                            </td>
                            <td>{feed.description}</td>
                            <td>{feed.feed_type}</td>
                            <td>
                                {feed.content_url ? (
                                    <a href={feed.content_url} target="_blank" rel="noreferrer">
                                        링크
                                    </a>
                                ) : (
                                    "-"
                                )}
                            </td>
                            <td>
                                {/* 수정 기능은 별도 구현 필요 */}
                                <button onClick={() => handleDeleteFeed(feed.feed_id)}>
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    {feeds.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                피드가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TeacherGroupFeeds;