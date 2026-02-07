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
        <aside className="flex h-screen w-64 flex-col border-r bg-card">
            <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-xl font-bold text-primary">
                    🎓 학부모
                </h1>
            </div>

            <nav className="flex-1 overflow-auto space-y-1 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive(item.href)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="border-t p-4">
                <div className="mb-2 px-3 text-sm text-muted-foreground">학부모</div>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                    <LogOut className="h-5 w-5" />
                    로그아웃
                </button>
            </div>
        </aside>
    );
}
