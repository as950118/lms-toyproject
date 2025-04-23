import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function TeacherFeedResults({}) {
    const { teacherId, feedId } = useParams();
    const [feed, setFeed] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
    });

    useEffect(() => {
        const fetchFeedAndResults = async () => {
            setLoading(true);
            try {
                const feedRes = await api.get(`/feeds/${feedId}/`);
                setFeed(feedRes.data);
                const resultsRes = await api.get(`/feedresults/?feed=${feedId}`);
                // 각 결과의 학생 정보도 가져오기
                const resultsWithStudent = await Promise.all(
                    resultsRes.data.map(async (fr) => {
                        const studentRes = await api.get(`/users/${fr.student}/`);
                        return {
                            ...fr,
                            student: studentRes.data,
                        };
                    })
                );
                setResults(resultsWithStudent);
            } catch (err) {
                alert("피드 결과를 불러오지 못했습니다.");
            }
            setLoading(false);
        };
        fetchFeedAndResults();
        // eslint-disable-next-line
    }, [feedId]);

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <h2>
                피드별 학생 결과 {feed && `- ${feed.title}`}
                <span style={{ float: "right" }}>
          <Link to={`/teacher/groups/${feed?.group}/feeds`}>피드 목록으로</Link>
        </span>
            </h2>
            {loading ? (
                <div>로딩중...</div>
            ) : (
                <table border="1" cellPadding="8" style={{ width: "100%" }}>
                    <thead>
                    <tr>
                        <th>학생명</th>
                        <th>이메일</th>
                        <th>상태</th>
                        <th>점수</th>
                        <th>제출일시</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map((result) => (
                        <tr key={result.feed_result_id}>
                            <td>{result.student.name}</td>
                            <td>{result.student.email}</td>
                            <td>{result.status}</td>
                            <td>{result.score ?? "-"}</td>
                            <td>{result.submitted_at ? new Date(result.submitted_at).toLocaleString() : "-"}</td>
                        </tr>
                    ))}
                    {results.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                결과가 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TeacherFeedResults;