"use client";

import css from "./ProfileEditForm.module.css";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/lib/store/authStore";
import { updateProfile } from "@/lib/api/clientApi";
import { ApiError } from "next/dist/server/api-utils";
import { useState } from "react";
import CustomSelect from "../CustomSelect/CustomSelect";

interface InitialValues {
  name: string;
  email: string;
  babyGender: string;
  dueDate: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Введіть ім’я"),
  email: Yup.string().email("Некоректна пошта").required("Введіть пошту"),
  babyGender: Yup.string()
    .required("Оберіть стать")
    .oneOf(["boy", "girl", "unknown"]),
  dueDate: Yup.date()
    .required("Оберіть дату")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      "Дата не може бути раніше сьогоднішнього дня"
    ),
});

const ProfileEditForm = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState("");
  if (!user) {
    return <p>Завантаження...</p>;
  }

  const handleSubmit = async (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>
  ) => {
    try {
      const updatedUser = await updateProfile(values);
      setUser({
        ...user,
        ...updatedUser,
      });
      import("izitoast").then((iziToast) => {
        iziToast.default.success({
          title: "Супер",
          message: "Дані збережено",
          position: "topRight",
        });
      });
    } catch (error) {
      setError((error as ApiError).message);
      import("izitoast").then((iziToast) => {
        iziToast.default.error({
          title: "Помилка",
          message: "Щось пішло не так, спробуйте ще раз",
          position: "topRight",
        });
      });
    } finally {
      actions.setSubmitting(false);
    }
  };

  const initialValues = {
    name: user.name || "",
    email: user.email || "",
    babyGender: user.babyGender || "",
    dueDate: user.dueDate || "",
  };

  return (
    <div className={css.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleReset, errors, touched, values, setFieldValue }) => (
          <Form className={css.form}>
            <label className={css.label}>
              Ім’я
              <Field
                name="name"
                type="text"
                className={`${css.input} ${touched.name && errors.name ? css.inputError : ""}`}
              />
              <ErrorMessage name="name" component="div" className={css.error} />
            </label>
            <label className={css.label}>
              Пошта
              <Field
                name="email"
                type="email"
                className={`${css.input} ${touched.email && errors.email ? css.inputError : ""}`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className={css.error}
              />
            </label>
            <label className={css.label}>
              Стать дитини
              <CustomSelect
                options={[
                  { value: "girl", label: "Дівчинка" },
                  { value: "boy", label: "Хлопчик" },
                  { value: "unknown", label: "Ще не знаю" },
                ]}
                value={values.babyGender}
                onChange={(value) => setFieldValue("babyGender", value)}
                placeholder="Оберіть стать"
                error={!!(touched.babyGender && errors.babyGender)}
              />
              <ErrorMessage
                name="babyGender"
                component="div"
                className={css.error}
              />
            </label>

            <label className={css.label}>
              Планова дата пологів
              <Field
                name="dueDate"
                type="date"
                className={`${css.input} ${touched.dueDate && errors.dueDate ? css.inputError : ""}`}
              />
              <ErrorMessage
                name="dueDate"
                component="div"
                className={css.error}
              />
            </label>

            <div className={css.actions}>
              <button
                type="button"
                onClick={handleReset}
                className={css.btnCancel}
              >
                Відмінити зміни
              </button>
              <button type="submit" className={css.btnSave}>
                Зберегти зміни
              </button>
              {error && <p>{error}</p>}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileEditForm;
