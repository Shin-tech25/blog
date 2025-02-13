import React from "react";
import { Link, graphql } from "gatsby";
import kebabCase from "lodash/kebabCase";

import Layout from "../components/layout";
import Seo from "../components/seo";
import { FaSearch } from "react-icons/fa";
import * as styles from "../styles/tag-search.module.css";

const Tags = ({ data, pageContext, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const { totalCount } = data.allMarkdownRemark;
  const posts = data.allMarkdownRemark.nodes;
  const { tag } = pageContext;

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={`tag: ${tag} (0 post)`} />
        <p>該当するタグの投稿記事がありません。</p>
      </Layout>
    );
  }

  const tagHeader = (
    <span className={styles.tagHeader}>
      <FaSearch className={styles.tagIcon} /> tag: {tag} ({totalCount} posts)
    </span>
  );

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={`tag: ${tag} | ${siteTitle}`} />
      <h1>{tagHeader}</h1>
      <ol className={styles.tagListContainer} style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug;

          return (
            <li key={`blog${post.fields.slug}`}>
              <article
                className={styles.postListItem}
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={`/blog${post.fields.slug}`} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                  <div className={styles.tagArticle}>
                    {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                      <ul className={styles.tagList}>
                        {post.frontmatter.tags.map((tag, index) => (
                          <li key={index} className={styles.tagItem}>
                            <Link to={`/tags/${kebabCase(tag)}/`} itemProp="url">{tag}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
};

export default Tags;

export const pageQuery = graphql`
  query ($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date
          title
          description
          tags
        }
      }
    }
  }
`;