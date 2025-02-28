import React, { useState, useRef, useEffect } from "react"
import { navigate } from "gatsby"
import * as styles from "../styles/search-bar.module.css"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const inputRef = useRef(null) // 検索ボックスの参照を作成

  // キーボードショートカット（Ctrl + F / `/`）で検索ボックスにフォーカス
  useEffect(() => {
    const handleKeyDown = event => {
      if ((event.ctrlKey && event.key === "f") || event.key === "/") {
        event.preventDefault() // デフォルトの検索を無効化
        if (inputRef.current) {
          inputRef.current.focus()
        }
      } else if (event.key === "Escape") {
        if (inputRef.current) {
          inputRef.current.blur() // フォーカス解除
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

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
        ref={inputRef} // 検索ボックスに `ref` を設定
      />
    </form>
  )
}
