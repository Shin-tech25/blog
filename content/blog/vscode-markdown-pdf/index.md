---
templateKey: blog-post
title: "VSCodeでMarkdownからPDF出力を行う：設定とスタイル調整のコツ"
date: "2025-03-11"
description: "本記事では、Markdown文書をVSCodeのMarkdown PDFプラグインを用いて効率的にPDFに変換する方法を解説します。ヘッダー・フッターのカスタマイズやカスタムCSSによるスタイル調整の実践例を通して、再利用しやすい標準プロセスを紹介します。"
tags:
  - "Markdown"
  - "VSCode"
featuredImage: ../../thumbnails/visual-studio-code-icon.png
---

本記事では、Markdown 形式で文章を作成し、VSCode の Markdown PDF プラグインを用いて PDF に変換する方法について、実践的な設定やスタイル調整の工夫を解説します。これらの手法は、今後のプロジェクトで再利用しやすい標準プロセスとしてまとめています。

## 1. Markdown でレポートを執筆する理由

Markdown は、シンプルで直感的な記法を採用しているため、誰でもすぐに習得できる点が大きな魅力です。複雑なタグや余計な記述を必要としないため、文書作成に専念できる点はもちろん、テキストファイルとして管理できるため、Git などのバージョン管理ツールを使って変更履歴を追いやすく、複数人での共同編集にも適しています。また、Markdown は HTML、PDF、Word など多様な形式に変換可能であり、用途に応じた柔軟な文書作成が実現できることから、効率的な編集環境を求める現場に最適な手法といえるでしょう。

## 2. VSCode Markdown PDF プラグインについて

VSCode の Markdown PDF プラグインは、Markdown ファイルを直接 PDF に変換できる拡張機能です。ユーザーは設定ファイルを通じて、ヘッダーやフッターのテンプレートを自由にカスタマイズでき、日付やページ番号を自動的に挿入することが可能です。さらに、独自の CSS を指定することで、マージンやフォント、背景色などのスタイルを細かく調整でき、出力する PDF のレイアウトをプロジェクトの要件に合わせて自由に設計することができます。コードブロックのシンタックスハイライトの表示制御も可能なため、シンプルなデザインに仕上げたい場合にも柔軟に対応できるのが魅力です。

## 3. 参考リンク

プラグインの詳細や設定方法については、公式の情報源を参照することをお勧めします。VSCode Marketplace では「Markdown PDF」の概要が確認でき、GitHub のリポジトリでは実際のサンプル設定やコード例が公開されています。これらの情報は、導入やカスタマイズの際に非常に有用です。

- [Markdown PDF - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf) citeturn0file0
- [vscode-markdown-pdf on GitHub](https://github.com/yzane/vscode-markdown-pdf) citeturn0file0

## 4. settings.json と custom.css の例

実際のプロジェクトでは、VSCode のワークスペースに以下のような設定ファイルを用意し、PDF 出力時のスタイルを調整しています。たとえば、`settings.json`では、ヘッダー・フッターのテンプレート、余白の設定、シンタックスハイライトの制御、そしてカスタム CSS ファイルの指定が行われています。

### settings.json の例

```json
{
  "markdown-pdf.displayHeaderFooter": true,
  "markdown-pdf.headerTemplate": "<div style='width:100%; text-align:right; font-size:10px; margin-right: 40px'><span class='date'></span></div>",
  "markdown-pdf.footerTemplate": "<div style='width:100%; text-align:center; font-size: 10px;'><span class='pageNumber'></span> / <span class='totalPages'></span></div>",
  "markdown-pdf.margin.top": "20mm",
  "markdown-pdf.margin.bottom": "20mm",
  "markdown-pdf.highlight": false, // シンタックスハイライトを無効にする
  "markdown-pdf.styles": ["./doc/custom.css"]
}
```

この設定により、PDF 出力時には各ページの上部と下部に自動で日付やページ番号が挿入され、指定された余白が適用されます。また、別途用意した CSS ファイルによって、独自のデザインが反映されるため、ドキュメント全体のレイアウトが整います。

次に、`custom.css`では、コードブロック、画像、見出しなどのスタイルが詳細に定義されています。ここでは、コード部分は背景色と文字色が調整され、画像は適切な幅と中央寄せで表示されるようになっています。さらに、見出しにはボーダーや疑似要素を利用して視覚的なアクセントが施され、全体として統一感のあるデザインに仕上がっています。

### custom.css の例

```css
pre,
code {
  background-color: #f5f5f5 !important;
  color: #333 !important;
  font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace !important;
  padding: 4px 0px !important;
}

img {
  width: 80%;
  margin-left: 10%;
}

h1 {
  padding-bottom: 0.3em;
  line-height: 1.2;
  border-bottom: 2px solid #333;
  position: relative;
  padding-left: 18px;
}

h1:before {
  background: #333;
  content: "";
  height: 28px;
  width: 8px;
  left: 0;
  position: absolute;
  top: 3px;
}

h2 {
  padding-bottom: 0.3em;
  line-height: 1.2;
  position: relative;
  padding-left: 18px;
}

h2:before {
  background: #333;
  content: "";
  height: 20px;
  width: 5px;
  left: 0px;
  position: absolute;
  top: 3px;
}

h3 {
  text-decoration: underline;
}

a {
  color: black;
}
```

このような CSS 設定によって、各要素が見やすく、かつ統一感のあるデザインで出力されるよう工夫されています。

## 5. まとめ

Markdown を用いた文書作成と VSCode Markdown PDF プラグインによる PDF 変換は、非常に効率的で柔軟な手法です。シンプルな記法で誰でも簡単に文書を作成できる一方、設定ファイルやカスタム CSS を活用することで、プロジェクトごとに求められるデザインやレイアウトに自由に対応できます。また、テキストベースのため Git などでの管理が容易であり、チーム全体での文書標準化にも大きく寄与します。

本記事で紹介した設定例とスタイル調整の工夫を参考に、日々のドキュメント作成や資料の品質向上にぜひお役立てください。
