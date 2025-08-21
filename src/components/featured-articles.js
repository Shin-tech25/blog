import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import PostItem from "./post-item"
import * as styles from "../styles/featured-articles.module.css"

const FeaturedArticles = () => {
  // useStaticQueryフックでクエリを実行
  const data = useStaticQuery(graphql`
    query {
      allPopularArticlesYaml {
        nodes {
          slug
        }
      }
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
  `)

  const popularSlugs = data.allPopularArticlesYaml.nodes.map(node => node.slug)
  const allPosts = data.allMarkdownRemark.nodes

  return (
    <section className={styles.featuredArticles}>
      <h2 className={styles.sectionTitle}>Popular articles</h2>
      <div className={styles.postList}>
        {popularSlugs.map(slug => {
          const found = allPosts.find(p => p.fields.slug === slug)
          if (!found) {
            return (
              <p key={slug} style={{ color: "red" }}>
                該当記事が見つかりません: {slug}
              </p>
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
}

export default FeaturedArticles
