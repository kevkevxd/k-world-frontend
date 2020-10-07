import React from "react";
import styles from "./engine.module.scss";

export default function Engine() {
  return (
    <div className={styles.container}>
      <span className={styles.character} />
    </div>
  );
}
