---
title: Writing
subtitle: Putting Pen to paper
navIndex: 2
---

This is how you write a markdown page.

# "Frontmatter"

This is a YAML definition of metadata about a page. It must be placed first within the file.

It can be within `---` fences, or (recommended for the `Readme.md`), within comment fences.

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
links|A dict of `title: href`

# The Body

The body of your page is markdown, with a couple of extensions. For a nice intro to markdown, check out [github's tutorial](https://help.github.com/articles/markdown-basics/).

## comment blocks

In order to maintain as much compatibility with other markdown renderers as possible (read: github =), many of `docable`'s syntax extensions are within html comments.

For example, if you want something to be shown by a normal renderer, but not by docable, you can do

```
<!-- @docable hide -->
You should really look at the [rendered version]() of this page
<!-- @docable /hide -->
```

Conversely, if you want something to be hidden by normal renderers, but to show up on docable:

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
