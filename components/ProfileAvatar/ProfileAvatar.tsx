import { User } from "@/types/user";
import css from "./ProfileAvatar.module.css";
import Image from "next/image";
import { useRef } from "react";

interface ProfileAvatarProps {
  user: User;
}

const ProfileAvatar = ({ user }: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
    //Кнопку "Завантажити нове фото", яка відкриває системний діалог для вибору файлу. Взаємодія: Після вибору нового фото відбувається окремий запит на бекенд для його оновлення.
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Обране фото:", file);

    // const formData = new FormData();
    // formData.append("avatar", file);
    // await fetch("/api/upload-avatar", { method: "POST", body: formData });
  };

  return (
    <div className={css.container}>
      <Image
        src={user.avatarUrl}
        alt={user.name}
        width={120}
        height={120}
        className={css.avatarUser}
      />
      <div className={css.wrapper}>
        <h2 className={css.nameUser}>{user.name}</h2>
        <p className={css.emailUser}>{user.email}</p>
        <button onClick={handleClick} type="button" className={css.btn}>
          Завантажити нове фото
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ProfileAvatar;
