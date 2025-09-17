"use client";

import { useEffect, useState } from "react";
import { getDiaryEntries } from "@/lib/api/clientApi";
import css from "./DiaryList.module.css";
import type { DiaryEntry } from "@/types/note";
import DiaryEntryCard from "../DiaryEntryCard/DiaryEntryCard";
import { IoIosAddCircleOutline } from "react-icons/io";
import { DiaryEntryModal } from "../DiaryEntryModal/DiaryEntryModal";

interface Props {
  onSelectEntry?: (entry: DiaryEntry) => void;
}

export default function DiaryList({ onSelectEntry }: Props) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalConfirm = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getDiaryEntries().then((data) => setEntries(data.diaryNotes));
  }, []);

  return (
    <div className={css.diaryContainer}>
      <div className={css.topWrapper}>
        <h1 className={css.title}>Ваші записи</h1>
        <button className={css.createBtn} onClick={() => setIsModalOpen(true)}>
          Новий запис
          <IoIosAddCircleOutline className={css.creatIcon} />
        </button>
      </div>

      {entries.length === 0 ? (
        <p>Наразі записи у щоденнику відстні</p>
      ) : (
        <div className={css.diaryNotesWrapper}>
          {entries.map((entry) => (
            <DiaryEntryCard
              key={entry._id}
              entry={entry}
              onClick={() => onSelectEntry?.(entry)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <DiaryEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            handleModalConfirm();
            getDiaryEntries().then((data) => setEntries(data.diaryNotes));
          }}
        />
      )}
    </div>
  );
}
