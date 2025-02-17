import React from "react"
import { Link } from "gatsby"

const RelatedPosts = ({ relatedPosts }) => {
  console.log("Debug: relatedPosts =", relatedPosts)
  if (!relatedPosts || !Array.isArray(relatedPosts.nodes)) {
    console.error("Error: relatedPosts.nodes is not an array", relatedPosts)
    return null
  }

  if (relatedPosts.nodes.length === 0) {
    return null
  }

  return (
    <div className="related-posts">
      <h3>関連記事</h3>
      <ul>
        {relatedPosts.nodes.map(post => (
          <li key={post.fields.slug}>
            <Link to={`/blog/${post.fields.slug}`}>
              {post.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RelatedPosts
