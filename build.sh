#!/bin/bash
# Builds a standalone index.html from the files in src/
cd "$(dirname "$0")"
{
cat <<'HEAD'
<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>کیف‌آرا | فروشگاه کیف</title>
<meta name="theme-color" content="#0e0c0a">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lalezar&family=Vazirmatn:wght@300;400;500;600;700;800&display=swap">
<style>html{color-scheme:dark}body{margin:0}
HEAD
cat src/style.css
cat <<'MID'
</style>
</head>
<body>
<div class="ambient" aria-hidden="true"><i></i><i></i><i></i></div>
<header class="hd" id="hd"></header>
<main class="app" id="app"><div class="skel">در حال بارگذاری…</div></main>
<nav class="nv" id="nv" aria-label="ناوبری اصلی"></nav>
<script>
MID
cat src/data.js src/app.js src/admin.js
echo 'boot();'
echo '</script>'
echo '</body>'
echo '</html>'
} > index.html
echo "index.html ready ($(wc -c < index.html) bytes)"
