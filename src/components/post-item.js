import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import kebabCase from "lodash/kebabCase"
import * as styles from "../styles/post-item.module.css"

const PostItem = ({ post }) => {
  const image = post.featuredImage ? getImage(post.featuredImage) : null

  return (
    <div className={styles.postItem}>
      {image ? (
        <GatsbyImage
          image={image}
          alt={post.title}
          className={styles.postThumbnail}
        />
      ) : (
        <div className={styles.noImageBox}>
          <span className={styles.noImageText}>No Image</span>
        </div>
      )}
      <div className={styles.postContent}>
        <h3 className={styles.postTitle}>
          <Link to={`/blog${post.slug}`}>{post.title}</Link>
        </h3>
        <small className={styles.postDate}>{post.date}</small>
        {post.tags && post.tags.length > 0 && (
          <ul className={styles.tagList}>
            {post.tags.map((tag, index) => (
              <li key={index} className={styles.tagItem}>
                <Link to={`/tags/${kebabCase(tag)}/`} itemProp="url">
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className={styles.postDescription}>{post.description}</p>
      </div>
    </div>
  )
}

export default PostItem
