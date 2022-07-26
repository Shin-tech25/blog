module.exports = {
  siteMetadata: {
    title: `Shin-tech25's blog`,
    author: `Shin-tech25`,
    description: `Engineering Blog`,
    siteUrl: `https://Shin-tech25.netlify.app/`,
    social: {
      twitter: `Shin-tech25`,
      github: `Shin-tech25`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-QWHR9EN0JS"],
        pluginConfig: {
          head: true
        }
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
        name: `images`,
      },
    },
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: ["/tags/*"],
      },
    },
    `gatsby-plugin-slug`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://Shin-tech25.netlify.app/`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-katex`,
            options: [
              {
                resolve: `gatsby-remark-katex`,
                options: {
                  strict: `ignore`
                }
              }
            ]
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: 0,
              icon: false,
              maintainCase: false,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
          {
            resolve: "gatsby-remark-embed-youtube",
            options: {
              width: 800,
              height: 400
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-emojis`,
            options: {
              active: true,
              class: "emoji-icon",
              size: 64,
              styles: {
                display: "inline",
                margin: "0",
                "margin-top": "0px",
                "margin-right": "3px",
                "margin-left": "3px",
                position: "relative",
                top: "5px",
                width: "20px",
              },
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "noopener",
            },
          },
          {
            resolve: `gatsby-plugin-disqus`,
            options: {
              shortname: `shin-tech25`,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-plugin-catch-links`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-147345327-1",
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url:
                    site.siteMetadata.siteUrl +
                    `/${edge.node.frontmatter.slug}/`,
                  guid:
                    site.siteMetadata.siteUrl +
                    `/${edge.node.frontmatter.slug}/`,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
            {
              allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] },
              ) {
                edges {
                  node {
                    excerpt
                    html
                    fields { slug }
                    frontmatter {
                      title
                      date
                      slug
                    }
                  }
                }
              }
            }
          `,
            output: "/rss.xml",
            title: "Shin-tech25's RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Shin-tech25's blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `${__dirname}/src/images/icon.png`,
      },
    },
    `gatsby-plugin-offline`,
  ],
}
