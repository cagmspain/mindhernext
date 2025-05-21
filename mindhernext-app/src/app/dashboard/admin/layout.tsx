// src/app/dashboard/admin/layout.tsx
import Link from "next/link";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			{/* Sidebar */}
			<aside className="w-64 bg-gray-900 text-white p-6">
				<h2 className="text-xl font-bold mb-6">Panel de Admin</h2>
				<nav className="flex flex-col space-y-4">
					<Link href="/dashboard/admin" className="hover:text-green-400">
						Inicio
					</Link>
					<Link
						href="/dashboard/admin/usuarios"
						className="hover:text-green-400"
					>
						Gestión de usuarios
					</Link>
					<Link href="/dashboard/admin/perfil" className="hover:text-green-400">
						Mi perfil
					</Link>
				</nav>
			</aside>

			{/* Contenido principal */}
			<main className="flex-1 bg-black text-white p-8">{children}</main>
		</div>
	);
}
