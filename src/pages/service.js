import * as React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import * as styles from "../styles/service.module.css"

const ServicesPage = ({ data, location }) => {
  const services = data.allMarkdownRemark.nodes

  if (services.length === 0) {
    return (
      <Layout location={location}>
        <p>
          No service posts found. Add markdown posts to "content/service" (or
          the directory you specified for the "gatsby-source-filesystem" plugin
          in gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location}>
      <Seo title="Services" />
      <div className={styles.serviceList}>
        {services.map(service => {
          const title = service.frontmatter.title || service.fields.slug
          const image = getImage(service.frontmatter.featuredImage)

          return (
            <div key={service.fields.slug} className={styles.serviceItem}>
              {image && (
                <GatsbyImage
                  image={image}
                  alt={service.frontmatter.title}
                  className={styles.serviceImage}
                />
              )}
              <div className={styles.serviceContent}>
                <h2 className={styles.serviceTitle}>
                  <Link to={`/service${service.fields.slug}`} itemProp="url">
                    <span itemProp="headline">{title}</span>
                  </Link>
                </h2>
                <p className={styles.serviceDescription}>
                  {service.frontmatter.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export default ServicesPage

export const Head = () => <Seo title="Services" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "service-post" } } }
      sort: { frontmatter: { num: ASC } }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          description
          featuredImage {
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED)
            }
          }
        }
      }
    }
  }
`
