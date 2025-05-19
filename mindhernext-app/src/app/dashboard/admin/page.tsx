"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;
		if (!session || session.user.role !== "ADMIN") {
			router.push("/");
		}
	}, [session, status, router]);

	if (status === "loading") return <p>Cargando...</p>;
	if (!session || session.user.role !== "ADMIN") return null;

	return (
		<div>
			<h1 className="text-2xl font-bold">
				Bienvenido al panel de administrador
			</h1>
			<p>Aquí podrás gestionar usuarios, eventos y más.</p>
		</div>
	);
}
