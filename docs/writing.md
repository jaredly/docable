---
title: Writing
subtitle: Putting Pen to paper
navIndex: 2

---
This is how you write a markdown page.

# "Frontmatter"

This is a YAML definition of metadata about a page. It must be placed first within the file.

It can be within `---` fences, or within comment fences (recommended for the `Readme.md`).

Normal fences
```
---
title: Awesome
---

body...
```

Or comment fences (which will hide the frontmatter from normal markdown renderers)
```
<!-- @frontmatter
title: Read this
-->

body...
```

Attributes (all are technically optional)

Attr|Value
-|-
title|The title at the top of the page
subtitle|Below the title
navTitle|The title to show in navigation
navIndex|To specify ordering in the navigation
links|A dict of `title: href`, which get displayed in the top nav

# The Body

The body of your page is markdown, with a couple of extensions. For a nice intro to markdown, check out [github's tutorial](https://help.github.com/articles/markdown-basics/).

## Commented blocks
Sometimes you want to show or hide a section when it's rendered by Docable, but do the opposite when it's rendered by some other markdown renderer, like github.

To hide something from docable, use these comments:

```
<!-- @docable hide -->
You should really look at the [rendered version]() of this page
<!-- @docable /hide -->
```

And to show something in docable that's hidden otherwise, use this comment:

```
<!-- @docable show
Check out the [github repo]() to suggest changes or file issues.
-->
```

## Columns
By annotating sibling headers, you can get sections displayed as columns.

```
### Some heading (||)
content...
### Other heading (||)
more content...
```

is rendered as:
### Some heading (||)
content...
### Other heading (||)
more content...

## Collapsible Sections

### Collapsed

```
#### A collapsed section (<<)
click the header to open it
```

#### A collapsed section (<<)
click the header to open it

### Expanded

```
#### An expanded section (>>)
click the header to close it
```

#### An expanded section (>>)
click the header to close it

## `@` links
Using `@` links, you can have some embedded content in your documentation, that is nevertheless still accessible (rendered as a normal link) when rendered by some other markdown renderer.

### Embed video
```
[![Yawtoob](http://img.youtube.com/vi/Yip94VsvWQ0/0.jpg)](http://youtube.com/watch?v=Yip94VsvWQ0)
```
[![Yawtoob](http://img.youtube.com/vi/Yip94VsvWQ0/0.jpg)](http://youtube.com/watch?v=Yip94VsvWQ0)

### Embed code
```
[Here's the example file](./file.js "@include:javascript Some caption")
```