import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import kebabCase from "lodash/kebabCase"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { FaSearch } from "react-icons/fa"
import * as styles from "../styles/tag-search.module.css"

const Tags = ({ data, pageContext, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { totalCount } = data.allMarkdownRemark
  const posts = data.allMarkdownRemark.nodes
  const { tag } = pageContext

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={`tag: ${tag} (0 post)`} />
        <p>該当するタグの投稿記事がありません。</p>
      </Layout>
    )
  }

  const tagHeader = (
    <span className={styles.tagHeader}>
      <FaSearch className={styles.tagIcon} /> tag: {tag} ({totalCount} posts)
    </span>
  )

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={`tag: ${tag} | ${siteTitle}`} />
      <h1>{tagHeader}</h1>
      <div className={styles.postList}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const image = getImage(post.frontmatter.featuredImage)

          return (
            <div key={post.fields.slug} className={styles.postItem}>
              {image ? (
                <GatsbyImage
                  image={image}
                  alt={post.frontmatter.title}
                  className={styles.postThumbnail}
                />
              ) : (
                <div className={styles.noImageBox}>
                  <span className={styles.noImageText}>No Image</span>
                </div>
              )}
              <div className={styles.postContent}>
                <h3 className={styles.postTitle}>
                  <Link to={`/blog${post.fields.slug}`}>{title}</Link>
                </h3>
                <small className={styles.postDate}>
                  {post.frontmatter.date}
                </small>
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <ul className={styles.tagList}>
                    {post.frontmatter.tags.map((tag, index) => (
                      <li key={index} className={styles.tagItem}>
                        <Link to={`/tags/${kebabCase(tag)}/`} itemProp="url">
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <p className={styles.postDescription}>
                  {post.frontmatter.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query ($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      nodes {
        excerpt
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
`
