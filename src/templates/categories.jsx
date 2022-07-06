import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"

export default ({
  data: {
    allMarkdownRemark: { totalCount, edges: blogs },
  },
}) => {
  return (
    <Layout>
      {blogs.map(
        ({
          node: {
            id,
            html,
            frontmatter: { title },
            fields: { slug },
          },
        }) => (
          <div key={id}>
            <h2>
              <Link to={slug}>{title}</Link>
            </h2>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            <hr />
          </div>
        )
      )}
    </Layout>
  )
}

export const pageQuery = graphql`
  query($category: String!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { categories: { in: [$category] } } }
    ) {
      totalCount
      edges {
        node {
          id
          html
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
