"use client";

import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import type { DiaryEntry } from "@/types/note";
import css from "./DiaryEntryCard.module.css";

interface Props {
  entry: DiaryEntry;
  onClick?: () => void;
}

export default function DiaryEntryCard({ entry, onClick }: Props) {
  const router = useRouter();
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const handleClick = () => {
    if (isDesktop) {
      onClick?.();
    } else {
      router.push(`/diary/${entry._id}`);
    }
  };

  return (
    <div className={css.diaryNoteWrapper} onClick={handleClick}>
      <div className={css.diaryNoteTopWrapper}>
        <h3 className={css.diaryNoteTitle}>{entry.title}</h3>
        <p className={css.diaryNoteDate}>
          {new Date(entry.date).toLocaleDateString()}
        </p>
      </div>
      <div>
        <ul className={css.diaryEmotionsWrapper}>
          {entry.emotions.map((emo, index) => (
            <li key={`${emo._id}-${index}`} className={css.emotionsItem}>
              {emo.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
