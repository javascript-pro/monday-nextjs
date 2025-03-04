"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type ColumnValue = {
  id: string;
  text: string;
  value: string | null; // Some values are JSON-encoded, some are null
};

type Item = {
  id: string;
  name: string;
  column_values: ColumnValue[];
};

type Board = {
  id: string;
  name: string;
  items_page: {
    items: Item[];
  };
};

export default function Home() {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMondayData() {
      try {
        const response = await fetch("/api/monday");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBoard(data.boards?.[0] || null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMondayData();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <div className={styles.ctas}>
          <a className={styles.primary} href="/start">
            Start Here
          </a>
          <a className={styles.primary} href="https://github.com/javascript-pro/monday-nextjs" target="_blank">
            GitHub
          </a>
        </div> */}

        <section className={styles.items}>
          <h2>{board ? board.name : "Loading Monday Board..."}</h2>

          {loading && <p>Loading...</p>}
          {error && <p className={styles.error}>Error: {error}</p>}

          {board && (
            <ul>
              {board.items_page.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <h3>{item.name}</h3>
                  <ul>
                    {item.column_values.map((col) => {
                      let parsedValue: string | Record<string, unknown> | null = col.value;

                      if (typeof parsedValue === "string" && parsedValue.startsWith("{")) {
                        try {
                          parsedValue = JSON.parse(parsedValue) as Record<string, unknown>;
                        } catch {
                          parsedValue = col.text || "Invalid JSON format";
                        }
                      }

                      return (
                        <li key={col.id}>
                          <strong>{col.id}:</strong>{" "}
                          {parsedValue && typeof parsedValue === "object" && "url" in parsedValue ? (
                            <a href={(parsedValue as { url: string }).url} target="_blank" rel="noopener noreferrer">
                              {(parsedValue as { text?: string }).text || "Link"}
                            </a>
                          ) : (
                            col.text || "N/A"
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>by Goldlabel</p>
      </footer>
    </div>
  );
}
