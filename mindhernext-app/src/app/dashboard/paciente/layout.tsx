import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<body>
				<main className="min-h-screen bg-gray-100 p-4">
					<section className="max-w-4xl mx-auto bg-white rounded shadow p-6">
						{children}
					</section>
				</main>
			</body>
		</html>
	);
}
