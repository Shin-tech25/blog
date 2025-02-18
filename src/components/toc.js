import React from "react"
import * as styles from "../styles/toc.module.css"

const TableOfContents = ({ tableOfContents }) => {
  if (!tableOfContents) return null // nullチェック

  return (
    <nav className={styles.toc}>
      <h2>Table of Contents</h2>
      <div dangerouslySetInnerHTML={{ __html: tableOfContents }} />
    </nav>
  )
}

export default TableOfContents
