"use client";

import { useSidebar } from "@/lib/store/sidebarStore";
import css from "./Sidebar.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoIosClose } from "react-icons/io";
import { BsCalendar2Event } from "react-icons/bs";
import { LuRoute } from "react-icons/lu";
import { TbBook2 } from "react-icons/tb";
import { RxAvatar } from "react-icons/rx";
import { useAuthStore } from "@/lib/store/authStore";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { logout } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { LuLogOut } from "react-icons/lu";
import { GoSignIn } from "react-icons/go";

export default function Sidebar() {
  const { open, close } = useSidebar();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const isLoggedout = useAuthStore((state) => state.clearIsAuthenticated);

  // Lock scroll for mobile modal mode
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onLogout = async () => {
    await logout();
    isLoggedout();
    router.push("/auth/register");
  };

  return (
    <>
      <div
        className={`${css.backdrop} ${open ? css.show : ""}`}
        onClick={close}
        aria-hidden="true"
      ></div>
      <aside
        id="app-sidebar"
        className={`${css.sidebar} ${open ? css.open : ""}`}
        area-label="Sidebar navigation"
      >
        <div className={css.sidebarHeader}>
          <Link href="/">
            <Image
              src="/logo.svg"
              width={105}
              height={45}
              alt="Logo"
              priority
            />
          </Link>
          <button className={css.sidebarCloseBtn} type="button" onClick={close}>
            <IoIosClose size={32} />
          </button>
        </div>
        <div className={css.sidebarContent}>
          <ul className={css.menuList}>
            <li className={css.menuListItem}>
              <BsCalendar2Event size={24} />
              <Link onClick={close} href="/">
                Мій день
              </Link>
            </li>
            <li className={css.menuListItem}>
              <LuRoute size={24} />
              <Link onClick={close} href={`/journey/${user?.curWeekNumber}`}>
                Подорож
              </Link>
            </li>
            <li className={css.menuListItem}>
              <TbBook2 size={24} />
              <Link onClick={close} href="/diary">
                Щоденник
              </Link>
            </li>
            <li className={css.menuListItem}>
              <RxAvatar size={24} />
              <Link onClick={close} href="/profile">
                Профіль
              </Link>
            </li>
          </ul>
          <div className={css.sidebarFooter}>
            {!isAuthenticated ? (
              <div className={css.sidebarFooterWrapper}>
                <ul className={css.sidebarFooterPublic}>
                  <li className={css.sidebarFooterItem}>
                    <GoSignIn size={24} />
                    <Link onClick={close} href="/auth/login">
                      Вхід
                    </Link>
                  </li>
                  <li className={css.sidebarFooterItem}>
                    <RxAvatar size={24} />
                    <Link onClick={close} href="/auth/register">
                      Реєстрація
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <div className={css.sidebarFooterAuthUser}>
                <div className={css.sidebarFooterUserData}>
                  <Image
                    src={user?.avatarUrl ?? "/default-avatar.png"}
                    width={40}
                    height={40}
                    alt="Avatar"
                    priority
                    className={css.sidebarAvatar}
                  />
                  <div>
                    <p className={css.sidebarFooterUserName}>{user?.name}</p>
                    <p className={css.sidebarFooterUserEmail}>{user?.email}</p>
                  </div>
                </div>
                <button
                  className={css.sidebarFooterBtn}
                  type="button"
                  onClick={() => setModal(true)}
                >
                  <LuLogOut size={24} />
                </button>
                {modal && (
                  <ConfirmationModal
                    onConfirm={onLogout}
                    onCancel={() => setModal(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
