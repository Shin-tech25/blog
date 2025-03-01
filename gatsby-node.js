const path = require("path")
const fs = require("fs")

const { parse } = require("json2csv")
const { createFilePath } = require("gatsby-source-filesystem")
const kebabCase = require("lodash/kebabCase")

const blogPost = path.resolve("./src/templates/blog-post.js")
const servicePost = path.resolve("./src/templates/service-post.js")
const tagTemplate = path.resolve("./src/templates/tag-search.js")
const blogListTemplate = path.resolve("./src/templates/blog-list.js")

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
          totalCount
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

  // タグ検索ページのページネーション
  const tags = result.data.tagsGroup.group
  tags.forEach(tag => {
    const numTagPages = Math.ceil(tag.totalCount / postsPerPage)
    const tagSlug = `/tags/${kebabCase(tag.fieldValue)}`

    Array.from({ length: numTagPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? tagSlug : `${tagSlug}/page/${i + 1}`,
        component: tagTemplate,
        context: {
          tag: tag.fieldValue,
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages: numTagPages,
          currentPage: i + 1,
        },
      })
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
    
    type PopularArticlesYaml implements Node {
      slug: String
    }
  `)
}

exports.onPostBuild = async ({ graphql }) => {
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }) {
        nodes {
          frontmatter {
            templateKey
            title
            date
            description
            tags
            featuredImage {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED)
              }
            }
          }
          fields {
            slug
          }
          excerpt(pruneLength: 2000)
          rawMarkdownBody
        }
      }
    }
  `)

  if (result.errors) {
    console.error("Error:", result.errors)
    return
  }

  const posts = result.data.allMarkdownRemark.nodes
  const blogPosts = posts.filter(
    post => post.frontmatter.templateKey === "blog-post"
  )

  // 1. 検索用インデックスデータを生成
  const searchData = blogPosts.map(post => ({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    tags: post.frontmatter.tags || [],
    date: post.frontmatter.date,
    featuredImage: post.frontmatter.featuredImage,
    slug: post.fields.slug,
    body: post.excerpt,
  }))

  fs.writeFileSync(
    path.join(__dirname, "public", "search-index.json"),
    JSON.stringify(searchData, null, 2)
  )
  console.log("Search index written to /public/search-index.json")

  // 2. CSV データ生成
  const csvData = blogPosts.map((post, index) => ({
    number: index + 1,
    title: post.frontmatter.title,
    date: post.frontmatter.date,
    slug: post.fields.slug,
    tags: post.frontmatter.tags ? post.frontmatter.tags.join(", ") : "", // カンマ区切り
  }))

  // CSV 変換
  const csv = parse(csvData, {
    fields: ["number", "title", "date", "slug", "tags"],
  })

  // UTF-8 BOM 付きで出力
  fs.writeFileSync(
    path.join(__dirname, "public", "posts.csv"),
    "\uFEFF" + csv,
    "utf8"
  )

  console.log("CSV file generated at /public/posts.csv")
}
