import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { StaticImage } from "gatsby-plugin-image"
import { FaLinkedin, FaGithub } from "react-icons/fa"
import * as styles from "../styles/about.module.css"

const AboutPage = ({ location }) => {
  return (
    <Layout location={location}>
      <Seo title="About" />
      <div className={styles.container}>
        <div className={styles.profileContainer}>
          <div className={styles.profile}>
            <StaticImage
              src="../images/profile-pic.png"
              alt="Profile"
              className={styles.profileImage}
              placeholder="blurred"
              layout="fixed"
              width={150}
              height={150}
            />
            <h1 className={styles.name}>Shin Mikami</h1>
            <p className={styles.title}>
              Azure HPC+AI SEE@Microsoft Japan Ltd.
            </p>
            <div className={styles.socials}>
              <a
                href="https://www.linkedin.com/in/mshin0509/"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://github.com/Shin-tech25/"
                aria-label="GitHub Profile"
              >
                <FaGithub />
              </a>
            </div>
          </div>
          <div className={styles.profileText}>
            <p>
              Engaged in migration, architecture design, and construction of
              enterprise infrastructure environments. Currently involved in
              building scientific computing platforms for universities and
              enterprises in the HPC/AI industry, as well as developing in-house
              services.
            </p>
            <p>
              Strong expertise in modern infrastructure technologies such as
              Ansible, Terraform, Docker, Kubernetes, and CI/CD pipelines, along
              with experience in building computing resources like GPU clusters.
            </p>
            <p>
              Acquired the
              <a
                href="https://www.pmi.org/certifications/project-management-pmp"
                target="_blank"
                rel="noreferrer"
              >
                PMP®
              </a>
              certification to demonstrate project management capabilities.
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <h2>Career</h2>
          <ul className={styles.career}>
            <li>
              2025/8 - Now*: Microsoft Japan Ltd.
              <p>
                Technical expert handling critical issues in High Performance
                Computing support
              </p>
            </li>
            <li>
              2022/11 - 2025/7: Prometech Software Inc.
              <p>
                Built scientific computing infrastructure for universities and
                enterprises in the HPC/AI domain, and developed in-house
                services.
              </p>
            </li>
            <li>
              2020/4 - 2022/10: SHIFT Inc.
              <p>
                Provided consulting services for financial institutions,
                enterprises, and manufacturers, including architecture design,
                proposal, and implementation of IT infrastructure.
              </p>
            </li>
          </ul>
          <h2>Skills</h2>
          <div className={styles.skills}>
            <span className={styles.skillTag}>
              Project Management (3 years)
            </span>
            <span className={styles.skillTag}>AWS (3 years)</span>
            <span className={styles.skillTag}>Ansible (3 years)</span>
            <span className={styles.skillTag}>Terraform (3 years)</span>
            <span className={styles.skillTag}>Docker (3 years)</span>
            <span className={styles.skillTag}>Python (3 years)</span>
            <span className={styles.skillTag}>React (2 years)</span>
            <span className={styles.skillTag}>GPU (3 years)</span>
            <span className={styles.skillTag}>Slurm (3 years)</span>
            <span className={styles.skillTag}>Django (2 year)</span>
            <span className={styles.skillTag}>
              Django REST Framework (2 year)
            </span>
            <span className={styles.skillTag}>GraphQL (1 year)</span>
          </div>
          <h2>Certificates & Badges</h2>
          <ul className={styles.certificates}>
            <li>
              <a
                href="https://www.credly.com/badges/c4f3c642-6770-4db0-8bc3-4bbeb4ebd65f/public_url"
                target="_blank"
                rel="noreferrer"
              >
                Project Management Professional (PMP)
              </a>
            </li>
            <li>
              <a
                href="https://www.credly.com/badges/d5158afe-8bff-4907-9834-d0870bd2b8c0/public_url"
                target="_blank"
                rel="noreferrer"
              >
                LPIC-2: Linux Engineer Certification
              </a>
            </li>
            <li>
              <a
                href="https://www.credly.com/badges/ea0eb91e-3d46-47b1-932e-a032eadad4e5/public_url"
                target="_blank"
                rel="noreferrer"
              >
                AWS Certified Solutions Architect – Associate
              </a>
            </li>
            <li>
              <a
                href="https://cbt.odyssey-com.co.jp/pythonic-exam/python3cpe.html"
                target="_blank"
                rel="noreferrer"
              >
                Python 3 Certified Practical Programming Examination
              </a>
            </li>
          </ul>
          <h2>Portfolios</h2>
          <div className={styles.portfolios}>
            <div className={styles.portfolioItem}>
              <div className={styles.portfolioImageContainer}>
                <StaticImage
                  src="../images/coffee-logo.svg"
                  alt="coffee-logo"
                  placeholder="blurred"
                  layout="constrained"
                  objectFit="cover"
                />
              </div>
              <div className={styles.portfolioTextContainer}>
                <a href="https://github.com/Shin-tech25/blog">
                  Shin-tech25/blog
                </a>
                <p>
                  This is the repository for my portfolio site. It is developed
                  using
                  <a href="https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog">
                    gatsby-starter-blog
                  </a>
                  .
                </p>
              </div>
            </div>
            <div className={styles.portfolioItem}>
              <div className={styles.portfolioImageContainer}>
                <StaticImage
                  src="../images/vps-dev.png"
                  alt="vps-dev"
                  placeholder="blurred"
                  layout="constrained"
                  objectFit="cover"
                />
              </div>
              <div className={styles.portfolioTextContainer}>
                <a href="https://github.com/Shin-tech25/self-hosted-lab">
                  Shin-tech25/self-hosted-lab
                </a>
                <p>Development environment on VPS</p>
                <p>
                  Applications such as GROWI Wiki, Redmine, Nextcloud, and
                  JupyterHub are integrated using Keycloak with OpenID Connect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage
