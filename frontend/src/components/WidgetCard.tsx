"use client";

import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HelpPopover } from "./HelpPopover";

/**
 * 대시보드 위젯 공통 카드.
 * - helpText: 우상단 ❓ 컨텍스트 도움말
 * - emptyText: children이 falsy일 때 자동 빈 상태
 */
export function WidgetCard({
    icon,
    title,
    children,
    loading,
    helpText,
    emptyText,
    empty,
}: {
    icon: React.ReactNode;
    title: string;
    children?: React.ReactNode;
    loading?: boolean;
    helpText?: string;
    emptyText?: string;
    /** children 외부에서 빈 상태를 강제로 지정할 때 사용 */
    empty?: boolean;
}) {
    const isEmpty = empty ?? (!loading && !children);

    return (
        <Card className="flex-1 min-w-0">
            <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        {icon}
                        {title}
                    </p>
                    {helpText && <HelpPopover text={helpText} />}
                </div>
                {loading ? (
                    <div className="flex justify-center py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                ) : isEmpty ? (
                    <p className="text-xs text-muted-foreground">
                        {emptyText ?? "정보가 없습니다"}
                    </p>
                ) : (
                    children
                )}
            </div>
        </Card>
    );
}
