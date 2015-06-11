<!-- @frontmatter
title: Docable
navTitle: Home
subtitle: The Integrated Documentation Environment and Static Site Generator
navIndex: 0

-->
<!-- @demobox hide -->

## See the docs rendered on [the website](https://jaredly.github.io/docable)

<!-- @demobox /hide -->

## Docable is here to make documentation easy and enjoyable

- open source
- flexible
- optimized for usability

![screenshot](/screenshot.png)

# Features

## IDE is built in
This is really the reason I built docable. I wanted a rich experience for creating documentation, and none of the existing systems quite lent themselves to what I wanted.

With the Integrated Documentation Environment, writing docs is not only palatable, but downright appealing.

TODO image here

## Just markdown
Markdown is awesome. WhatYouWriteIsWhatYouWant. Or something.

Plus there are some bonuses for unlocking a bit more visual flexibility. Look at the [Writing](/writing.html) page for full details.

## Plugin based
What can plugins do?
- add page-level blocks
- generate derivative pages
- modify the nav items

## Awesome defaults
The base theme uses material design coloring and beautiful, readable fonts.

## Javascript Front and Back
Because the site is written in 100% javascript, (not only that but it's the *same* javascript used on the backend and the frontend), there are some really cool things that can happen.

- gradual awesomeization. Graceful degredation. If someone doesn't have javascript, then the pre-rendered HTML will treat them just fine. If they do have JS, however, then we get things like in-place loading, interactive pages, and other wonderful things.

# What does X site use for documentation?

## Bootstrap
Uses: Jekyll (mostly hand-coded html)

## React-Native
Uses: Custom script

## Backbone
Uses: hand-coded html
+ Annotated source (via ???)

## Lodash
Uses: Custom markdown -> html script

## Underscore
Uses: ??
+ Annotated source (docco)

## VelocityJS
Uses: custom blog...

## Ember
Uses: custom [ruby server](https://github.com/emberjs/website/tree/master/lib)

## Angular 2.0
Uses: [Harpjs](http://harpjs.com/), a static site generator

# Docable vs...

## Jekyll, Harp, other static site generators
Typically need a lot of boilerplate to get a documentation site up and running. That might be OK if you're a bit time player with lots of time for putting together your docs... but we'd like it to be as streamlined as possible.

Also, docable is all about the "integrated documentation environment", as much as the eventual generation part.

## ReadTheDocs (+ i.e. Sphynx documentation generator)
- ReStructuredText. Cool idea, but Markdown has proven to be much more writable.

Examples:
- Julia docs (really fantastic)
- [Pip](https://pip.pypa.io/en/stable/)
- [Sequalize](http://docs.sequelizejs.com/)

Ok WOW sequalize docs are mega awesome.

Maybe that's the answer? Maybe that's what a body needs...

**Except!!!** the whole `IDE` bit. And the fact that it's in python. Which is awesome, but less so for websites.

So do I make an IDE for Sphynx? I imagine it would be fraught with peril.

## MkDocs
MkDocs is a really cool project, and it's awesome that they are integrated with ReadTheDocs.
- nice themes
- looks cool

But:
- limited extensibility, with stated intent against such funtionality
- no editor

## Readme.io

- not open source
- your docs won't be version controlled (at least not in a way compatible with normal `git` workflow)
- not extensible