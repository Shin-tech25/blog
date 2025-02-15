// src/templates/blog-list.js
import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import kebabCase from "lodash/kebabCase"
import * as styles from "../styles/blog-list.module.css"

const BlogList = ({ data, pageContext, location }) => {
  const posts = data.allMarkdownRemark.nodes
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

      <ol className={styles.postList}>
        {currentPage === 1 && (
          <h2 className={styles.sectionTitle}>最近の投稿</h2>
        )}
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={`blog${post.fields.slug}`} className={styles.postItem}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h3>
                    <Link to={`/blog${post.fields.slug}`} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h3>
                  <small>{post.frontmatter.date}</small>
                  <div className={styles.tagArticle}>
                    {post.frontmatter.tags &&
                      post.frontmatter.tags.length > 0 && (
                        <ul className={styles.tagList}>
                          {post.frontmatter.tags.map((tag, index) => (
                            <li key={index} className={styles.tagItem}>
                              <Link
                                to={`/tags/${kebabCase(tag)}/`}
                                itemProp="url"
                              >
                                {tag}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>

      {/* ページネーション */}
      <div>
        <ul className={styles.pagination}>
          {currentPage > 1 && (
            <li>
              <Link
                to={currentPage - 1 === 1 ? `/` : `/page/${currentPage - 1}/`}
                className={styles.paginationNextPrev}
                state={{ noScroll: true }}
              >
                Previous
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
                state={{ noScroll: true }}
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
                state={{ noScroll: true }}
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
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          title
          description
          tags
        }
      }
    }
    allTags: allMarkdownRemark(
      filter: {
        frontmatter: { templateKey: { eq: "blog-post" }, tags: { ne: null } }
      }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
