// src/templates/blog-list.js
import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import kebabCase from "lodash/kebabCase"

const BlogList = ({ data, pageContext, location }) => {
  const posts = data.allMarkdownRemark.nodes
  const { currentPage, numPages } = pageContext

  if (posts.length === 0) {
    return (
      <Layout location={location}>
        <p>No blog posts found.</p>
      </Layout>
    )
  }

  const FeaturedSection = () => (
    <section>
      <h2>人気の記事</h2>
      <ul>
        <li>
          <Link to="/blog/popular-post-1">人気記事 1</Link>
        </li>
        <li>
          <Link to="/blog/popular-post-2">人気記事 2</Link>
        </li>
        <li>
          <Link to="/blog/popular-post-3">人気記事 3</Link>
        </li>
      </ul>
      <h2>人気のタグ</h2>
      <ul>
        <li>
          <Link to="/tags/tag1">#タグ1</Link>
        </li>
        <li>
          <Link to="/tags/tag2">#タグ2</Link>
        </li>
        <li>
          <Link to="/tags/tag3">#タグ3</Link>
        </li>
      </ul>
    </section>
  )

  return (
    <Layout location={location}>
      {currentPage === 1 && <FeaturedSection />}

      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={`blog${post.fields.slug}`}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={`/blog${post.fields.slug}`} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                  <div className="tag-article">
                    {post.frontmatter.tags &&
                      post.frontmatter.tags.length > 0 && (
                        <ul className="tag-list">
                          {post.frontmatter.tags.map((tag, index) => (
                            <li key={index} className="tag-item">
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
        {currentPage > 1 && (
          <Link
            to={currentPage - 1 === 1 ? `/` : `/page/${currentPage - 1}/`} // ページ1の場合はルートにリンク
            style={{ margin: "0 10px" }}
          >
            Previous
          </Link>
        )}
        {Array.from({ length: numPages }).map((_, index) => (
          <Link
            key={index}
            to={index === 0 ? `/` : `/page/${index + 1}/`} // ページ1はルートを使用
            style={{
              margin: "0 5px",
              fontWeight: currentPage === index + 1 ? "bold" : "normal",
            }}
          >
            {index + 1}
          </Link>
        ))}
        {currentPage < numPages && (
          <Link to={`/page/${currentPage + 1}/`} style={{ margin: "0 10px" }}>
            Next
          </Link>
        )}
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
  }
`
