"use client";

import { DiaryEntry, Emotion, CreateNote } from "@/types/note";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldProps,
} from "formik";
import * as Yup from "yup";
import { api } from "@/lib/api/api";
import toast from "react-hot-toast";
import css from "./DiaryEntryForm.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { createDiaryEntry, updateDiaryEntry } from "@/lib/api/clientApi";
import { useCreateNewNoteFormStore } from "@/lib/store/noteStore";

type EmotionsResponse =
  | Emotion[]
  | { data: Emotion[] }
  | { emotions: Emotion[] }
  | { results: Emotion[] };

interface DiaryEntryFormProps {
  entry?: DiaryEntry;
  onSuccess: () => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(2, "Заголовок повинен містити щонайменше 2 символи")
    .max(100, "Заголовок не може перевищувати 100 символів")
    .required("Заголовок є обов'язковим полем"),
  description: Yup.string()
    .min(10, "Запис повинен містити щонайменше 10 символів")
    .max(1000, "Запис не може перевищувати 1000 символів")
    .required("Опис є обов'язковим полем"),
  emotions: Yup.array()
    .of(Yup.string())
    .min(1, "Оберіть щонайменше одну емоцію")
    .required("Емоції є обов'язковим полем"),
});

export const DiaryEntryForm: React.FC<DiaryEntryFormProps> = ({
  entry,
  onSuccess,
}) => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [emotionsLoading, setEmotionsLoading] = useState(true);
  const [emotionsError, setEmotionsError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 30;
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const justOpenedRef = useRef(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { draft, setDraft, clearDraft } = useCreateNewNoteFormStore();

  const initialValues: CreateNote = entry
    ? {
        title: entry.title || "",
        description: entry.description || "",
        emotions: entry.emotions?.map((emotion) => emotion._id) || [],
      }
    : draft;

  const getErrorMessage = (err: unknown): string => {
    if (typeof err === "string") return err;
    if (typeof err === "object" && err !== null) {
      const e = err as {
        message?: unknown;
        response?: { data?: { message?: unknown } };
      };
      const rmsg = e.response?.data?.message;
      if (typeof rmsg === "string") return rmsg;
      if (typeof e.message === "string") return e.message;
    }
    return "Сталася помилка";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        console.log("[dropdown] click outside -> close");
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const parseEmotions = (data: EmotionsResponse): Emotion[] => {
    if (Array.isArray(data)) return data;
    if ("data" in data && Array.isArray(data.data)) return data.data;
    if ("emotions" in data && Array.isArray(data.emotions))
      return data.emotions;
    if ("results" in data && Array.isArray(data.results)) return data.results;
    return [];
  };

  const normalize = (arr: Emotion[]) =>
    arr.filter(
      (emotion): emotion is Emotion =>
        emotion &&
        typeof emotion._id === "string" &&
        emotion._id.length > 0 &&
        (typeof emotion.name === "string" || typeof emotion.title === "string")
    );

  const fetchPage = useCallback(
    async (nextPage: number, append: boolean) => {
      console.log(
        `[emotions] fetchPage start -> page=${nextPage}, append=${append}`
      );
      const res = await api.get(`/emotions?page=${nextPage}&limit=${limit}`);
      console.log("[emotions] raw response:", res.data);

      const parsed = parseEmotions(res.data);
      console.log(`[emotions] parsed length=${parsed.length}`);

      const batch = normalize(parsed);
      console.log(`[emotions] normalized length=${batch.length}`);

      setHasMore(batch.length === limit);
      setEmotions((prev) => {
        const list = append ? [...prev, ...batch] : batch;
        const map = new Map<string, Emotion>();
        list.forEach((e) => map.set(e._id, e));
        const result = Array.from(map.values());
        console.log(`[emotions] setEmotions -> total=${result.length}`);
        return result;
      });
      setPage(nextPage);
      console.log(
        `[emotions] fetchPage done -> page=${nextPage}, hasMore=${batch.length === limit}`
      );
    },
    [limit]
  );

  useEffect(() => {
    (async () => {
      try {
        console.log("[emotions] initial load...");
        setEmotionsLoading(true);
        setEmotionsError(null);
        await fetchPage(1, false);
      } catch (error) {
        console.error("Помилка завантаження емоцій:", error);
        setEmotionsError(getErrorMessage(error));
        setEmotions([
          { _id: "1", name: "Натхнення" },
          { _id: "2", name: "Вдячність" },
          { _id: "3", name: "Тривога" },
          { _id: "4", name: "Дивні бажання" },
          { _id: "5", name: "Нудота" },
        ]);
        setHasMore(false);
      } finally {
        setEmotionsLoading(false);
        console.log("[emotions] initial load finished");
      }
    })();
  }, [fetchPage]);

  const handleSubmit = async (
    values: CreateNote,
    { setSubmitting }: FormikHelpers<CreateNote>
  ) => {
    try {
      console.log("[form] submit values:", values);

      if (entry) {
        console.log("[form] updateDiaryEntry -> PATCH /diary/:id");
        await updateDiaryEntry(entry._id, values);
      } else {
        console.log("[form] createDiaryEntry -> POST /diary");
        await createDiaryEntry(values);
        clearDraft();
      }

      toast.success(
        entry ? "Запис успішно оновлено!" : "Запис успішно створено!"
      );
      onSuccess();
    } catch (error) {
      console.error("Помилка відправки:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const retryLoadEmotions = async () => {
    try {
      console.log("[emotions] retry load");
      setEmotionsError(null);
      setEmotionsLoading(true);
      await fetchPage(1, false);
    } catch (error) {
      console.error("Помилка повторного завантаження:", error);
      setEmotionsError(getErrorMessage(error));
      setHasMore(false);
    } finally {
      setEmotionsLoading(false);
    }
  };

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (nearBottom && hasMore && !loadingMore) {
      console.log("[scroll] near bottom -> load next page", { page, hasMore });
      try {
        setLoadingMore(true);
        await fetchPage(page + 1, true);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const getSelectedEmotionsDisplay = (selectedIds: string[]) => {
    if (selectedIds.length === 0)
      return {
        text: "Оберіть категорію",
        tags: [] as { id: string; name: string }[],
      };

    const selectedEmotions = selectedIds
      .map((id) => {
        const emotion = emotions.find((e) => e._id === id);
        return emotion
          ? {
              id,
              name: (emotion.name || emotion.title || "Без назви") as string,
            }
          : null;
      })
      .filter(Boolean) as { id: string; name: string }[];

    return {
      text: selectedEmotions.map((e) => e.name).join(", "),
      tags: selectedEmotions,
    };
  };

  return (
    <div className={css.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={!!entry}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className={css.form}>
            <label htmlFor="title" className={css.formGroup}>
              Заголовок
              <Field name="title">
                {({ field, form }: FieldProps<string, CreateNote>) => (
                  <input
                    {...field}
                    id="title"
                    type="text"
                    className={css.input}
                    placeholder="Введіть заголовок запису"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      if (!entry)
                        setDraft({ ...form.values, title: e.target.value });
                    }}
                  />
                )}
              </Field>
              <div className={css.errorSlot}>
                <ErrorMessage
                  name="title"
                  component="div"
                  className={css.errorMessage}
                />
              </div>
            </label>

            <div className={css.formGroup}>
              <label htmlFor="emotions-trigger" className={css.formLabel}>
                Категорії
              </label>

              {emotionsLoading ? (
                <div className={css.loadingContainer}>
                  <div className={css.spinner}></div>
                </div>
              ) : emotionsError ? (
                <div className={css.errorContainer}>
                  <div className={css.errorMessage}>
                    Помилка: {emotionsError}
                  </div>
                  <button
                    type="button"
                    onClick={retryLoadEmotions}
                    className={css.retryButton}
                  >
                    Спробувати знову
                  </button>
                </div>
              ) : emotions.length === 0 ? (
                <div className={css.noDataContainer}>
                  <span>Емоції не знайдено</span>
                  <button
                    type="button"
                    onClick={retryLoadEmotions}
                    className={css.retryButton}
                  >
                    Оновити
                  </button>
                </div>
              ) : (
                <div className={css.customSelect} ref={dropdownRef}>
                  <button
                    id="emotions-trigger"
                    type="button"
                    className={`${css.selectTrigger} ${isDropdownOpen ? css.selectTriggerOpen : ""}`}
                    aria-haspopup="listbox"
                    aria-expanded={isDropdownOpen}
                    aria-controls="emotions-listbox"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      const next = !isDropdownOpen;
                      console.log("[dropdown] trigger pointerdown -> toggle", {
                        next,
                      });
                      setIsDropdownOpen(next);
                      if (next) {
                        justOpenedRef.current = true;
                        setInteractive(false);
                        requestAnimationFrame(() => {
                          setInteractive(true);
                          justOpenedRef.current = false;
                          console.log("[dropdown] interactive restored");
                        });
                      }
                    }}
                  >
                    <div className={css.selectContent}>
                      {values.emotions.length === 0 ? (
                        <span className={css.selectPlaceholder}>
                          Оберіть категорію
                        </span>
                      ) : (
                        <div className={css.selectedTags}>
                          {getSelectedEmotionsDisplay(values.emotions).tags.map(
                            (tag) => (
                              <span key={tag.id} className={css.selectedTag}>
                                {tag.name}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                    <span
                      className={`${css.selectArrow} ${isDropdownOpen ? css.selectArrowOpen : ""}`}
                    >
                      <IoIosArrowDown />
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className={css.selectDropdown}>
                      <div
                        id="emotions-listbox"
                        role="listbox"
                        aria-multiselectable="true"
                        ref={listRef}
                        className={css.selectDropdownInner}
                        onScroll={handleScroll}
                        style={{ pointerEvents: interactive ? "auto" : "none" }}
                      >
                        {emotions.map((emotion) => {
                          const isSelected = values.emotions.includes(
                            emotion._id
                          );
                          return (
                            <button
                              key={emotion._id}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              className={`${css.selectOption} ${isSelected ? css.selectOptionSelected : ""}`}
                              onClick={() => {
                                if (justOpenedRef.current) {
                                  console.log(
                                    "[option] click ignored (just opened)"
                                  );
                                  return;
                                }
                                const newEmotions = isSelected
                                  ? values.emotions.filter(
                                      (id) => id !== emotion._id
                                    )
                                  : [...values.emotions, emotion._id];
                                console.log("[option] toggle", {
                                  id: emotion._id,
                                  name: emotion.name || emotion.title,
                                  wasSelected: isSelected,
                                  next: newEmotions,
                                });
                                setFieldValue("emotions", newEmotions);
                                if (!entry)
                                  setDraft({
                                    ...values,
                                    emotions: newEmotions,
                                  });
                              }}
                            >
                              <div className={css.checkbox}>
                                {isSelected && <FaCheck />}
                              </div>
                              <span>
                                {
                                  (emotion.name ||
                                    emotion.title ||
                                    "Без назви") as string
                                }
                              </span>
                            </button>
                          );
                        })}

                        {loadingMore && <div className={css.spinner}></div>}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className={css.errorSlot}>
                <ErrorMessage
                  name="emotions"
                  component="div"
                  className={css.errorMessage}
                />
              </div>
            </div>

            <label htmlFor="description" className={css.formGroup}>
              Запис
              <Field name="description">
                {({ field, form }: FieldProps<string, CreateNote>) => (
                  <textarea
                    {...field}
                    id="description"
                    className={css.textarea}
                    placeholder="Запишіть, як ви себе відчуваєте"
                    rows={5}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      field.onChange(e);
                      if (!entry)
                        setDraft({
                          ...form.values,
                          description: e.target.value,
                        });
                    }}
                  />
                )}
              </Field>
              <div className={css.errorSlot}>
                <ErrorMessage
                  name="description"
                  component="div"
                  className={css.errorMessage}
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={emotionsLoading || isSubmitting}
              className={css.buttonSubmit}
            >
              Зберегти
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
