import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon,
} from "react-share"
import Layout from "../components/layout"
import Seo from "../components/seo"
import TableOfContents from "../components/toc"
import RelatedPosts from "../components/related-posts"
import * as styles from "../styles/blog-post.module.css"

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post, relatedPosts },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const shareUrl = location.href
  const fm = post.frontmatter
  const thumbImage =
    getImage(fm?.featuredImage?.childImageSharp?.gatsbyImageData) || null

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className={styles.blogPost}
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <div className={styles.titleRow}>
            {/* サムネイル（ある時だけ表示） */}
            {thumbImage ? (
              <GatsbyImage
                image={thumbImage}
                alt={`${fm.title} thumbnail`}
                className={styles.titleThumb}
                imgClassName={styles.titleThumbImg}
              />
            ) : fm?.thumbnail?.publicURL ? (
              <img
                src={fm.thumbnail.publicURL}
                alt={`${fm.title} thumbnail`}
                className={styles.titleThumb}
                width="96"
                height="96"
                loading="eager"
                decoding="async"
              />
            ) : null}
            <h1 className={styles.title} itemProp="headline">
              {fm.title}
            </h1>
          </div>
          <div className={styles.socialLinks}>
            <FacebookShareButton url={shareUrl}>
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={post.frontmatter.title}>
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl}>
              <LinkedinIcon size={32} round={true} />
            </LinkedinShareButton>
            <RedditShareButton url={shareUrl} title={post.frontmatter.title}>
              <RedditIcon size={32} round={true} />
            </RedditShareButton>
          </div>
          <small className={styles.date}>{post.frontmatter.date}</small>
          <div className={styles.tagWrapper}>
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <ul className={styles.tagList}>
                {post.frontmatter.tags.map((tag, index) => (
                  <li key={index} className={styles.tagItem}>
                    <Link to={`/tags/${kebabCase(tag)}/`} itemProp="url">
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>
        <TableOfContents tableOfContents={post.tableOfContents} />
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <RelatedPosts relatedPosts={relatedPosts} />
      </article>
      <nav className={styles.blogPostNav}>
        <ul>
          <li>
            {next && (
              <Link to={`/blog${next.fields.slug}`} rel="next">
                (←) {next.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {previous && (
              <Link to={`/blog${previous.fields.slug}`} rel="prev">
                {previous.frontmatter.title} (→)
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
    $relatedPosts: [String]
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      tableOfContents
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        description
        tags
        featuredImage {
          publicURL
          childImageSharp {
            gatsbyImageData(
              width: 96
              height: 96
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
    relatedPosts: allMarkdownRemark(
      filter: { fields: { slug: { in: $relatedPosts } } }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date
          tags
          description
          featuredImage {
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED)
            }
          }
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
