---
templateKey: blog-post
title: "iPhone動画ファイルのファイル名変更と形式変換方法"
date: "2024-06-06"
description: "iPhoneで撮影した動画ファイルのファイル名を撮影日時に基づいて変更し、形式をMOVからMP4に変換する方法を詳しく説明します。"
tags: ["Linux", "ffmpeg", "xargs", "ライフハック"]
featuredImage: ../thumbnails/pc-desk.jpg
---

iPhone で撮影した動画は通常、「.MOV」または「.mov」という拡張子で保存されています。この拡張子は Apple の QuickTime フォーマットを示します。ここでは、動画ファイルのファイル名を撮影日時に基づいて変更する方法と、ファイル形式を MOV から MP4 に変換する方法を説明します。

## ファイル名の変換

まず、動画ファイル名に撮影日時のタイムスタンプを追加します。以下の手順に従ってください。

**動画のメタデータを取得**

ファイル名に動画のタイムスタンプを追加するために、ffprobe を用いて動画のメタデータを取得します。

```bash
$ ffprobe filename

Metadata:
    major_brand     : qt
    minor_version   : 0
    compatible_brands: qt
    creation_time   : 2023-11-23T05:27:30.000000Z
    com.apple.quicktime.make: Apple
    com.apple.quicktime.model: iPhone SE (2nd generation)
    com.apple.quicktime.software: 16.6
    com.apple.quicktime.creationdate: 2023-09-12T12:17:33+0900
```

撮影日の情報は、`com.apple.quicktime.creationdate`の値で分かります。この情報だけを`grep`コマンドを用いて抽出します。

```bash
$ ffprobe filename 2>&1 | grep -i com.apple.quicktime.creationdate
```

**ファイル名の命名規則**

ファイル名の命名規則は次のようにします。

```
yyyy-mm-dd_HH-MM-SS.mov
```

同一階層にある MOV ファイルを撮影日でファイル名を一括変更するスクリプトを以下に示します。

スクリプトファイル（`rename.sh`）

```bash
#!/bin/bash

# ファイル名の変更処理をループで実行
for file in *.MOV; do
    # ffprobeコマンドでcreationdateを取得し、日付情報のみを抽出
    creation_date=$(ffprobe "$file" 2>&1 | grep -i com.apple.quicktime.creationdate | cut -d ':' -f 2- | sed 's/^[ \t]*//;s/[ \t]*$//' | cut -d ' ' -f 2)

    # 日付情報を所望の形式に変換
    formatted_date=$(date -d "$creation_date" +"%Y-%m-%d_%H-%M-%S")

    # 新しいファイル名を生成
    new_filename="${formatted_date}.mov"

    # 新しいファイル名で保存
    mv "$file" "$new_filename"
done
```

日付は上記の`ffprobe`コマンドからメタデータから取得します。

### mov を mp4 に変換

MOV 形式のファイルを MP4 形式に変換するスクリプトを紹介します。

スクリプトファイル（`mov2mp4.sh`）

```bash
#!/bin/bash

process() {
        local mov="$1"
        local mp4=$(basename "$mov" .mov).mp4
        echo Processing "$mov ..."
        ffmpeg -i "$mov" -vcodec h264 -acodec mp2 "$mp4"
        echo "Waiting to delete the original file: $mov"
        sleep 5
        rm -f "$mov"
        echo Remaining MOV count = $(find . -name "*.mov" | wc -l)
        echo "OK!"
        sleep 5
}

export -f process

find . -name "*.mov" -type f -exec bash -c 'process "{}"' \;
```

上記スクリプトでエンコードされ、ファイル拡張子も`.mov`から`.mp4`に自動的に変換されます。

また、`xargs`はオプションで並列実行することが可能です。`xargs`コマンドを用いてマルチプロセスで`ffmpeg`を実行し時短することに成功しました。以下がそのスクリプトです。

`mov2mp4.sh`

```bash
#!/bin/bash

process() {
        local mov="$1"
        local mp4=$(basename "$mov" .mov).mp4
        echo Processing "$mov ..."
        ffmpeg -i "$mov" -vcodec h264 -acodec mp2 "$mp4"
        echo "Waiting to delete the original file: $mov"
        sleep 5
        rm -f "$mov"
        echo Remaining MOV count = $(find . -name "*.mov" | wc -l)
        echo "OK!"
        sleep 5
}

export -f process

find . -name "*.mov" -type f | xargs -P 6 -I {} bash -c 'process "{}"';
```

このスクリプトでは、`xargs`を使用して並列処理を行い、効率的に MOV ファイルを MP4 に変換します。

このように、iPhone で撮影した動画ファイルのファイル名を撮影日時に基づいて変更し、形式を MOV から MP4 に変換する方法をご紹介しました。ぜひ、これらのスクリプトを活用して、動画ファイルの管理をより簡単にしてください。

## 参考文献

- [FFmpeg による動画ファイル分析入門](https://weblabo.oscasierra.net/ffmpeg-video-analizing/)
- [Batch Script to Convert MOV Videos to MP4/MPEG using ffmpeg](https://helloacm.com/batch-script-to-convert-mov-videos-to-mpg-using-ffmpeg/)
- [UNIX/Linux の部屋 local コマンドの使い方](http://x68000.q-e-d.net/~68user/unix/pickup?local)
- [find と xargs の基本的な使い方 -- ぺけみさお](https://www.xmisao.com/2013/09/01/how-to-use-find-and-xargs.html)
