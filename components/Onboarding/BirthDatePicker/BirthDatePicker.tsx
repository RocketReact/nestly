"use client";
import { uk } from "date-fns/locale";
import { useState } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import css from "./BirthDatePicker.module.css";
import { useUserStore } from "@/lib/store/userStore";

registerLocale("uk", uk);

export default function BirthDatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const setDueDate = useUserStore((state) => state.setDueDate);
  const dueDate = useUserStore((state) => state.dueDate);

  const handleChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setDueDate(date.toLocaleDateString("uk-UA"));
    }
  };

  const today = new Date().toLocaleDateString("uk-UA").replace(/\//g, ".");

  return (
    <div>
      <label className={css.label}>Планова дата пологів</label>
      <div className={css.datepickerWrapper}>
        <ReactDatePicker
          selected={selectedDate}
          onChange={handleChange}
          dateFormat="dd.MM.yyyy"
          placeholderText={dueDate !== "" ? dueDate : today}
          minDate={new Date()}
          locale={uk}
        />
      </div>
    </div>
  );
}
