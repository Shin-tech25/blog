import React from "react"
import { useStaticQuery, Link, graphql } from "gatsby"

export default () => {
  const {
    recentlyAllMarkdownRemark: { edges: recentlyBlogs },
    categoriesAllMarkdownRemark: { group: categories },
  } = useStaticQuery(
    graphql`
      query {
        recentlyAllMarkdownRemark: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 5
        ) {
          edges {
            node {
              id
              frontmatter {
                title
              }
              fields {
                slug
              }
            }
          }
        }
        categoriesAllMarkdownRemark: allMarkdownRemark {
          group(field: frontmatter___categories) {
            category: fieldValue
            totalCount
          }
        }
      }
    `
  )

  return (
    <>
      <div>
        <h3>固定ページ</h3>
        <ul>
          <li>
            <Link to="/sample-page/">サンプルページ</Link>
          </li>
        </ul>
      </div>

      <div>
        <h3>最近の投稿</h3>
        <ul>
          {recentlyBlogs.map(
            ({
              node: {
                id,
                frontmatter: { title },
                fields: { slug },
              },
            }) => (
              <li key={id}>
                <Link to={slug}>{title}</Link>
              </li>
            )
          )}
        </ul>
      </div>

      <div>
        <h3>カテゴリー</h3>
        <ul>
          {categories.map(({ category, totalCount }) => (
            <li key={category}>
              <Link to={`category/${category}`}>{category}</Link> ( {totalCount}{" "}
              )
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
