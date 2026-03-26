import { ReactNode } from "react";
interface LayoutProps {
title: string;
subtitle?: string;
children: ReactNode;
}
export default function Layout({ title, subtitle, children }: LayoutProps) {
return (
<div className="app-shell">
<div className="app-container">
<header className="page-header card">
<p className="eyebrow">Generation</p>
<h1>{title}</h1>
{subtitle && <p className="subtitle">{subtitle}</p>}
</header>
<main className="page-content">{children}</main>
</div>
</div>
);
}
