"use client";

import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import Container from "../Container/Container";
import css from "./Header.module.css";
import Link from "next/link";
import { useSidebar } from "@/lib/store/sidebarStore";

export default function Header() {
  const { open, toggle } = useSidebar();
  return (
    <div className={css.header}>
      <Container>
        <nav className={css.headerNav}>
          <Link href="/">
            <Image src="/logo.svg" width={84} height={36} alt="Logo" priority />
          </Link>
          <button
            type="button"
            className={css.burgerBtn}
            area-laber="Open menu"
            aria-controls="app-sidebar"
            aria-expanded={open}
            onClick={toggle}
          >
            <GiHamburgerMenu className={css.burgerIcon} size={32} />
          </button>
        </nav>
      </Container>
    </div>
  );
}
