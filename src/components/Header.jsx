import React from "react"
import Helmet from "react-helmet"
import { useStaticQuery, Link, graphql, withPrefix } from "gatsby"
import styles from "../styles/header.module.css"

export default ({ page }) => {
  const {
    site: {
      siteMetadata: { title, description },
    },
  } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `
  )

  return (
    <>
      <Helmet
        htmlAttributes={{ lang: "ja" }}
        title={title}
        meta={[
          {
            name: "description",
            content: description,
          },
        ]}
      />
      <header>
        {page === "top" && (
          <div
            className={styles.headerImg}
            style={{ backgroundImage: `url(${withPrefix("header.png")}` }}
          >
            &nbsp;
          </div>
        )}
        <div className={styles.headerBox}>
          <h1>
            <Link to="/">{title}</Link>
          </h1>
          <p>{description}</p>
        </div>
      </header>
    </>
  )
}
