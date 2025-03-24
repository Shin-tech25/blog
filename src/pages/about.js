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
            <p className={styles.title}>HPC/AI/Infrastructure Engineer</p>
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
              エンタープライズ基盤環境のマイグレーション、アーキテクチャ設計、構築などに従事。現在は、HPC/AI業界にて大学や企業向けの科学計算基盤構築や、自社サービスの開発を行う。
            </p>
            <p>
              Ansible、Terraform、Docker、K8s、CI/CDパイプラインなどのモダンインフラ技術に加えて、GPUクラスタなどの計算資源構築が強み。
            </p>
            <p>
              プロジェクトマネジメント力を証明するため、
              <a
                href="https://www.pmi.org/certifications/project-management-pmp"
                target="_blank"
                rel="noreferrer"
              >
                PMP®
              </a>
              資格を取得。
            </p>
          </div>
        </div>
        <div className={styles.content}>
          <h2>Career</h2>
          <ul>
            <li>
              2020/4 - 2022/11: SHIFT Inc.
              <p>
                金融機関、企業、メーカー向けのコンサルティング。基盤環境のアーキテクチャ設計、提案、構築。
              </p>
            </li>
            <li>
              2022/12 - Now*: Prometech Software Inc.
              <p>
                HPC/AI業界にて大学や企業向けの科学計算基盤構築、自社サービス開発など。
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
            <span className={styles.skillTag}>GPU (2 years)</span>
            <span className={styles.skillTag}>Slurm (2 years)</span>
            <span className={styles.skillTag}>Django (1 year)</span>
            <span className={styles.skillTag}>
              Django REST Framework (1 year)
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
                  ポートフォリオサイトのレポジトリです。
                  <a href="https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog">
                    gatsby-starter-blog
                  </a>
                  を用いて開発しています。
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
                <p>VPS上の開発環境</p>
                <p>
                  GROWI
                  Wiki/Redmine/Nextcloud/JupyterHubなどのアプリケーションをKeyCloakのOpenID
                  Connectで連携させています。
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
