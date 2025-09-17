"use client";
import AvatarPicker from "@/components/Onboarding/AvatarPicker/AvatarPicker";
import BirthDatePicker from "@/components/Onboarding/BirthDatePicker/BirthDatePicker";
import ChildStatusSelect from "@/components/Onboarding/ChildStatusSelect/ChildStatusSelect";
import css from "./EditProfilePage.module.css";
import { useUserStore } from "@/lib/store/userStore";
import { updateProfile } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";

export default function EditProfileClient() {
  const { dueDate, babyGender } = useUserStore();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!babyGender) {
      console.log("Оберіть стать дитини");
      return;
    }

    const formData = {
      dueDate:
        dueDate && dueDate.includes(".")
          ? (() => {
              const [day, month, year] = dueDate.split(".");
              if (day && month && year) {
                return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
              }
              return dueDate;
            })()
          : dueDate,
      babyGender,
    };

    updateProfile(formData);
    router.replace("/");
  };

  return (
    <div>
      <form className={css.form} action="submit" onSubmit={handleSubmit}>
        <AvatarPicker />
        <div className={css.selectWrapper}>
          <ChildStatusSelect />
          <BirthDatePicker />
        </div>

        <button className={css.button} type="submit">
          Зберегти
        </button>
      </form>
    </div>
  );
}
