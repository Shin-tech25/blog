import React from "react"
import styles from "../styles/main.module.css"

export default ({ children, sidebar }) => (
  <div className={styles.flex}>
    <div className={styles.mainLeft}>{children}</div>
    <div className={styles.mainRight}>{sidebar}</div>
  </div>
)
