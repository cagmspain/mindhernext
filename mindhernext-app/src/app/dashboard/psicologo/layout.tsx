// src/app/dashboard/psicologo/layout.tsx
"use client";

import Link from "next/link";

export default function PsicologoLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			{/* Sidebar */}
			<aside className="w-64 bg-gray-900 text-white p-6">
				<h2 className="text-xl font-bold mb-6">Panel del Psicólogo</h2>
				<nav className="flex flex-col space-y-4">
					<Link href="/dashboard/psicologo" className="hover:text-green-400">
						Inicio
					</Link>
					<Link
						href="/dashboard/psicologo/citas"
						className="hover:text-green-400"
					>
						Citas
					</Link>
					<Link
						href="/dashboard/psicologo/disponibilidad"
						className="hover:text-green-400"
					>
						Disponibilidad
					</Link>
					<Link
						href="/dashboard/psicologo/perfil"
						className="hover:text-green-400"
					>
						Mi perfil
					</Link>
				</nav>
			</aside>

			{/* Contenido principal */}
			<main className="flex-1 bg-black text-white p-8">{children}</main>
		</div>
	);
}
