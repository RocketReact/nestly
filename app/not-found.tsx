import css from "./not-found.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 Not Found Page",
  description: "Sorry, the page you are looking for does not exist.",
  openGraph: {
    title: "Not Found Page",
    description: "Sorry, the page you are looking for does not exist.",
    images: [
      {

        alt: "Note Hub - Note Taking App",
        url: ``,
      },
    ],
  },
};

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
