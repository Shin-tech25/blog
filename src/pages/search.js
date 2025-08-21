// src/pages/search.js

import React, { useEffect, useMemo, useState } from "react"
import Fuse from "fuse.js"
import Layout from "../components/layout"
import PostItem from "../components/post-item"

import * as styles from "../styles/search.module.css"

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
        keys: ["title", "description", "tags", "body"],
        threshold: 0.5, // 0に近いほど厳密、1.0に近いほど緩い
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
    <Layout location={location}>
      <h1>Search</h1>
      <div className={styles.searchContainer}>
        <button type="submit" className={styles.searchButton}>
          🔍
        </button>
        <input
          type="text"
          id="searchInput"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter keywords"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.postList}>
        {results.map(post => (
          <PostItem
            key={post.slug}
            post={{
              slug: post.slug,
              title: post.title,
              date: post.date,
              tags: post.tags,
              description: post.description,
              featuredImage: post.featuredImage,
            }}
          />
        ))}
      </div>
    </Layout>
  )
}

export default SearchPage
