"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./Breadcrumbs.module.css";
import { MdKeyboardArrowRight } from "react-icons/md";

const labelMap: Record<string, string> = {
  "/": "Лелека",
  "/journey": "Подорож",
  "/diary": "Щоденник",
  "/profile": "Профіль",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  if (!pathname || pathname.startsWith("/auth")) return null;

  const parts = pathname.split("/").filter(Boolean);
  const segments: { href: string; label: string }[] = [];

  segments.push({ href: "/", label: labelMap["/"] });

  if (parts.length > 0) {
    let routeLine = "";
    parts.forEach((part, idx) => {
      routeLine += "/" + part;

      let href = routeLine;
      let label = labelMap[routeLine] ?? decodeURIComponent(part);

      if (parts[0] === "journey" && idx === 0) {
        label = labelMap["/journey"];
        href = `/journey/${user?.curWeekNumber}`;
      }
      if (parts[0] === "journey" && idx === 1) {
        label = `Тиждень ${part}`;
      }

      segments.push({ href, label });
    });
  }

  return (
    <div
      className={css.breadcrumbsWrapper}
      role="navigation"
      aria-label="Breadcrumb"
    >
      <ul className={css.breadcrumbsList}>
        {segments.map((segment, i) => {
          const isLast = i === segments.length - 1;
          return isLast ? (
            <li key={i} className={css.breadcrumbsItem} aria-current="page">
              {segment.label}
            </li>
          ) : (
            <li key={i} className={css.breadcrumbsItem1}>
              <Link className={css.breadcrumbsLink} href={segment.href}>
                {segment.label}
              </Link>
              <MdKeyboardArrowRight size={24} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
