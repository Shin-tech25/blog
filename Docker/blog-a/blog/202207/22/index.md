---
title: "Gatsby＋GitHub Actions+Ansibleで自分メディアを作った"
date: "2022-07-25T10:00:00"
description: "静的サイトジェネレーターのGatsby, CICDパイプラインに使われるGitHub Actionsと基盤プロビジョニングで使われるAnsibleを用いてMarkdownで作るCICDブログを作ったのでこれを解説します。"
slug: gatsby-cicd-markdown-blog
tags:
  - ブログ
  - 静的サイト
  - Gatsby
  - Ansible
  - GitHub Actions
  - Git
keywords: Gatsby, GitHub Actions, GitHub, git, CICD, 静的サイトジェネレーター, 静的サイト, Ansible, Markdown
---

# 背景・動機など

背景としては、Markdown で静的サイトを作ることで簡単に記述し、軽いブログをビルドすることが出来る、ということがあります。

また、CICD パイプラインによって自動ビルド、デプロイを行うことで執筆プロセスの改善を行いました。

なぜ Markdown を選んだかについては別記事で書きましたため、参考にしてください。[なぜ WordPress ではなく Markdown なのか？](/why-blog-by-markdown)

# Gatsby ビルド ~ GitHub Actions まで

Gatsby ビルド ~ GitHub Actions のワークフロー起動までは次の記事にまとめました。

[gatsby build から git push するまでのバッチファイル作成](/blog-tools)

また、GitHub Actions の基礎については次の記事にまとめました。

# GitHub Actions で行われていること

GitHub Actions では、git push を起点にしてワークフローが起動し、GitHub 上の runner で処理が行われます。

ワークフローでは、Ansible の Playbook を実行するようになっていますため、runner から、デプロイ先に Playbook が実行されます。

# Ansible Playbook

`blog-deploy.yml`は以下のようにしました。

```YAML
- name: Deploy Blog
  hosts: shin-tech25.com
  become: true
  gather_facts: true

  tasks:
    - name: /usr/share/nginx/html/をディレクトリごと削除
      file:
        path: /usr/share/nginx/html/
        state: absent

    - name: public/フォルダを/usr/share/nginx/html/に移動
      synchronize:
        src: files/
        dest: /usr/share/nginx/html/
        compress: no
      register: result

    - name: debug(public/フォルダを/usr/share/nginx/html/に移動)
      debug: var=result
```

ポイントとして、Nginx のディレクトリにビルドした public/フォルダをコピーしています。このとき、copy モジュールだと非常に時間がかかるため、上のように synchronize モジュールを使用しました。（オプションには、compress: no を指定します。）
