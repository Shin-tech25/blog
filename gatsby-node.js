const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")
const kebabCase = require("lodash/kebabCase")

const blogPost = path.resolve(`./src/templates/blog-post.js`)
const servicePost = path.resolve(`./src/templates/service-post.js`)
const tagTemplate = path.resolve(`./src/templates/tag-search.js`)
const blogListTemplate = path.resolve(`./src/templates/blog-list.js`) // 新しいテンプレートを追加

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            templateKey
            tags
            relatedPosts
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes
  const blogPosts = posts.filter(
    post => post.frontmatter.templateKey === "blog-post"
  )

  // ページネーション用の設定
  const postsPerPage = 10
  const numPages = Math.ceil(blogPosts.length / postsPerPage)

  // 最初のページ（"/"）も blog-list.js を使用して作成
  createPage({
    path: `/`, // ルートにアクセスされた際に表示
    component: blogListTemplate, // blog-list.js を利用
    context: {
      limit: postsPerPage,
      skip: 0, // 最初のページは skip: 0
      numPages,
      currentPage: 1,
    },
  })

  Array.from({ length: numPages }).forEach((_, index) => {
    createPage({
      path: index === 0 ? `/` : `/page/${index + 1}/`,
      component: blogListTemplate, // blog-list.js を使う
      context: {
        limit: postsPerPage,
        skip: index * postsPerPage,
        numPages,
        currentPage: index + 1,
      },
    })
  })

  // ブログ投稿ページの作成
  blogPosts.forEach((post, index) => {
    const previousPostId = index === 0 ? null : blogPosts[index - 1].id
    const nextPostId =
      index === blogPosts.length - 1 ? null : blogPosts[index + 1].id

    createPage({
      path: `/blog${post.fields.slug}`,
      component: blogPost,
      context: {
        id: post.id,
        previousPostId,
        nextPostId,
        relatedPosts: post.frontmatter.relatedPosts
          ? post.frontmatter.relatedPosts.map(
              slug => `/${slug.replace(/^\/|\/$/g, "")}/`
            )
          : [], // `/` の有無を統一
      },
    })
  })

  const servicePosts = posts.filter(
    post => post.frontmatter.templateKey === "service-post"
  )

  if (servicePosts.length > 0) {
    servicePosts.forEach(post => {
      createPage({
        path: `/service${post.fields.slug}`,
        component: servicePost,
        context: {
          id: post.id,
        },
      })
    })
  }

  const tags = result.data.tagsGroup.group

  tags.forEach(tag => {
    createPage({
      path: `/tags/${kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      node,
      name: `slug`,
      value: value,
    })
    createNodeField({
      node,
      name: "tableOfContents",
      value: node.tableOfContents || {},
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      templateKey: String!
      tags: [String!]
      relatedPosts: [String]
    }

    type Fields {
      slug: String
    }
  `)
}
