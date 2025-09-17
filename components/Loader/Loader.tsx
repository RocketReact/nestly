"use client";
import React from "react";
import css from "./Loader.module.css";

interface Props {
  styles?: React.CSSProperties;
}

export default function Loader({ styles }: Props) {
  return <div style={styles} className={css.spinner}></div>;
}
