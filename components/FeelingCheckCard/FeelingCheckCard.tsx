"use client";

import { useState } from "react";
import css from "./FeelingCheckCard.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { DiaryEntryModal } from "../DiaryEntryModal/DiaryEntryModal";

export default function FeelingCheckCard() {
  const router = useRouter();
  const [modalOpen, setModal] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const onClick = () => {
    if (isAuthenticated) {
      setModal(true);
    } else {
      router.push("/auth/register");
    }
  };

  return (
    <div className={css.feelingCheckCard}>
      <h2 className={css.title}> Як ви себе почуваєте? </h2>
      <div className={css.recWrapper}>
        <h3 className={css.recTitle}>Рекомендація на сьогодні:</h3>
        <span className={css.recText}>Занотуйте незвичні відчуття у тілі.</span>
      </div>
      <button type="button" className={css.button} onClick={() => onClick()}>
        Зробити запис у щоденник
      </button>
      {modalOpen && (
        <DiaryEntryModal
          isOpen={modalOpen}
          onClose={() => setModal(false)}
          onSuccess={() => {
            setModal(false);
            router.push("/diary");
          }}
        />
      )}
    </div>
  );
}
