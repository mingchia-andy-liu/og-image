# Open Graph Image as a Service

### What

⚠️ THIS IS A FORK OF VERCEL'S [OG-IMAGE](https://github.com/vercel/og-image) REPOSITORY ⚠️

[Check out my deployment](https://og.aliu.dev)

It is a Serverless service that generates dynamic Open Graph images that you can embed in your `<meta>` tags.

### Why

I need a way to quickly generate open graph image for [my blogs](https://blog.aliu.dev). 

I also need some other features that are only for me. 

* [x] Remove backtick for `code` blocks
* [x] Randomize emoji in the background 🙂
* [x] Confetties 🎊
* [x] Refresh on same setting

### What is an Open Graph Image?

Have you ever posted a hyperlink to Twitter, Facebook, or Slack and seen an image popup?
How did your social network know how to "unfurl" the URL and get an image?
The answer is in your `<head>`.

The [Open Graph protocol](http://ogp.me) says you can put a `<meta>` tag in the `<head>` of a webpage to define this image.

It looks like the following:

```html
<head>
  <title>Title</title>
  <meta property="og:image" content="http://example.com/logo.jpg" />
</head>
```

