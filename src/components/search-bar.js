// SearchBar.js
import React, { useState } from "react"
import { navigate } from "gatsby"
import * as styles from "../styles/search-bar.module.css"

export default function SearchBar() {
  const [query, setQuery] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    if (!query) return
    const encoded = encodeURIComponent(query)
    navigate(`/search?keyword=${encoded}`)
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <button type="submit" className={styles.searchButton}>
        🔍
      </button>
      <input
        type="text"
        placeholder="キーワードで検索"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </form>
  )
}
