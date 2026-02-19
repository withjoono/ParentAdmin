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
    Clock,
    TrendingUp,
    MessageCircle,
    FileText,
} from "lucide-react";
import { WonCircle } from "@/components/icons";

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
        title: "학습 타임라인",
        href: "/tutor/timeline",
        icon: Clock,
    },
    {
        title: "성적 추이",
        href: "/tutor/test-trend",
        icon: TrendingUp,
    },
    {
        title: "선생님 대화",
        href: "/tutor/comments",
        icon: MessageCircle,
    },
    {
        title: "수업 기록",
        href: "/tutor/class-records",
        icon: FileText,
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
            {/* ─── Top Navigation Bar (gb-header design system) ─── */}
            <header className="gb-header">
                <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    {/* Left: Logo */}
                    <Link href="/" className="gb-header-brand" style={{ textDecoration: 'none' }}>
                        <span className="gb-header-brand-dot" style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-on-primary)' }}>P</span>
                        </span>
                        Parent Admin
                    </Link>

                    {/* Center: Desktop Nav */}
                    <nav className="gb-header-nav gb-hide-mobile">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`gb-header-nav-link${isActive(item.href) ? " active" : ""}`}
                            >
                                <item.icon style={{ width: 16, height: 16 }} />
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: Icon buttons */}
                    <div className="gb-header-actions gb-hide-mobile">
                        {/* 결제 */}
                        <button
                            className="gb-header-icon-btn"
                            style={{ color: 'var(--color-primary)' }}
                            title="결제"
                        >
                            <WonCircle style={{ width: 20, height: 20 }} />
                        </button>
                        {/* 알림 */}
                        <Link
                            href="/notifications"
                            className="gb-header-icon-btn"
                            title="알림"
                        >
                            <Bell style={{ width: 20, height: 20 }} />
                        </Link>
                        {/* 계정연동 */}
                        <button
                            className="gb-header-icon-btn"
                            title="계정연동"
                        >
                            <Users style={{ width: 20, height: 20 }} />
                        </button>
                        {/* 로그아웃 */}
                        <button
                            className="gb-header-nav-link"
                            style={{ color: 'var(--color-text-tertiary)' }}
                            title="로그아웃"
                        >
                            <LogOut style={{ width: 16, height: 16 }} />
                            <span className="gb-hide-mobile">로그아웃</span>
                        </button>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="gb-header-icon-btn gb-hide-desktop"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div style={{ borderTop: '1px solid var(--color-border-light)', paddingBottom: 'var(--space-3)', paddingTop: 'var(--space-2)' }} className="gb-hide-desktop">
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', padding: '0 var(--space-4)' }}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`gb-header-nav-link${isActive(item.href) ? " active" : ""}`}
                                    style={{ padding: 'var(--space-2) var(--space-3)' }}
                                >
                                    <item.icon style={{ width: 16, height: 16 }} />
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                        <div style={{ marginTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-3)', padding: '0 var(--space-4)' }}>
                            <button className="gb-header-nav-link" style={{ width: '100%', color: 'var(--color-text-tertiary)' }}>
                                <LogOut style={{ width: 16, height: 16 }} />
                                로그아웃
                            </button>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
