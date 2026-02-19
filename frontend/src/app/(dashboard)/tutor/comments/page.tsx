"use client";

import { useState, useEffect, useRef } from "react";
import {
    MessageCircle,
    Send,
    Loader2,
    User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    getPrivateComments,
    postPrivateComment,
    getTutorDashboard,
    type PrivateComment,
    type DashboardChild,
} from "@/lib/api/tutor";

function ChatBubble({
    comment,
    isMe,
}: {
    comment: PrivateComment;
    isMe: boolean;
}) {
    return (
        <div className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isMe
                    ? "bg-primary/20 text-primary"
                    : "bg-blue-100 text-blue-600"
                    }`}
            >
                <User className="h-4 w-4" />
            </div>

            {/* Bubble */}
            <div className={`max-w-[70%] ${isMe ? "text-right" : ""}`}>
                <p className="text-xs text-muted-foreground mb-1">
                    {comment.author.username}
                    <span className="ml-1 text-[10px]">
                        ({comment.author.role === "teacher" ? "선생님" : "학부모"})
                    </span>
                </p>
                <div
                    className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${isMe
                        ? "bg-primary text-primary-foreground rounded-tr-md"
                        : "bg-muted rounded-tl-md"
                        }`}
                >
                    {comment.content}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(comment.createdAt).toLocaleString("ko-KR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </div>
    );
}

export default function CommentsPage() {
    const [children, setChildren] = useState<DashboardChild[]>([]);
    const [selectedChild, setSelectedChild] = useState("");
    const [comments, setComments] = useState<PrivateComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState("");
    const [myUserId, setMyUserId] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadChildren() {
            try {
                const data = await getTutorDashboard();
                setChildren(data.children || []);
                if (data.children?.length > 0) {
                    setSelectedChild(data.children[0].student.id);
                }
            } catch (err) {
                console.error("Failed to load children:", err);
            } finally {
                setLoading(false);
            }
        }
        loadChildren();
    }, []);

    useEffect(() => {
        if (!selectedChild) return;
        async function loadComments() {
            try {
                setLoading(true);
                const data = await getPrivateComments(selectedChild);
                setComments(data);
                // myUserId 추정: 학부모 role의 author
                const myComment = data.find(
                    (c) => c.author.role === "parent"
                );
                if (myComment) setMyUserId(myComment.author.id);
            } catch (err) {
                console.error("Failed to load comments:", err);
                setComments([]);
            } finally {
                setLoading(false);
            }
        }
        loadComments();
    }, [selectedChild]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments]);

    const handleSend = async () => {
        if (!message.trim() || !selectedChild) return;

        // 선생님의 targetId를 찾는다
        const teacherComment = comments.find(
            (c) => c.author.role === "teacher"
        );
        const targetId = teacherComment?.author.id;

        if (!targetId) {
            alert("대화 상대 선생님이 없습니다.");
            return;
        }

        try {
            setSending(true);
            const newComment = await postPrivateComment({
                targetId,
                studentId: selectedChild,
                content: message.trim(),
            });
            setComments((prev) => [...prev, newComment]);
            setMessage("");
            if (newComment.author) setMyUserId(newComment.author.id);
        } catch (err) {
            console.error("Failed to send comment:", err);
        } finally {
            setSending(false);
        }
    };

    if (loading && children.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col h-[calc(100vh-56px)]">
            {/* 헤더 */}
            <div className="space-y-1 mb-4">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    선생님 대화
                </h1>
                <p className="text-muted-foreground">
                    자녀에 대한 비공개 코멘트를 선생님과 주고받으세요
                </p>
            </div>

            {/* 자녀 선택 */}
            <div className="flex items-center gap-2 mb-4">
                <label className="text-sm font-medium text-muted-foreground">자녀:</label>
                <div className="w-48">
                    <Select
                        options={children.map((c) => ({
                            value: c.student.id,
                            label: c.student.username,
                        }))}
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                    />
                </div>
            </div>

            {/* 채팅 영역 */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : comments.length > 0 ? (
                        <>
                            {comments.map((c) => (
                                <ChatBubble
                                    key={c.id}
                                    comment={c}
                                    isMe={c.author.id === myUserId}
                                />
                            ))}
                            <div ref={chatEndRef} />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <MessageCircle className="h-12 w-12 mb-3 opacity-30" />
                            <p className="text-sm">아직 대화가 없습니다</p>
                            <p className="text-xs mt-1">선생님과의 대화를 시작해보세요</p>
                        </div>
                    )}
                </CardContent>

                {/* 입력 영역 */}
                <div className="border-t p-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-muted/50"
                            disabled={sending}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!message.trim() || sending}
                            className="rounded-full px-4"
                        >
                            {sending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
