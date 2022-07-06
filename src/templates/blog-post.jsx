import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({
  data: {
    markdownRemark: {
      html,
      frontmatter: { title, categories },
    },
  },
}) => {
  return (
    <Layout>
      <h1>{title}</h1>
      <>
        <strong>カテゴリー : </strong>
        {categories.length ? categories.join(", ") : "なし"}
      </>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        categories
      }
    }
  }
`
