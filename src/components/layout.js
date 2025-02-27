import * as React from "react"
import { Link, navigate } from "gatsby" // navigate を使う
import { StaticImage } from "gatsby-plugin-image"

const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  // 🔍 検索ワードの state
  const [query, setQuery] = React.useState("")

  // フォーム送信時に検索ページへ移動
  const handleSubmit = e => {
    e.preventDefault()
    if (!query) return
    const encoded = encodeURIComponent(query)
    navigate(`/search?keyword=${encoded}`)
  }

  let header
  if (isRootPath) {
    header = (
      <div>
        <div className="nav-container">
          <div className="inner-container">
            <div>
              <Link to="/">
                <StaticImage
                  src="../images/coffee-logo.svg"
                  alt="Logo"
                  className="logo-image"
                  placeholder="blurred"
                  layout="fixed"
                  width={50}
                  height={50}
                />
              </Link>
            </div>
            <nav className="nav">
              <Link to="/">Home</Link>
              <Link to="/service">Service</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>

              {/* ▼ ここに検索フォームを配置 */}
              <form onSubmit={handleSubmit} style={{ marginLeft: "1rem" }}>
                <label htmlFor="navSearch" style={{ marginRight: "0.5rem" }}>
                  キーワードで検索:
                </label>
                <input
                  id="navSearch"
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="検索ワード"
                  style={{ width: "150px" }}
                />
              </form>
              {/* ▲ 検索フォーム */}
            </nav>
          </div>
        </div>
        <div className="hero-image-container">
          <StaticImage
            src="../images/hero.jpg"
            alt="Bookshelf"
            className="hero-image"
            placeholder="blurred"
            layout="fullWidth"
            aspectRatio={16 / 9}
          />
        </div>
      </div>
    )
  } else {
    header = (
      <div className="nav-container">
        <div className="inner-container">
          <div>
            <Link to="/">
              <StaticImage
                src="../images/coffee-logo.svg"
                alt="Logo"
                className="logo-image"
                placeholder="blurred"
                layout="fixed"
                width={50}
                height={50}
              />
            </Link>
          </div>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/service">Service</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>

            {/* ▼ ここにも検索フォームを配置 */}
            <form onSubmit={handleSubmit} style={{ marginLeft: "1rem" }}>
              <label htmlFor="navSearch2" style={{ marginRight: "0.5rem" }}>
                キーワードで検索:
              </label>
              <input
                id="navSearch2"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="検索ワード"
                style={{ width: "150px" }}
              />
            </form>
          </nav>
        </div>
      </div>
    )
  }

  return (
    <div className="site">
      <header className="global-header">{header}</header>
      <div className="global-wrapper" data-is-root-path={isRootPath}>
        <main>{children}</main>
      </div>
      {/* ...footer */}
    </div>
  )
}

export default Layout
