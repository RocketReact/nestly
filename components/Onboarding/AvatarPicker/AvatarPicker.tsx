"use client";
import { useState } from "react";
import css from "./AvatarPicker.module.css";
import Image from "next/image";
import { updateAvatar } from "@/lib/api/clientApi";
import { useUserStore } from "@/lib/store/userStore";

export default function AvatarPicker() {
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const avatar = useUserStore((state) => state.avatarUrl);
  const setAvatar = useUserStore((state) => state.setAvatar);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only Images");
        return;
      } else if (file.size > 1 * 1024 * 1024) {
        setError("Max file size 1MB");
        return;
      }

      try {
        setIsUploading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);

        const updatedUser = await updateAvatar(file);
        setAvatar(updatedUser.avatarUrl);
      } catch (error) {
        console.error(error);
        setError("Помилка завантаження фото");
      } finally {
        console.log("Загружаем файл:", file.name, file.size, file.type);
        setIsUploading(false);
      }
    }
  };

  return (
    <div className={css.avatarWrapper}>
      <Image
        className={css.avatar}
        src={avatar}
        alt="Preview"
        width={300}
        height={300}
      />
      <label className={css.button}>
        {isUploading ? "Завантажується..." : "Завантажити фото"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={css.input}
          disabled={isUploading}
        />
      </label>
      {error && <div className={css.error}>{error}</div>}
    </div>
  );
}
