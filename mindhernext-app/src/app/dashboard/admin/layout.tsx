import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="p-10 border border-yellow-200">
			<h2 className="text-xl font-semibold mb-4">Panel de Administrador</h2>
			{children}
		</div>
	);
}
