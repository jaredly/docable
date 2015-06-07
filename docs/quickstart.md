<!--
---

type: page
title: Quickstart
subtitle: Up and documenting in 5 minutes


---
-->

# Getting up and Running

## 0. Prereqs

- node. [nvm](https://github.com/creationix/nvm) is a great tool for installing/managing node, or you can [get it directly](https://nodejs.org/download/)

... that's it

## 1. Installation

```
npm install -g docable
```

## 2. Initialize

Run `docable init` in the base directory of your project.

If you want, you can also create the `.docable.js` file manually. [Here's the info](/config.html) on what should go in it.

## 3. Start the editor

```
$ docable serve
listening on http://localhost:4011
```

## 4. Create some awesome docs!

You can [watch a video TODO]() about this whole bit if you want. Also, the [Writing](/writing.html) page should be useful.

# Publishing to Github Pages

To make this as seamless as possible, the following setup is suggested:

First add `/pages` to your `.gitignore` file.

### If you already have a `gh-pages` branch
```
git clone `git config --get remote.origin.url` -b gh-pages --single-branch ./pages
```
That command will just error if you don't have a gh-pages branch yet. It checks out the branch into a new directory, `./pages`.

### If you don't have a `gh-pages` branch yet:

This will create the branch for you, and create the `./pages` directory containing a checkout of that branch.

```
git clone `git config --get remote.origin.url` ./pages
cd pages
git checkout --orphan gh-pages
git rm --cached -r .
echo "hello world" > index.html
git add index.html
git commit -m 'hello github pages'
git push -u origin gh-pages
cd ..
```

### What's with this setup?
Having the `gh-pages` branch in a subdirectory makes things easier for publishing (note: not a submodule though). You can just build into that directory, and then commit and push from there.

## Actually publishing

`docable gen` will generate your docs, and put the output into the build directory (`./pages` by default). If that directory is setup as suggested to contain your `gh-pages` branch, publishing is as simple as `git commit` and `git push`.