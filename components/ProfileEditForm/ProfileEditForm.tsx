"use client";

import { User } from "@/types/user";
import css from "./ProfileEditForm.module.css";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

interface ProfileEditFormProps {
  user: User;
}

interface InitialValues {
  name: string;
  email: string;
  babyGender: string;
  dueDate: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Введіть ім’я"),
  email: Yup.string().email("Некоректна пошта").required("Введіть пошту"),
  gender: Yup.string().required("Оберіть стать").oneOf(["boy", "girl"]),
  dueDate: Yup.date().required("Оберіть дату"),
});

const ProfileEditForm = ({ user }: ProfileEditFormProps) => {
  const router = useRouter();

  const handleSubmit = async (
    values: InitialValues,
    actions: FormikHelpers<InitialValues>
  ) => {
    try {
      console.log("Form data:", values);
      // patchMe(value);
      router.refresh();
    } finally {
      console.log("actions:", actions);
      // actions.setSubmitting(false);
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
        {({ handleReset }) => (
          <Form className={css.form}>
            <label className={css.label}>
              Ім’я
              <Field name="name" type="text" className={css.input} />
              <ErrorMessage name="name" component="div" className={css.error} />
            </label>
            <label className={css.label}>
              Пошта
              <Field name="email" type="email" className={css.input} />
              <ErrorMessage
                name="email"
                component="div"
                className={css.error}
              />
            </label>
            <label className={css.label}>
              Стать дитини
              <Field as="select" name="babyGender" className={css.input}>
                <option value="">Оберіть стать</option>
                <option value="girl">Дівчинка</option>
                <option value="boy">Хлопчик</option>
              </Field>
              <ErrorMessage
                name="babyGender"
                component="div"
                className={css.error}
              />
            </label>

            <label className={css.label}>
              Планова дата пологів
              <Field name="dueDate" type="date" className={css.input} />
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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileEditForm;
