"use client";

export default function NotificationsPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">🔔 알림</h1>
                <p className="text-muted-foreground">
                    자녀 관련 알림을 확인하세요
                </p>
            </div>

            <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>알림이 없습니다</p>
            </div>
        </div>
    );
}
