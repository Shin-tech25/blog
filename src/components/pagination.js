import * as React from "react"
import { navigate } from "gatsby"
import * as styles from "../styles/pagination.module.css"

// ---- PC用（省略記号あり） ----
const buildItems = (current, total, edge = 2, around = 1) => {
  // 先頭 edge 件・末尾 edge 件・現在 around 件を表示し、間は "…" を挿入
  const range = (s, e) => Array.from({ length: e - s + 1 }, (_, i) => s + i)
  const set = new Set()
  range(1, Math.min(edge, total)).forEach(p => set.add(p))
  range(
    Math.max(1, current - around),
    Math.min(total, current + around)
  ).forEach(p => set.add(p))
  range(Math.max(1, total - edge + 1), total).forEach(p => set.add(p))
  const ordered = Array.from(set).sort((a, b) => a - b)

  const items = []
  for (let i = 0; i < ordered.length; i++) {
    if (i > 0 && ordered[i] - ordered[i - 1] > 1) items.push("...")
    items.push(ordered[i])
  }
  return items
}

// ---- モバイル／中間幅用（5件固定・省略記号なし） ----
const buildItemsCompact = (current, total, windowSize = 5) => {
  if (total <= windowSize) return Array.from({ length: total }, (_, i) => i + 1)
  const half = Math.floor(windowSize / 2)
  let start = current - half
  let end = current + half
  if (start < 1) {
    start = 1
    end = windowSize
  }
  if (end > total) {
    end = total
    start = total - windowSize + 1
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/**
 * @param {object} props
 * @param {number} props.current 現在のページ(1始まり)
 * @param {number} props.totalPages 総ページ数
 * @param {string} [props.basePath="/page"] 2ページ目以降のベース（末尾スラッシュ有りで遷移）
 *   例) ルート: "/page", タグ: `/tags/${tagKebab}/page`
 */
export default function Pagination({
  current,
  totalPages,
  basePath = "/page",
}) {
  const [input, setInput] = React.useState("")

  // ブレークポイント（≤480px をモバイル、≤900px をナロー扱い）
  const [isMobile, setIsMobile] = React.useState(false)
  const [isNarrow, setIsNarrow] = React.useState(false)
  React.useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 480px)")
    const mqNarrow = window.matchMedia("(max-width: 900px)")
    const update = () => {
      setIsMobile(mqMobile.matches)
      setIsNarrow(mqNarrow.matches)
    }
    update()
    mqMobile.addEventListener?.("change", update)
    mqNarrow.addEventListener?.("change", update)
    return () => {
      mqMobile.removeEventListener?.("change", update)
      mqNarrow.removeEventListener?.("change", update)
    }
  }, [])

  const go = page => {
    if (!page || page < 1 || page > totalPages) return
    // basePath から 1ページ目のルートと 2ページ目以降のベースを導出
    // 例) basePath="/tags/english/page" → root="/tags/english/", pageBase="/tags/english/page/"
    const normalizedBase = String(basePath).replace(/\/+$/, "")
    const rootPathRaw = normalizedBase.replace(/\/page$/, "")
    const rootPath = rootPathRaw === "" ? "/" : rootPathRaw + "/"
    const pageBase = normalizedBase + "/"
    if (page === 1) navigate(rootPath)
    else navigate(pageBase + page + "/")
  }

  // PC: 省略記号あり / ≤900px: 5件固定（省略記号なし）
  const items = isNarrow
    ? buildItemsCompact(current, totalPages, 5)
    : buildItems(current, totalPages, 2, 1)

  return (
    <nav className={styles.wrap} aria-label="Pagination">
      <button
        className={styles.arrow}
        onClick={() => go(current - 1)}
        disabled={current === 1}
        aria-label="Previous page"
      >
        <span aria-hidden>‹</span>
      </button>

      <ul className={styles.list}>
        {items.map((it, i) =>
          it === "..." ? (
            <li key={`dots-${i}`} className={styles.dots} aria-hidden>
              …
            </li>
          ) : (
            <li key={it}>
              <button
                className={`${styles.page} ${
                  it === current ? styles.active : ""
                }`}
                aria-current={it === current ? "page" : undefined}
                onClick={() => go(it)}
              >
                {it}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        className={styles.arrow}
        onClick={() => go(current + 1)}
        disabled={current === totalPages}
        aria-label="Next page"
      >
        <span aria-hidden>›</span>
      </button>

      {/* モバイル（≤480px）はGo一式を出さない。PC/中間幅はラベル無しで表示 */}
      {!isMobile && (
        <div className={styles.goto}>
          <input
            type="number"
            min={1}
            max={totalPages}
            inputMode="numeric"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go(Number(input))}
            className={styles.input}
            aria-label="Go to page"
          />
          <button className={styles.goBtn} onClick={() => go(Number(input))}>
            Go
          </button>
        </div>
      )}
    </nav>
  )
}
