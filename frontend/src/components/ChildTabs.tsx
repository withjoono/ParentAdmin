"use client";

import { User } from "lucide-react";

interface Child {
    id: string;
    name: string;
}

/**
 * 자녀 칩(탭) — 클릭 시 해당 자녀 섹션으로 부드러운 스크롤.
 */
export function ChildTabs({
    items,
    activeId,
    onSelect,
}: {
    items: Child[];
    activeId?: string;
    onSelect?: (id: string) => void;
}) {
    if (items.length <= 1) return null;

    function handleClick(id: string) {
        if (onSelect) onSelect(id);
        const el = document.querySelector<HTMLElement>(`[data-child-section="${id}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <div className="flex flex-wrap gap-2">
            {items.map((c) => (
                <button
                    key={c.id}
                    type="button"
                    onClick={() => handleClick(c.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeId === c.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground hover:bg-muted"
                    }`}
                >
                    <User className="h-3 w-3" />
                    {c.name}
                </button>
            ))}
        </div>
    );
}
