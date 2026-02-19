"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    BookOpen,
    Bell,
    Users,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { WonCircle } from "@/components/icons";
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
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            {/* ─── Top Navigation Bar ─── */}
            <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-screen-xl px-4">
                    <div className="flex h-14 items-center justify-between">
                        {/* Left: Logo */}
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
                                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                                    <span className="text-xs font-bold text-white">P</span>
                                </div>
                                <span className="text-[15px] font-bold tracking-tight text-primary">
                                    Parent Admin
                                </span>
                            </Link>
                        </div>

                        {/* Center: Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                        isActive(item.href)
                                            ? "text-primary bg-primary/10"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            ))}
                        </nav>

                        {/* Right: Icon buttons */}
                        <div className="hidden md:flex items-center gap-1">
                            {/* 결제 */}
                            <button
                                className="relative flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors"
                                title="결제"
                            >
                                <WonCircle className="h-5 w-5" />
                            </button>
                            {/* 알림 */}
                            <Link
                                href="/notifications"
                                className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="알림"
                            >
                                <Bell className="h-5 w-5" />
                            </Link>
                            {/* 계정연동 */}
                            <button
                                className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="계정연동"
                            >
                                <Users className="h-5 w-5" />
                            </button>
                            {/* 로그아웃 */}
                            <button
                                className="ml-1 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-colors"
                                title="로그아웃"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden lg:inline">로그아웃</span>
                            </button>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className="flex md:hidden p-2 text-gray-500 hover:text-gray-900"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileOpen && (
                        <div className="md:hidden border-t border-gray-200 pb-3 pt-2">
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                            isActive(item.href)
                                                ? "text-primary bg-primary/10"
                                                : "text-gray-600 hover:bg-gray-100"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                            <div className="mt-3 border-t border-gray-100 pt-3 px-3">
                                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100">
                                    <LogOut className="h-4 w-4" />
                                    로그아웃
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}
