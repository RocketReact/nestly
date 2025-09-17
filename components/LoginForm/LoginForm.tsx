"use client";

import { useRouter } from "next/navigation";
import css from "./LoginForm.module.css";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { login } from "@/lib/api/clientApi";
import { LoginData } from "@/types/user";
import Link from "next/link";
import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import "izitoast/dist/css/iziToast.min.css";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  interface InitialValues {
    email: string;
    password: string;
  }

  const initialValues: InitialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email обов'язковий")
      .email("Введіть коректний email")
      .max(100, "Email не повинен перевищувати 100 символів")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
        "Email повинен закінчуватися на .com"
      )
      .trim(),

    password: Yup.string()
      .required("Пароль обов'язковий")
      .min(8, "Пароль повинен містити мінімум 8 символів")
      .max(128, "Пароль не повинен перевищувати 128 символів")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Пароль повинен містити хоча б одну малу літеру, одну велику літеру та одну цифру"
      )
      .trim(),
  });

  const handleSubmit = async (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) => {
    try {
      setError("");
      const user = await login(values as LoginData);

      if (user) {
        setUser(user);
        router.push("/");
      }
    } catch {
      setError("Щось пішло не так, спробуйте ще раз");
      import("izitoast").then((iziToast) => {
        iziToast.default.error({
          title: "Помилка",
          message: "Щось пішло не так. Перевірте введені дані.",
          position: "topRight",
        });
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <h1 className={css.title}>Вхід</h1>

          <div className={css.inputGroup}>
            <Field
              id="email"
              type="email"
              name="email"
              placeholder="Пошта"
              className={css.input}
            />
            <ErrorMessage name="email" component="span" className={css.error} />
          </div>

          <div className={css.inputGroup}>
            <Field
              id="password"
              type="password"
              name="password"
              placeholder="Пароль"
              className={css.input}
            />
            <ErrorMessage
              name="password"
              component="span"
              className={css.error}
            />
          </div>

          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Загрузка..." : "Увійти"}
          </button>

          {error && <span className={css.error}>{error}</span>}

          <div className={css.spanText}>
            <span>Немає аккаунту? </span>
            <Link href="/auth/register" className={css.spanLink}>
              Зареєструватися
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
