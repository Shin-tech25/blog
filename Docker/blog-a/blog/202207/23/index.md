---
title: "GitHub Actionsの基礎"
date: "2022-07-25T23:00:00"
description: "GitHub Actionsの基礎について。"
slug: github-actions-basic
tags:
  - GitHub Actions
  - git
  - CICD
keywords: GitHub Actions, git, CICD
---

このページでは、GitHub Actions の基礎について解説します。

# GitHub Actions の概要

GitHub が 2019 年 11 月に正式公開した新機能が GitHub Actions です。GitHub 上のリポジトリやイシューに対する様々な操作をトリガーとしてあらかじめ定義しておいた処理を実行することができる機能で、今まで外部サービスとの連携が必要だった自動テストや自動ビルドなどが GitHub だけで実現できるようになりました。他の CI/CD ツールと同様、リポジトリに対するプッシュやプルリクエストといった操作、もしくは指定した時刻になるといったイベントをトリガーとして、あらかじめ定義しておいた処理を実行する機能です。これらの処理は、GitHub が提供するサーバ上に用意された仮想マシン内で実行できるため、ユーザーが独自にサーバなどを準備する必要がない点がメリットです。

# CI/CD について

CI(Continuous Integration、継続的インテグレーション)、CD(Continuous Delivery、継続的デリバリー)です。

CI はソフトウェアのビルドやテストを自動化して頻繁に実行することでソフトウェアの品質向上や開発効率化を目指す手法で、CD は CI に加えてリリースやデプロイまでも自動化する手法です。

# ワークフローを配置する場所

git で管理するルートディレクトリに`.github/workflows/xxxx.yml`を配置します。push してリモートリポジトリに上げるだけで、自動で処理が実行される仕組みです。

# 例

以下にワークフローの例を示します。

```YAML
name: ansible-playbook
on:
  push:
    branches:
      - master
    paths:
      - 'Ansible/**'
      - '.github/workflows/ansible-playbook.yml'
jobs:
  ansible-playbook:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run ansible playbook
      env:
        PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
      run: |
        mkdir -p ~/.ssh
        echo "$PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
        chmod 700 ~/.ssh/id_rsa
        eval $(ssh-agent -s)
        ssh-add ~/.ssh/id_rsa
        ssh-keyscan -p 22 -H XXX.XXX.XXX.XXX >> ~/.ssh/known_hosts  # Blog
        cd Ansible/
        ansible-playbook -i inventory/hosts.yml playbooks/site.yml --private-key ~/.ssh/id_rsa
```

# 大きく 2 つの枠組み~条件とジョブ

`on:`から始まるブロックが、条件を表します。`jobs:`から始まるブロックが、ジョブを表します。

# 条件の書き方

`push:`は git push を起点にして、ワークフローが起動することを表しています。
`branches:`はどのブランチかを指定することができます。ここに`master`ブランチを記述することで、他のブランチで`push`されてもワークフローが起動しないようにすることが出来ます。この場合は、master ブランチでの直接の push か、プルリクエストによりマージコミットが追加されたタイミングでワークフローが起動します。

`paths:`は変更があったフォルダの場所を指定することで、その他のフォルダに変更が加わった場合にワークフローが起動しないようにすることができます。

# ジョブの書き方

`ansible-playbook:`はジョブ名を表します、ここは任意です。一つのジョブの塊を表します。

`runs-on:`で、処理を実行する環境（＝コンテナ）を指定します。このコンテナは GitHub 上の runner で、使い捨てのコンテナです。

`steps:`で以下にステップを記述します。

`- uses:`で既存に定義されているアクションを実行することもできます。

`- name:`以下で、任意の名前のステップの一つの塊を表します。

# 参考

- [Actions | GitHub](https://github.co.jp/features/actions)
- [GitHub Actions のドキュメント](https://docs.github.com/ja/actions)
- [GitHub の新機能 GitHub Actions で試す CI/CD](https://knowledge.sakura.ad.jp/23478/)
