const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode, basePath: "pages" })
    createNodeField({
      node,
      name: "slug",
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
      categoriesAllMarkdownRemark: allMarkdownRemark {
        group(field: frontmatter___categories) {
          category: fieldValue
        }
      }
    }
  `)
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve("./src/templates/blog-post.jsx"),
      context: {
        // GraphQLのクエリの $slug 変数に設定する値
        slug: node.fields.slug,
      },
    })
  })
  result.data.categoriesAllMarkdownRemark.group.forEach(({ category }) => {
    createPage({
      path: `/category/${category}/`,
      component: path.resolve("./src/templates/categories.jsx"),
      context: {
        // GraphQLのクエリの $category 変数に設定する値
        category,
      },
    })
  })
}
