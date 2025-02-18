import React from "react"
import { StaticQuery, graphql } from "gatsby"
import PostItem from "./post-item"
import * as styles from "../styles/featured-articles.module.css"

const FeaturedArticles = ({ slugList }) => {
  return (
    <StaticQuery
      query={graphql`
        query {
          allMarkdownRemark(
            filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
          ) {
            nodes {
              fields {
                slug
              }
              frontmatter {
                date(formatString: "YYYY-MM-DD")
                title
                description
                tags
                featuredImage {
                  childImageSharp {
                    gatsbyImageData(layout: CONSTRAINED)
                  }
                }
              }
            }
          }
        }
      `}
      render={data => {
        const allPosts = data.allMarkdownRemark.nodes

        return (
          <section className={styles.featuredArticles}>
            <h2 className={styles.sectionTitle}>人気の記事</h2>

            <div className={styles.postList}>
              {slugList.map(slug => {
                const found = allPosts.find(p => p.fields.slug === slug)
                if (!found) {
                  return (
                    <div
                      key={slug}
                      style={{ color: "red", marginBottom: "1rem" }}
                    >
                      該当記事が見つかりませんでした: {slug}
                    </div>
                  )
                }
                return (
                  <PostItem
                    key={slug}
                    post={{
                      slug: found.fields.slug,
                      title: found.frontmatter.title,
                      date: found.frontmatter.date,
                      tags: found.frontmatter.tags,
                      description: found.frontmatter.description,
                      featuredImage: found.frontmatter.featuredImage,
                    }}
                  />
                )
              })}
            </div>
          </section>
        )
      }}
    />
  )
}

export default FeaturedArticles
