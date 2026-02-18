"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Bell,
    LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    title: string;
    href: string;
    icon: any;
}

const navItems: NavItem[] = [
    {
        title: "대시보드",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "수업 현황",
        href: "/class-status",
        icon: BookOpen,
    },
    {
        title: "알림",
        href: "/notifications",
        icon: Bell,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <aside className="flex h-screen w-64 flex-col" style={{ borderRight: '1px solid var(--color-border-light)', background: 'var(--color-bg-elevated)' }}>
            <div className="flex h-14 items-center px-6" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <h1 className="text-[15px] font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
                    Parent Admin
                </h1>
            </div>

            <nav className="flex-1 overflow-auto space-y-1 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive(item.href)
                                ? "text-white"
                                : "hover:bg-gray-100"
                        )}
                        style={isActive(item.href) ? { background: 'var(--color-primary)', color: '#fff' } : { color: 'var(--color-text-secondary)' }}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="p-4" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                <div className="mb-2 px-3 text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>학부모</div>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100" style={{ color: 'var(--color-text-tertiary)' }}>
                    <LogOut className="h-4 w-4" />
                    로그아웃
                </button>
            </div>
        </aside>
    );
}
