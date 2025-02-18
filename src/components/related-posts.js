import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import kebabCase from "lodash/kebabCase"
import * as styles from "../styles/related-posts.module.css"

const RelatedPosts = ({ relatedPosts }) => {
  if (!relatedPosts || !Array.isArray(relatedPosts.nodes)) {
    console.error("Error: relatedPosts.nodes is not an array", relatedPosts)
    return null
  }

  if (relatedPosts.nodes.length === 0) {
    return null
  }

  return (
    <div className={styles.relatedPostsWrapper}>
      <h2 className={styles.relatedPostsTitle}>関連記事</h2>
      <div className={styles.postList}>
        {relatedPosts.nodes.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const image = post.frontmatter.featuredImage
            ? getImage(post.frontmatter.featuredImage)
            : null

          return (
            <div key={post.fields.slug} className={styles.postItem}>
              {image ? (
                <GatsbyImage
                  image={image}
                  alt={post.frontmatter.title}
                  className={styles.postThumbnail}
                />
              ) : (
                <div className={styles.noImageBox}>
                  <span className={styles.noImageText}>No Image</span>
                </div>
              )}
              <div className={styles.postContent}>
                <h4 className={styles.postTitle}>
                  <Link to={`/blog${post.fields.slug}`}>{title}</Link>
                </h4>
                <small className={styles.postDate}>
                  {post.frontmatter.date}
                </small>
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <ul className={styles.tagList}>
                    {post.frontmatter.tags.map((tag, index) => (
                      <li key={index} className={styles.tagItem}>
                        <Link
                          to={`/tags/${kebabCase(tag.fieldValue)}/`}
                          itemProp="url"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <p className={styles.postDescription}>
                  {post.frontmatter.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RelatedPosts
