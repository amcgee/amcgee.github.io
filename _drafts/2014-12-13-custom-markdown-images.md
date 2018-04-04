---
layout:     post
title:      "Custom image styles in vanilla markdown"
subtitle:   "Everybody has a different 'good side'."
author:     "Austin McGee"
header-img: "img/post-bg-01.jpg"
draft: true
---

*This is my ice-breaker piece - it's intentionally banal to ensure there's plenty of upward mobility potential.*

# The Problem

[Jekyll](http://www.jekyllrb.com) is built to be 'blog aware'.  It's the engine behind [GitHub Pages](http://pages.github.com) and a great option for simple, file-based blog hosting.  I use gh-pages and Jekyll to host this website - all for free, using GitHub as the authentication layer.  There are a few drawbacks to be sure - namely a lack of support for HTTPS, at least when using custom domains, and a minimal whitelist of allowed Jekyll plugins - but all in all it's a huge step forward in static hosting simplicity and availability.

A nice out-of-the-box feature of Jekyll is its built-in markdown parsing support.  If you write your post in markdown (as [this one is](https://github.com/amcgee/amcgee.github.io/blob/master/_posts/2014-12-13-custom-markdown-images.md)), Jekyll renders it to HTML and everything just works.  You can customize how this markdown is rendered by including your own CSS rules, which can be incredibly useful, but there's a catch: since the CSS is (or should be) general enough to be used on every post on your site, it's impossible at the content author level (writing in markdown) to tell Jekyll to render certain images in certain ways.  For instance, you might have 3 images embedded in a post and want one of them to appear on the right of the page, another on the left (each with text continuing immediately adjacent), and a third centered with no text wrapping.

**NOTA BENE (NB)** Since GitHub Pages parses markdown with [Kramdown](http://kramdown.gettalong.org/) by default, you can and should accomplish this just by specifying a [block attribute](http://kramdown.gettalong.org/quickref.html#block-attributes) to assign a class to an image.  i.e. `![Some random image](/img/post-image.jpg "Title text"){: .align-left}`.  That being said, if you use a different markdown parser (i.e. [redcarpet](https://github.com/vmg/redcarpet) which supports github-style ``` fenced code blocks) the process of implementing this within the more restrictive vanilla markdown syntax could still be a useful exercise.

# The Hack

Sometimes "hacking" a contrived solution to an interesting problem can be illustrative and enlightening.  What follows is a simple, 4-line javascript "hack" solution to the described problem - no markdown extensions (a la [Kramdown](http://kramdown.gettalong.org)) or Jekyll plugin required.

Markdown supports an optional image 'title' field: `![<alt>](<src> "<title>")`.  This title in HTML dictates the hover text in the browser.  We're going to use this field to allow customization of image display on an individual image basis.  Here's an example of an image with a "title" specified (assuming you're using a desktop browser, hover your mouse over the image and you'll see a message appear):

`![Some random image](/img/post-image.jpg "Some random image")`

![Some random image](/img/post-image.jpg)

Notice that the title and alt text (used for accessibility when a browser needs, for instance, to audibly read the content of your web page to someone with impaired vision) are the same in this example - this is probably a common scenario.

Instead of duplicating the "Some random image" text, we could use javascript to automatically copy the alt text into the image's 'title' attribute like so (this uses jquery for brevity):

```javascript
$('img').each(function() {  
    $(this).attr( 'title', $(this).attr('alt') );  
});
```

This is fairly straightforward.  Now we can simplify our image markdown tag with the same result:

`![Some random image](/img/post-image.jpg)`

![Some random image](/img/post-image.jpg)

There's a fair amount of whitespace to the right of these images.  Depending on your personal preferences this might be OK, and you could center all post images in CSS, but sometimes you might want to include an image as an "aside", appearing next to the text instead of interrupting its flow.  This technique has been employed forever in newspaper layouts and is a fairly common practice in blogs (see: wordpress image alignment options).

Let's say you want to employ this technique.  Chances are you don't want every single image in every post to be right-justified, so using vanilla css you're SOL. By some happy coincidence, we've just developed a way to specify both alt and title text in one go, leaving us with a handy slot to stick some arbitrary information specific to each individual image.  Let's design our tiny little interface first, without implementing anything:

`![<alt_and_title>](<src> "<alignment>")`

i.e.

`![Some random image](/img/post-image.jpg "right")`

![Some random image](/img/post-image.jpg "pull-right")

Now, if we're included the javascript above in our page this has literally no effect on the end result of the rendered post, since the "right" title text is immediately overwritten by the alt text.  So let's do something with that alignment data before it gets obliterated.

```javascript
$('img').each(function() {
    $(this).css( 'float', $(this).attr('title') );
    $(this).attr( 'title', $(this).attr('alt') );  
});
```

![Some random image](/img/post-image.jpg "pull-left")

And that's it.  Now, any value in the original "title" markdown field will be interpreted as the CSS float value for the rendered image.

There are a few improvements that could be made to make this more customizable, purdier, and responsive.  I would use something like this:

```javascript
$('img').each(function() {
    $(this).addClass( $(this).attr('title'));
    $(this).attr( 'title', $(this).attr('alt') );  
});
```

with this css:

```css
.post img {
  background-color: #f7f7f7;
  padding: 5px;
  border: 1px solid #ddd;
  margin: 5px;
}

@media (min-width: 768px) {
  .post img.align-right {
    float: right;
  }
  .post img.align-left {
    float: left;
  }
}
```

and use it like so:

`![Some random image](/img/post-image.jpg "align-left")`

*Note*: If you're using bootstrap you could use the built-in `pull-left` class (as I've done above for the sake of argument) but this doesn't look as good on small screens, so I prefer to customize it.

This is a powerful technique when the extension isn't built-in to your markdown processor since you can assign any arbitrary class to an individual post image without having to muck around with HTML in your pretty .md files.  You could go a few steps farther to support multiple classes or to re-introduce support for separate title and alt text, but I'll leave that as an exercise for the reader.
