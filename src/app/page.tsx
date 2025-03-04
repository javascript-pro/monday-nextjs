"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type ColumnValue = {
  id: string;
  text: string;
  value: string | null;
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      setSuccessMessage(null);
      const response = await fetch("/api/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      const updatedBoard = await response.json();
      setBoard(updatedBoard.boards?.[0] || null);
      setSuccessMessage("✅ Status updated successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Header Section */}
        <header className={styles.header}>
          <h1>Monday.com POC</h1>
          <button
            className={styles.boardButton}
            onClick={() => window.open("https://goldlabel-apps.monday.com/boards/8614115261", "_blank")}
          >
            Open Monday.com Board
          </button>
        </header>

        {/* Login Info */}
        <section className={styles.authInfo}>
          <p>
            To access the board, log out of Monday.com first and then log in with the credentials below:
          </p>
          <div className={styles.credentials}>
            <p><strong>Email:</strong> demo@goldlabel.pro</p>
            <p><strong>Password:</strong> demo2025</p>
          </div>
        </section>

        {/* Board Data */}
        <section className={styles.boardContainer}>
          <h2>{board ? "" : "Loading Monday Board..."}</h2>

          {loading && <p className={styles.loading}>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}

          {board && (
            <div className={styles.itemsGrid}>
              {board.items_page.items.map((item) => {
                const statusColumn = item.column_values.find((col) => col.id === "status");
                const currentStatus = statusColumn?.text || "To Do"; // Now used below

                return (
                  <div key={item.id} className={styles.itemCard}>
                    <h3 className={styles.itemTitle}>{item.name}</h3>

                    <p className={styles.status}>Status: {currentStatus}</p> {/* Now displayed */}

                    <button
                      className={styles.statusButton}
                      onClick={() => handleStatusChange(item.id, "In Progress")}
                    >
                      Mark as In Progress
                    </button>

                    <div className={styles.itemContent}>
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
                          <div key={col.id} className={styles.column}>
                            <strong>{col.id}:</strong>{" "}
                            {parsedValue && typeof parsedValue === "object" && "url" in parsedValue ? (
                              <a href={(parsedValue as { url: string }).url} target="_blank" rel="noopener noreferrer">
                                {(parsedValue as { text?: string }).text || "Link"}
                              </a>
                            ) : (
                              col.text || "N/A"
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://github.com/javascript-pro/monday-nextjs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code on GitHub
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
