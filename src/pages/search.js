// src/pages/search.js

import React, { useEffect, useMemo, useState } from "react"
import Fuse from "fuse.js"
import { Link } from "gatsby"

const SearchPage = ({ location }) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [searchData, setSearchData] = useState([])

  // URL クエリパラメータから keyword を取得
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const keyword = params.get("keyword") || ""
    setQuery(keyword)
  }, [location.search])

  // 検索インデックスをロード
  useEffect(() => {
    fetch("/search-index.json")
      .then(res => res.json())
      .then(data => {
        setSearchData(data)
      })
      .catch(err => {
        console.error("Failed to load search data:", err)
      })
  }, [])

  // Fuse.js インスタンス
  const fuse = useMemo(
    () =>
      new Fuse(searchData, {
        keys: ["title", "description", "tags"],
        threshold: 0.3,
      }),
    [searchData]
  )

  // query が変化したら検索を実行
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    const fuseResults = fuse.search(query)
    setResults(fuseResults.map(r => r.item))
  }, [query, fuse])

  // ユーザー入力 -> URL に反映
  const handleInputChange = e => {
    const val = e.target.value
    setQuery(val)

    // URLクエリを書き換える
    const params = new URLSearchParams(location.search)
    if (val) {
      params.set("keyword", val)
    } else {
      params.delete("keyword")
    }
    const newUrl = `/search?${params.toString()}`
    window.history.replaceState({}, "", newUrl)
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Search</h1>
      <div>
        <label htmlFor="searchInput">キーワードで検索:</label>
        <input
          type="text"
          id="searchInput"
          value={query}
          onChange={handleInputChange}
          style={{ width: "300px", marginLeft: "0.5rem" }}
          placeholder="検索ワード"
        />
      </div>

      <ul style={{ marginTop: "1rem" }}>
        {results.map(post => (
          <li key={post.slug}>
            <Link to={`/blog${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SearchPage
