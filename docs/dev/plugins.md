---
title: Plugins
subtitle: The Other Super Hero

---
# Plugin Hooks

- sourcePaths: `string | [string] | ctx => (string | [string])`
- preprocess: `fn(file)`
- page: `fn(file)`
This is used for render.
- postprocess: `fn(file)`

# Most Basic Plugin

The most basic plugin only cares about a single page at a time, and doesn't have any input into grander things. It looks like:

```
fn(file) => {
  scripts: ?[str], // paths to js files
  styles: ?[str],  // paths to css files
  links: ?{title: link, ...}, // links to add to the header
  blocks: ?{
    beforeHeader: fn() => React Element,
    ... (before/after Header, Content, Footer)
  }
}
```

The `file` object looks like

```
{
  title:
  subtitle:
  rawBody: // the markdown version
  body:    // the HTML formatted version
  ... any other metadata from the yaml frontmatter
}
```

# Configuration

If plugins need any special configuration, the common pattern is to have them export a top-level function that takes this configuration as arguments, and returns the expected "plugin"-shaped object.

E.g.

```javascript
module.exports = config => ({
  preprocess(file) {
    // do something
  },
})
```