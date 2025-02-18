import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import PostItem from "../components/post-item"
import Seo from "../components/seo"
import { FaSearch } from "react-icons/fa"
import * as styles from "../styles/tag-search.module.css"

const Tags = ({ data, pageContext, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { totalCount } = data.allMarkdownRemark
  const posts = data.allMarkdownRemark
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
        {posts.nodes.map(post => (
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
      sort: { frontmatter: { date: DESC } }
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
