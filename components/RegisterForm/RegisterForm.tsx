"use client";

import { useRouter } from "next/navigation";
import css from "./RegisterForm.module.css";
import { RegisterData } from "@/types/auth";
import { register } from "@/lib/api/clientApi";
import { useState } from "react";
import { ApiError } from "next/dist/server/api-utils";
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";

const RegisterForm = () => {
	const router = useRouter();
	const [error, setError] = useState("");

	interface InitialValues {
		name: string;
		email: string;
		password: string;
	}

	const initialValues: InitialValues = {
		name: "",
		email: "",
		password: "",
	};

	const validationSchema = Yup.object({
		name: Yup.string()
			.required("Ім'я обов'язкове")
			.min(2, "Ім'я повинно містити мінімум 2 символи")
			.max(50, "Ім'я не повинно перевищувати 50 символів")
			.matches(
				/^[a-zA-Zа-яА-ЯёЁ\s]+$/,
				"Ім'я може містити лише букви та пробіли"
			),

		email: Yup.string()
			.required("Email обов'язковий")
			.email("Введіть коректний email")
			.max(100, "Email не повинен перевищувати 100 символів"),

		password: Yup.string()
			.required("Пароль обов'язковий")
			.min(8, "Пароль повинен містити мінімум 8 символів")
			.max(128, "Пароль не повинен перевищувати 128 символів")
			.matches(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Пароль повинен містити хоча б одну малу літеру, одну велику літеру та одну цифру"
			),
	});

	const handleSubmit = async (
		values: RegisterData,
		actions: FormikHelpers<RegisterData>
	) => {
		try {
			console.log("Registration values:", values);
			await register(values);
			router.push("/profile");
		} catch (error) {
			setError((error as ApiError).message ?? "Помилка реєстрації");
			actions.setFieldError("general", "Сталася помилка при реєстрації");
		} finally {
			actions.setSubmitting(false);
		}
	};

	return (
		<>
			<h1 className={css.title}>Реєстрація</h1>

			<Formik
				onSubmit={handleSubmit}
				validationSchema={validationSchema}
				initialValues={initialValues}>
				{({ isSubmitting }) => (
					<Form className={css.form}>
						<div className={css.inputGroup}>
							<p>Ім'я*</p>
							<Field
								type="text"
								name="name"
								placeholder="Ваше ім'я"
								className={css.input}
							/>
							<ErrorMessage
								name="name"
								component="span"
								className={css.error}
							/>
						</div>

						<div className={css.inputGroup}>
							<p>Пошта*</p>
							<Field
								type="email"
								name="email"
								placeholder="hello@leleka.com"
								className={css.input}
							/>
							<ErrorMessage
								name="email"
								component="span"
								className={css.error}
							/>
						</div>

						<div className={css.inputGroup}>
							<p>Пароль*</p>
							<Field
								type="password"
								name="password"
								placeholder="********"
								className={css.input}
							/>
							<ErrorMessage
								name="password"
								component="span"
								className={css.error}
							/>
						</div>

						<button
							className={css.submitButton}
							type="submit"
							disabled={isSubmitting}>
							{isSubmitting ? "Зареєструватися..." : "Зареєструватися"}
						</button>

						{error && <span className={css.error}>{error}</span>}

						<div
							style={{
								marginTop: "24px",
								textAlign: "center",
								color: "#6b7280",
								fontSize: "14px",
							}}>
							<span>Вже маєте аккаунт? </span>
							<Link
								href="/sign-in"
								style={{
									color: "#f472b6",
									textDecoration: "none",
									fontWeight: 500,
								}}>
								Увійти
							</Link>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default RegisterForm;
