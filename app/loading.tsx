"use client";
import css from "./loading.module.css";
import Lottie from "lottie-react";
import BabyLoader from "./baby.json";

export default function loading() {
  return (
    <div className={css.loadingBackdrop}>
      <div className={css.loader}>
        <Lottie animationData={BabyLoader} loop autoplay />
      </div>
    </div>
  );
}
