"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import type { DiaryEntry } from "@/types/note";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { DiaryEntryModal } from "../DiaryEntryModal/DiaryEntryModal";
import { deleteDiaryEntry } from "@/lib/api/clientApi";
import { useMutation } from "@tanstack/react-query";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDeleteForever } from "react-icons/md";
import css from "./DiaryEntryDetails.module.css";

interface Props {
  entry: DiaryEntry;
  onUpdate?: () => void; // колбек для десктопа
}

export default function DiaryEntryDetails({ entry, onUpdate }: Props) {
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const router = useRouter();
  const isDesktop = useMediaQuery({ minWidth: 1440 });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteDiaryEntry(id),
    onSuccess: () => {
      setIsDeleteModal(false);
      if (isDesktop) {
        onUpdate?.(); // десктоп — обновляємо список
      } else {
        router.push("/diary"); // мобілка — редірект
      }
    },
    onError: (err) => console.error("Помилка при видаленні:", err),
  });

  const handleDeleteConfirm = () => deleteMutation.mutate(entry._id);

  const handleEditConfirm = () => {
    setIsEditModal(false);
    if (isDesktop) {
      onUpdate?.(); // десктоп — обновляємо список
    } else {
      router.push("/diary"); // мобілка — редірект
    }
  };

  return (
    <div className={css.diaryDetailsWrapper}>
      <div className={css.diaryDetailsCardWrapper}>
        <div className={css.diaryDetailsContentWrapper}>
          <div className={css.diaryDetailsTopWrapper}>
            <h2 className={css.diaryDetailsTitle}>{entry.title}</h2>
            <button
              onClick={() => setIsEditModal(true)}
              className={css.diaryDetailsEditBtn}
            >
              <TbEdit className={css.editBtn} />
            </button>
          </div>

          <div className={css.diaryDetailsDataWrapper}>
            <p className={css.diaryDetailsDataText}>
              {new Date(entry.date).toLocaleDateString()}
            </p>
            <button
              onClick={() => setIsDeleteModal(true)}
              className={css.diaryDetailsDeleteBtn}
            >
              <MdOutlineDeleteForever className={css.deleteBtn} />
            </button>
          </div>

          <p className={css.diaryDetailsDescription}>{entry.description}</p>

          <div>
            <ul className={css.diaryEmotionsWrapper}>
              {entry.emotions.map((emo, index) => (
                <li key={`${emo._id}-${index}`} className={css.emotionsItem}>
                  {emo.title}
                </li>
              ))}
            </ul>
          </div>

          {isEditModal && (
            <DiaryEntryModal
              isOpen={isEditModal}
              entry={entry}
              onClose={() => setIsEditModal(false)}
              onSuccess={handleEditConfirm}
            />
          )}

          {isDeleteModal && (
            <ConfirmationModal
              title="Ви впевнені, що хочете видалити запис?"
              confirmButtonText="Так, видалити"
              cancelButtonText="Скасувати"
              onConfirm={handleDeleteConfirm}
              onCancel={() => setIsDeleteModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
