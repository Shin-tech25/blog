import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import kebabCase from "lodash/kebabCase"
import * as styles from "../styles/blog-list.module.css"
import PostItem from "../components/post-item"

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

  const FeaturedArticles = () => (
    <section className={styles.featuredArticles}>
      <h2 className={styles.sectionTitle}>人気の記事</h2>
      <ul className={styles.articleList}>
        <li>
          <Link
            to="/blog/4-months-pmp-exam-success"
            className={styles.articleLink}
          >
            PMP受験記録
          </Link>
        </li>
        <li>
          <Link
            to="/blog/python-temporary-data-storage"
            className={styles.articleLink}
          >
            Pythonによる一時データ保存のベストプラクティス
          </Link>
        </li>
        <li>
          <Link
            to="/blog/us-stock-market-cap-strategies"
            className={styles.articleLink}
          >
            米国株投資における時価総額別の分類と投資戦略
          </Link>
        </li>
      </ul>
    </section>
  )

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
        <h2 className={styles.sectionTitle}>人気のタグ</h2>
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
      {currentPage === 1 && <h2 className={styles.sectionTitle}>最近の投稿</h2>}

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
      <div className={styles.paginationWrapper}>
        <ul className={styles.pagination}>
          {currentPage > 1 && (
            <li>
              <Link
                to={currentPage - 1 === 1 ? `/` : `/page/${currentPage - 1}/`}
                className={styles.paginationNextPrev}
              >
                Prev
              </Link>
            </li>
          )}
          {Array.from({ length: numPages }).map((_, index) => (
            <li key={index}>
              <Link
                to={index === 0 ? `/` : `/page/${index + 1}/`}
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
                to={`/page/${currentPage + 1}/`}
                className={styles.paginationNextPrev}
              >
                Next
              </Link>
            </li>
          )}
        </ul>
      </div>
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
