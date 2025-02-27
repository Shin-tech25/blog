import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import * as styles from "../styles/hamburger-menu.module.css"

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)

  // メニューを開閉する
  const toggleMenu = () => {
    setIsOpen(!isOpen)
    document.body.style.overflow = isOpen ? "auto" : "hidden" // スクロール制御
  }

  // メニュー内のリンククリックで閉じる
  const handleClose = () => {
    setIsOpen(false)
    document.body.style.overflow = "auto"
  }

  // コンポーネントがアンマウントされたらスクロールを戻す
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <div className={styles.container}>
      {/* ハンバーガーボタン */}
      <button className={styles.hamburgerButton} onClick={toggleMenu}>
        ☰
      </button>

      {/* オーバーレイ（背景） */}
      <button
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={handleClose}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === "Escape") handleClose()
        }}
        aria-label="メニューを閉じる"
      ></button>

      {/* メニュー本体 */}
      <nav className={`${styles.nav} ${isOpen ? styles.open : ""}`}>
        <ul>
          <li>
            <Link
              to="/"
              activeClassName={styles.activeLink}
              onClick={handleClose}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/service"
              activeClassName={styles.activeLink}
              onClick={handleClose}
            >
              Service
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              activeClassName={styles.activeLink}
              onClick={handleClose}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              activeClassName={styles.activeLink}
              onClick={handleClose}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
