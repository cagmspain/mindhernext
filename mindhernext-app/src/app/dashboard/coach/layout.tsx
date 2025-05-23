// src/app/dashboard/coach/layout.tsx
import Link from "next/link";
import type { ReactNode } from "react";

export default function CoachLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen">
			<aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
				<h2 className="text-xl font-bold mb-6">Panel del Coach</h2>
				<nav className="space-y-2">
					<Link href="/dashboard/coach" className="block hover:underline">
						Inicio
					</Link>
					<Link
						href="/dashboard/coach/eventos"
						className="block hover:underline"
					>
						Eventos
					</Link>
					<Link
						href="/dashboard/coach/perfil"
						className="block hover:underline"
					>
						Mi perfil
					</Link>
				</nav>
			</aside>
			<main className="flex-1 bg-black text-white p-6">{children}</main>
		</div>
	);
}
