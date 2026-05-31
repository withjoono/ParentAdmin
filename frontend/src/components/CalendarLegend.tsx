"use client";

const CHILD_COLORS = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-pink-500",
];

interface Child {
    id: string;
    name: string;
}

/**
 * 캘린더 상단 범례 — 자녀별 색상 + 이벤트 타입.
 */
export function CalendarLegend({ items }: { items: Child[] }) {
    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground mb-2">
            {items.length > 0 && (
                <div className="flex items-center gap-2">
                    <span>자녀별</span>
                    {items.map((c, i) => (
                        <span key={c.id} className="flex items-center gap-1">
                            <span
                                className={`inline-block h-2 w-2 rounded-full ${CHILD_COLORS[i % CHILD_COLORS.length]}`}
                            />
                            {c.name}
                        </span>
                    ))}
                </div>
            )}
            <div className="flex items-center gap-2">
                <span>유형</span>
                <Legend label="수업" cls="bg-blue-100 text-blue-700" />
                <Legend label="과제" cls="bg-amber-100 text-amber-700" />
                <Legend label="시험" cls="bg-rose-100 text-rose-700" />
                <Legend label="학사" cls="bg-emerald-100 text-emerald-700" />
            </div>
        </div>
    );
}

function Legend({ label, cls }: { label: string; cls: string }) {
    return (
        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${cls}`}>
            {label}
        </span>
    );
}
