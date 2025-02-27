// import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>


        <h1 className={styles.title}>
          Monday NextJS
        </h1>

        <p className={styles.subtitle}>
          Make much smarter custom apps
        </p>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="/start"
            target="_self"
          >
            Start Here
          </a>
          <a
            className={styles.primary}
            href="https://github.com/javascript-pro/monday-nextjs"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>by Goldlabel</p>
      </footer>
    </div>
  );
}
