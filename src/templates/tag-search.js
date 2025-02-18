import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import PostItem from "../components/post-item"
import Seo from "../components/seo"
import { FaSearch } from "react-icons/fa"
import kebabCase from "lodash/kebabCase"
import * as styles from "../styles/tag-search.module.css"

const TagSearch = ({ data, pageContext, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { totalCount } = data.allMarkdownRemark
  const { tag, currentPage, numPages } = pageContext
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={`tag: ${tag} (0 post)`} />
        <p>該当するタグの投稿記事がありません。</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={`tag: ${tag} | ${siteTitle}`} />
      <h1 className={styles.tagHeader}>
        <FaSearch className={styles.tagIcon} /> tag: {tag} (posts: {totalCount},
        page: {currentPage}/{numPages})
      </h1>

      <div className={styles.postList}>
        {posts.map(post => (
          <PostItem
            key={post.fields.slug}
            post={{
              slug: post.fields.slug,
              title: post.frontmatter.title,
              date: post.frontmatter.date,
              tags: post.frontmatter.tags,
              description: post.frontmatter.description,
              featuredImage: post.frontmatter.featuredImage,
            }}
          />
        ))}
      </div>

      {/* 🔹 ページネーション */}
      {numPages > 1 && (
        <div className={styles.paginationWrapper}>
          <ul className={styles.pagination}>
            {currentPage > 1 && (
              <li>
                <Link
                  to={
                    currentPage - 1 === 1
                      ? `/tags/${kebabCase(tag)}`
                      : `/tags/${kebabCase(tag)}/page/${currentPage - 1}`
                  }
                  className={styles.paginationNextPrev}
                >
                  Prev
                </Link>
              </li>
            )}
            {Array.from({ length: numPages }).map((_, index) => (
              <li key={index}>
                <Link
                  to={
                    index === 0
                      ? `/tags/${kebabCase(tag)}`
                      : `/tags/${kebabCase(tag)}/page/${index + 1}`
                  }
                  className={`${styles.paginationItem} ${
                    currentPage === index + 1 ? styles.active : ""
                  }`}
                >
                  {index + 1}
                </Link>
              </li>
            ))}
            {currentPage < numPages && (
              <li>
                <Link
                  to={`/tags/${kebabCase(tag)}/page/${currentPage + 1}`}
                  className={styles.paginationNextPrev}
                >
                  Next
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </Layout>
  )
}

export default TagSearch

export const pageQuery = graphql`
  query ($tag: String, $skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] } } }
      skip: $skip
      limit: $limit
    ) {
      totalCount
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
`
