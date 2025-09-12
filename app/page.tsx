"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function Home() {
	const router = useRouter();
	const { isAuthenticated, user } = useAuthStore();

	useEffect(() => {
		if (isAuthenticated && user) {
			router.push("/profile");
		} else if (!isAuthenticated) {
			router.push("/sign-in");
		}
	}, [isAuthenticated, user, router]);
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}>
			<p>Загрузка...</p>
		</div>
	);
}
