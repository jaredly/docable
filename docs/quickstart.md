---
title: Quickstart
subtitle: Up and documenting in 5 minutes
navIndex: 1

---
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

TODO maybe `docable init blog` if it's a more bloglike thing?

Or create the `.docable.js` file manually. [Here's the info](/config/index.html) on what should go in it.

## 3. Start the editor

```
$ docable serve
listening on http://localhost:4011
```

Then going to http://localhost:4011/admin/ will get you to the IDE, and you can start writing.

## 4. Create some awesome docs!

- See the [Writing](/writing.html) docs about how to format things
- Check out the [configuration](/config/index.html) section to make this your own.
- Watch [a video]() about this whole setup, because why not.
- Read [the source]() for this page to see how things look

# Publishing to Github Pages

## Option 1: `docable setup-pages`
And you're done. A new `./pages` directory is created containing a checkout of the `gh-pages` directory. You can then just `docable push "my commit message"` to push your new docs, which essentially does `cd pages && git add . && git commit -am "my commit message" && git push`.

## Option 2: By hand
This is how the `setup-pages` command works, if you're curious or want things to be setup somewhat differently.

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

`docable gen` will generate your docs, and put the output into the build directory (`./pages` by default). If that directory is setup as suggested to contain your `gh-pages` branch, publishing is as simple `dockable push "my commit message"`, or (doing the same thing) `cd pages && git add . && git commit -am "my commit message" && git push`.