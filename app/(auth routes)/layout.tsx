"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PublicLayoutProps {
	children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	useEffect(() => {
		router.refresh();
		setLoading(false);
	}, [router]);
	return (
		<>
			{loading ?
				<p>Loading...</p>
			:	children}
		</>
	);
};

export default PublicLayout;
