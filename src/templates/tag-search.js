import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import PostItem from "../components/post-item"
import Seo from "../components/seo"
import { FaTag } from "react-icons/fa"
import kebabCase from "lodash/kebabCase"
import Pagination from "../components/pagination"
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
        <FaTag className={styles.tagIcon} /> {tag} (posts: {totalCount}, page:{" "}
        {currentPage}/{numPages})
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
      <Pagination
        current={currentPage}
        totalPages={numPages}
        basePath={`/tags/${kebabCase(tag)}/page`}
      />
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
