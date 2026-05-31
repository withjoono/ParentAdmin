"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

/**
 * 위젯 우상단 ❓ 아이콘 + Popover.
 * 200자 이내의 컨텍스트 도움말을 보여준다.
 */
export function HelpPopover({ text }: { text: string }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function onClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        window.addEventListener("mousedown", onClick);
        return () => window.removeEventListener("mousedown", onClick);
    }, [open]);

    return (
        <div ref={ref} className="relative inline-block">
            <button
                type="button"
                aria-label="도움말"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((v) => !v);
                }}
                className="rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
                <HelpCircle className="h-3.5 w-3.5" />
            </button>
            {open && (
                <div
                    role="tooltip"
                    className="absolute right-0 top-6 z-40 w-56 rounded-lg border bg-card p-3 text-[11px] leading-relaxed text-foreground shadow-lg"
                >
                    {text}
                </div>
            )}
        </div>
    );
}
