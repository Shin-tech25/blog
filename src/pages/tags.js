import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { FaSearch } from "react-icons/fa";
import kebabCase from "lodash/kebabCase";
import * as styles from "../styles/tags.module.css";

const AllTagsPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const allTags = data.allMarkdownRemark.group;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All tags" />
      <div className={styles.tagsPage}>
        <h1><FaSearch className={styles.tagIcon} /> All tags</h1>
        <ul className={styles.tagList}>
          {allTags.map(tag => (
            <li key={tag.fieldValue} className={styles.tagItem}>
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                {tag.fieldValue} <span>({tag.totalCount} posts)</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default AllTagsPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;