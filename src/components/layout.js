import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import SearchBar from "./search-bar"
import HamburgerMenu from "./hamburger-menu"

const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  let header
  if (isRootPath) {
    header = (
      <div>
        <div className="nav-container">
          <div className="inner-container">
            <HamburgerMenu />
            <div className="logo">
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
            </nav>
            <SearchBar />
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
          <HamburgerMenu />
          <div className="logo">
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
          </nav>
          <SearchBar />
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
