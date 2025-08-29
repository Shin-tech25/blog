import * as React from "react"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"
import Layout from "../components/layout"
import PostItem from "../components/post-item"
import FeaturedArticles from "../components/featured-articles"
import Pagination from "../components/pagination"
import * as styles from "../styles/blog-list.module.css"

const BlogList = ({ data, pageContext, location }) => {
  const posts = data.allMarkdownRemark
  const tags = data.allTags.group
  const { currentPage, numPages } = pageContext

  if (posts.length === 0) {
    return (
      <Layout location={location}>
        <p>No blog posts found.</p>
      </Layout>
    )
  }

  const FeaturedTags = ({ tags }) => {
    if (!tags || tags.length === 0) {
      return <p>No tags found.</p> // タグが存在しない場合の処理
    }
    // タグを投稿数でソート（降順）し、上位20件を取得
    const sortedTags = tags
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, 20)

    return (
      <section className={styles.featuredTags}>
        <h2 className={styles.sectionTitle}>Popular tags</h2>
        <ul className={styles.tagList}>
          {sortedTags.map(tag => (
            <li key={tag.fieldValue} className={styles.tagItem}>
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                {tag.fieldValue} ({tag.totalCount} posts)
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  const FeaturedSection = () => (
    <div className={styles.featuredSection}>
      <FeaturedArticles />
      <FeaturedTags tags={tags} /> {/* 全タグ情報を渡す */}
    </div>
  )

  return (
    <Layout location={location}>
      {currentPage === 1 && <FeaturedSection />}
      {currentPage === 1 && (
        <h2 className={styles.sectionTitle}>Recent activities</h2>
      )}
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

      {/* ページネーション */}
      <Pagination
        current={currentPage}
        totalPages={numPages}
        basePath="/page"
      />
    </Layout>
  )
}

export default BlogList

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      skip: $skip
      limit: $limit
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
    allTags: allMarkdownRemark(
      filter: {
        frontmatter: { templateKey: { eq: "blog-post" }, tags: { ne: null } }
      }
    ) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`
