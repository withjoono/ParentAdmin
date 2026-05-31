"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface CoachStep {
    /** 대상 엘리먼트의 data-coach 값 */
    target: string;
    title: string;
    body: string;
}

interface Props {
    storageKey: string;
    steps: CoachStep[];
}

/**
 * 첫 방문 코치마크.
 * - 의존성 없이 구현 (외부 라이브러리 X)
 * - data-coach="key" 가 붙은 엘리먼트의 위치를 따라가는 말풍선
 * - localStorage[storageKey] = "1" 이면 노출 안 함
 */
export function Coachmark({ storageKey, steps }: Props) {
    const [active, setActive] = useState(false);
    const [stepIdx, setStepIdx] = useState(0);
    const [rect, setRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.localStorage.getItem(storageKey) === "1") return;
        // 첫 페인트 이후 타깃이 마운트되도록 약간 지연
        const t = setTimeout(() => setActive(true), 700);
        return () => clearTimeout(t);
    }, [storageKey]);

    useEffect(() => {
        if (!active) return;
        const step = steps[stepIdx];
        if (!step) return;
        const measure = () => {
            const el = document.querySelector<HTMLElement>(
                `[data-coach="${step.target}"]`
            );
            setRect(el ? el.getBoundingClientRect() : null);
        };
        measure();
        window.addEventListener("resize", measure);
        window.addEventListener("scroll", measure, true);
        return () => {
            window.removeEventListener("resize", measure);
            window.removeEventListener("scroll", measure, true);
        };
    }, [stepIdx, active, steps]);

    function close() {
        try {
            window.localStorage.setItem(storageKey, "1");
        } catch {}
        setActive(false);
    }
    function next() {
        if (stepIdx < steps.length - 1) setStepIdx((i) => i + 1);
        else close();
    }

    if (!active) return null;
    const step = steps[stepIdx];

    const tipTop = rect ? rect.bottom + 12 : window.innerHeight / 2;
    const tipLeft = rect
        ? Math.min(Math.max(rect.left, 16), window.innerWidth - 320)
        : window.innerWidth / 2 - 160;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* dim layer */}
            <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={close} />

            {/* highlight ring */}
            {rect && (
                <div
                    className="absolute rounded-lg ring-4 ring-primary/70 pointer-events-none transition-all"
                    style={{
                        top: rect.top - 6,
                        left: rect.left - 6,
                        width: rect.width + 12,
                        height: rect.height + 12,
                    }}
                />
            )}

            {/* tooltip */}
            <div
                className="absolute w-[300px] rounded-xl bg-card shadow-2xl border p-4 pointer-events-auto"
                style={{ top: tipTop, left: tipLeft }}
            >
                <button
                    type="button"
                    aria-label="닫기"
                    onClick={close}
                    className="absolute right-2 top-2 p-1 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
                <p className="text-xs text-primary font-semibold mb-1">
                    {stepIdx + 1} / {steps.length}
                </p>
                <h4 className="text-sm font-bold mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{step.body}</p>
                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={close}
                        className="text-[11px] text-muted-foreground hover:underline"
                    >
                        건너뛰기
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                    >
                        {stepIdx < steps.length - 1 ? "다음" : "시작하기"}
                    </button>
                </div>
            </div>
        </div>
    );
}
