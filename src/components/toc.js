import React from "react"

const TableOfContents = ({ tableOfContents }) => {
  if (!tableOfContents) return null // nullチェック

  return (
    <nav className="toc">
      <h2>Table of Contents</h2>
      <div dangerouslySetInnerHTML={{ __html: tableOfContents }} />
    </nav>
  )
}

export default TableOfContents
