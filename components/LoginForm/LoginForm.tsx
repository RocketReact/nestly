"use client";

import { useRouter } from "next/navigation";
import css from "./LoginForm.module.css";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { login } from "@/lib/api/clientApi";
import { ApiError } from "next/dist/server/api-utils";
import { LoginData } from "@/types/user";
import Link from "next/link";

const LoginForm = () => {
	const router = useRouter();
	const [error, setError] = useState("");
	const setUser = useAuthStore((state) => state.setUser);

	const handleSubmit = async (formData: FormData) => {
		try {
			const values = Object.fromEntries(formData) as unknown as LoginData;
			const user = await login(values);

			if (user) {
				setUser(user);
				router.push("/");
			}
		} catch (error) {
			setError((error as ApiError).message ?? "Щось пішло не так");
		}
	};

	const handleGoogleLogin = () => {
		console.log("Вхід через Google");
	};

	return (
		<>
			<h1 className={css.title}>Вхід</h1>

			<form action={handleSubmit} className={css.form}>
				<div className={css.inputGroup}>
					<label htmlFor="email">Пошта</label>
					<input
						id="email"
						type="email"
						name="email"
						placeholder="Пошта"
						className={css.input}
						required
					/>
				</div>

				<div className={css.inputGroup}>
					<label htmlFor="password">Пароль</label>
					<input
						id="password"
						type="password"
						name="password"
						placeholder="Пароль"
						className={css.input}
						required
					/>
				</div>

				<button type="submit" className={css.submitButton}>
					Увійти
				</button>

				<button
					type="button"
					onClick={handleGoogleLogin}
					className={css.googleButton}>
					<span className={css.googleIcon}>G</span>
					Увійти через Google
				</button>

				{error && (
					<span
						style={{
							color: "#ef4444",
							fontSize: "14px",
							textAlign: "center",
						}}>
						{error}
					</span>
				)}

				<div className={css.registerPrompt}>
					<span>Немає аккаунту? </span>
					<Link href="/register" className={css.registerLink}>
						Зареєструватися
					</Link>
				</div>
			</form>
		</>
	);
};

export default LoginForm;
