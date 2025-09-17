"use client";
import { Field, Form, Formik, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../../lib/api/clientApi";
import css from "./AddTaskForm.module.css";
import { BsXLg } from "react-icons/bs";

interface AddTaskFormProps {
  onCloseModal: () => void;
}

interface NewTask {
  name: string;
  date: string;
}

const ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Завдання має містити мінімум 3 символи")
    .max(50, "Завдання не може містити більше 50 символів")
    .required("Назва завдання є обов'язковою"),
  date: Yup.string().required("Дата є обов'язковою"),
});

const getCurrentDate = (): string => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

const initialValues: NewTask = {
  name: "",
  date: getCurrentDate(),
};

const AddTaskForm = ({ onCloseModal }: AddTaskFormProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onCloseModal();
      import("izitoast").then((iziToast) => {
        iziToast.default.success({
          title: "Супер",
          message: "Завдання збережено",
          position: "topRight",
        });
      });
    },
    onError: (error) => {
      import("izitoast").then((iziToast) => {
        iziToast.default.error({
          title: "Помилка",
          message: "Щось пішло не так, спробуйте, будь ласка, ще раз",
          position: "topRight",
        });
      });
      console.error("Помилка:", error);
    },
  });

  const handleSubmit = (values: NewTask, actions: FormikHelpers<NewTask>) => {
    mutation.mutate(values);
    actions.resetForm();
  };

  return (
    <>
      <BsXLg className={css.closeButton} onClick={onCloseModal} />

      <h1 className={css.title}>Нове завдання</h1>
      <Formik
        validationSchema={ValidationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label className={css.label} htmlFor="name">
                Назва завдання
              </label>
              <Field
                className={`${css.input} ${
                  errors.name && touched.name ? css.inputError : ""
                }`}
                id="name"
                type="text"
                name="name"
                placeholder="Прийняти вітаміни"
              />
              <ErrorMessage name="name" component="div" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label className={css.label} htmlFor="date">
                Дата
              </label>
              <Field
                className={`${css.input} ${
                  errors.date && touched.date ? css.inputError : ""
                }`}
                id="date"
                type="date"
                name="date"
              />
              <ErrorMessage name="date" component="div" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="submit"
                className={css.submitButton}
                disabled={mutation.isPending}
              >
                Зберегти
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddTaskForm;
