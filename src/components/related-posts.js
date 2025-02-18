import React from "react"
import * as styles from "../styles/related-posts.module.css"
import PostItem from "./post-item"

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
        {relatedPosts.nodes.map(post => (
          <PostItem
            key={post.fields.slug}
            post={{
              slug: post.fields.slug,
              title: post.frontmatter.title,
              date: post.frontmatter.date,
              tags: post.frontmatter.tags,
              description: post.frontmatter.description,
              featuredImage: post.frontmatter.featuredImage,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedPosts
