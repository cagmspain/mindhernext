// src/app/dashboard/admin/layout.tsx
import Link from "next/link";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			<aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
				<h2 className="text-xl font-bold">Panel de Admin</h2>
				<nav className="space-y-2">
					<Link href="/dashboard/admin" className="block hover:underline">
						Inicio
					</Link>
					<Link
						href="/dashboard/admin/usuarios"
						className="block hover:underline"
					>
						Gestión de usuarios
					</Link>
					<Link
						href="/dashboard/admin/eventos"
						className="block hover:underline"
					>
						Gestión de eventos
					</Link>
					<Link
						href="/dashboard/admin/perfil"
						className="block hover:underline"
					>
						Mi perfil
					</Link>
				</nav>
			</aside>
			<main className="flex-1 bg-black text-white">{children}</main>
		</div>
	);
}
