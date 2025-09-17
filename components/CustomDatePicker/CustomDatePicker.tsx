// "use client";

// import { useState, useRef, useEffect } from "react";
// import css from "./CustomDatePicker.module.css";

// interface CustomDatePickerProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   error?: boolean;
//   minDate?: Date;
// }

// const CustomDatePicker = ({
//   value,
//   onChange,
//   placeholder = "Оберіть дату",
//   error = false,
//   minDate,
// }: CustomDatePickerProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [displayValue, setDisplayValue] = useState("");
//   const [currentDate, setCurrentDate] = useState(() => {
//     const today = new Date();
//     return new Date(today.getFullYear(), today.getMonth(), 1);
//   });
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const formatDisplayDate = (dateString: string) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "";

//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const year = date.getFullYear();

//     return `${day}.${month}.${year}`;
//   };

//   const formatInputDate = (date: Date) => {
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   useEffect(() => {
//     if (value) {
//       setDisplayValue(formatDisplayDate(value));
//       setSelectedDate(new Date(value));
//     } else {
//       setDisplayValue("");
//       setSelectedDate(null);
//     }
//   }, [value]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   const handleToggle = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedDate = event.target.value;
//     onChange(selectedDate);
//     setIsOpen(false);
//   };

//   const handleDateSelect = (date: Date) => {
//     const formattedDate = formatInputDate(date);
//     onChange(formattedDate);
//     setIsOpen(false);
//   };

//   const handlePrevMonth = () => {
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
//     );
//   };

//   const handleNextMonth = () => {
//     setCurrentDate(
//       new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
//     );
//   };

//   const isDateDisabled = (date: Date) => {
//     if (!minDate) return false;
//     const dateStr = date.toISOString().split("T")[0];
//     const minDateStr = minDate.toISOString().split("T")[0];
//     return dateStr < minDateStr;
//   };

//   const isDateSelected = (date: Date) => {
//     if (!selectedDate) return false;
//     const dateStr = date.toISOString().split("T")[0];
//     const selectedStr = selectedDate.toISOString().split("T")[0];
//     return dateStr === selectedStr;
//   };

//   const isToday = (date: Date) => {
//     const today = new Date();
//     const dateStr = date.toISOString().split("T")[0];
//     const todayStr = today.toISOString().split("T")[0];
//     return dateStr === todayStr;
//   };

//   const renderCalendar = () => {
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();

//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     const days = [];
//     const monthNames = [
//       "Січень",
//       "Лютий",
//       "Березень",
//       "Квітень",
//       "Травень",
//       "Червень",
//       "Липень",
//       "Серпень",
//       "Вересень",
//       "Жовтень",
//       "Листопад",
//       "Грудень",
//     ];

//     const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

//     // Пусті клітинки для днів попереднього місяця
//     for (
//       let i = 0;
//       i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1);
//       i++
//     ) {
//       days.push(<div key={`empty-${i}`} className={css.emptyDay}></div>);
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(year, month, day);
//       const disabled = isDateDisabled(date);
//       const selected = isDateSelected(date);
//       const today = isToday(date);

//       let dayClasses = css.day;
//       if (disabled) {
//         dayClasses += ` ${css.dayDisabled}`;
//       } else if (selected) {
//         dayClasses += ` ${css.daySelected}`;
//       } else if (today) {
//         dayClasses += ` ${css.dayToday}`;
//       }

//       days.push(
//         <button
//           key={`day-${day}`}
//           type="button"
//           className={dayClasses}
//           onClick={() => !disabled && handleDateSelect(date)}
//           disabled={disabled}
//         >
//           {day}
//         </button>
//       );
//     }

//     return (
//       <div className={css.calendar}>
//         <div className={css.calendarHeader}>
//           <button
//             type="button"
//             className={css.navButton}
//             onClick={handlePrevMonth}
//           >
//             <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
//               <path
//                 d="M7 1L2 6L7 11"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>
//           <span className={css.monthYear}>
//             {monthNames[month]} {year}
//           </span>
//           <button
//             type="button"
//             className={css.navButton}
//             onClick={handleNextMonth}
//           >
//             <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
//               <path
//                 d="M1 1L6 6L1 11"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>
//         </div>

//         <div className={css.weekDays}>
//           {dayNames.map((dayName) => (
//             <div key={dayName} className={css.weekDay}>
//               {dayName}
//             </div>
//           ))}
//         </div>

//         <div className={css.daysGrid}>{days}</div>
//       </div>
//     );
//   };

//   const handleKeyDown = (event: React.KeyboardEvent) => {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       handleToggle();
//     } else if (event.key === "Escape") {
//       setIsOpen(false);
//     }
//   };

//   return (
//     <div className={css.container} ref={containerRef}>
//       <div
//         className={`${css.trigger} ${error ? css.error : ""} ${isOpen ? css.open : ""}`}
//         onClick={handleToggle}
//         onKeyDown={handleKeyDown}
//         tabIndex={0}
//         role="button"
//         aria-haspopup="true"
//         aria-expanded={isOpen}
//       >
//         <span
//           className={`${css.value} ${!displayValue ? css.placeholder : ""}`}
//         >
//           {displayValue || placeholder}
//         </span>

//         <svg
//           className={`${css.selectArrow} ${isOpen ? css.selectArrowOpen : ""}`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </div>

//       {isOpen && <div className={css.dropdown}>{renderCalendar()}</div>}

//       <input
//         ref={inputRef}
//         type="date"
//         value={value}
//         onChange={handleDateChange}
//         min={minDate ? minDate.toISOString().split("T")[0] : undefined}
//         className={css.hiddenInput}
//         tabIndex={-1}
//       />
//     </div>
//   );
// };

// export default CustomDatePicker;

"use client";

import { useState, useRef, useEffect } from "react";
import css from "./CustomDatePicker.module.css";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  minDate?: Date;
}

const CustomDatePicker = ({
  value,
  onChange,
  placeholder = "Оберіть дату",
  error = false,
  minDate,
}: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [currentDate, setCurrentDate] = useState(() => {
    // Завжди починаємо з поточного місяця
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  // Форматування дати для input (YYYY-MM-DD)
  const formatInputDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (value) {
      setDisplayValue(formatDisplayDate(value));
      setSelectedDate(new Date(value));
      // Не змінюємо currentDate при зміні value, щоб календар залишався на поточному місяці
    } else {
      setDisplayValue("");
      setSelectedDate(null);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    // Просто відкриваємо/закриваємо календар
    // currentDate залишається незмінним і зберігає позицію користувача
    setIsOpen(!isOpen);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    onChange(selectedDate);
    setIsOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    const formattedDate = formatInputDate(date);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isDateDisabled = (date: Date) => {
    if (!minDate) return false;
    const dateStr = date.toISOString().split("T")[0];
    const minDateStr = minDate.toISOString().split("T")[0];
    return dateStr < minDateStr;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    const dateStr = date.toISOString().split("T")[0];
    const selectedStr = selectedDate.toISOString().split("T")[0];
    return dateStr === selectedStr;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    const dateStr = date.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];
    return dateStr === todayStr;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const monthNames = [
      "Січень",
      "Лютий",
      "Березень",
      "Квітень",
      "Травень",
      "Червень",
      "Липень",
      "Серпень",
      "Вересень",
      "Жовтень",
      "Листопад",
      "Грудень",
    ];

    const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

    // Пусті клітинки для днів попереднього місяця
    for (
      let i = 0;
      i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1);
      i++
    ) {
      days.push(<div key={`empty-${i}`} className={css.emptyDay}></div>);
    }

    // Дні поточного місяця
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const today = isToday(date);

      // Логіка маркерів: спочатку перевіряємо selected, потім today
      let dayClasses = css.day;
      if (disabled) {
        dayClasses += ` ${css.dayDisabled}`;
      } else if (selected) {
        dayClasses += ` ${css.daySelected}`;
      } else if (today) {
        dayClasses += ` ${css.dayToday}`;
      }

      days.push(
        <button
          key={`day-${day}`}
          type="button"
          className={dayClasses}
          onClick={() => !disabled && handleDateSelect(date)}
          disabled={disabled}
        >
          {day}
        </button>
      );
    }

    return (
      <div className={css.calendar}>
        <div className={css.calendarHeader}>
          <button
            type="button"
            className={css.navButton}
            onClick={handlePrevMonth}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path
                d="M7 1L2 6L7 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className={css.monthYear}>
            {monthNames[month]} {year}
          </span>
          <button
            type="button"
            className={css.navButton}
            onClick={handleNextMonth}
          >
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path
                d="M1 1L6 6L1 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={css.weekDays}>
          {dayNames.map((dayName) => (
            <div key={dayName} className={css.weekDay}>
              {dayName}
            </div>
          ))}
        </div>

        <div className={css.daysGrid}>{days}</div>
      </div>
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={css.container} ref={containerRef}>
      <div
        className={`${css.trigger} ${error ? css.error : ""} ${isOpen ? css.open : ""}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span
          className={`${css.value} ${!displayValue ? css.placeholder : ""}`}
        >
          {displayValue || placeholder}
        </span>

        <svg
          className={`${css.selectArrow} ${isOpen ? css.selectArrowOpen : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Кастомний календар */}
      {isOpen && <div className={css.dropdown}>{renderCalendar()}</div>}

      {/* Fallback нативний input (прихований) */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={handleDateChange}
        min={minDate ? minDate.toISOString().split("T")[0] : undefined}
        className={css.hiddenInput}
        tabIndex={-1}
      />
    </div>
  );
};

export default CustomDatePicker;
