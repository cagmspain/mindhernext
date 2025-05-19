// src/app/dashboard/paciente/layout.tsx

import React from "react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen">
			{/* Sidebar */}
			<aside className="w-64 bg-gray-100 p-6 border-r">
				<h2 className="text-xl font-bold mb-6">Área del Paciente</h2>
				<nav className="flex flex-col space-y-4">
					<Link
						href="/dashboard/paciente"
						className="text-blue-600 hover:underline"
					>
						Inicio
					</Link>
					<Link
						href="/dashboard/paciente/citas"
						className="text-blue-600 hover:underline"
					>
						Mis citas
					</Link>
					<Link
						href="/dashboard/paciente/perfil"
						className="text-blue-600 hover:underline"
					>
						Mi perfil
					</Link>
				</nav>
			</aside>

			{/* Contenido */}
			<main className="flex-1 p-10 bg-white">{children}</main>
		</div>
	);
}
