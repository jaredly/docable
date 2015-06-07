<!--
---

type: page
title: Themes
subtitle: 'Personalize, Diversify'


---
-->

# Using a theme

- have it somewhere. npm modules are awesome
- require it in the .docable.js config file as the "theme".

```javascript
module.exports = {
  // ... other config
  theme: require('my-awesome-theme')
}
```

# Theme API
You should `module.exports` an object with these attributes:

## name : `str`
MyAwesomeTheme

## styles : `fn(themeConfig) -> styles dict`

This is a function that accepts the user's `themeConfig` and returns a double-nested style object, where the top level indicates general sections.

```javascript
config => ({
  header: {
    container: {
      backgroundColor: config.bgColor,
    },
    link: {
      textDecoration: 'none',
    },
  },
  footer: {
    container: {
      padding: '10px',
    },
  },
})
```

## defaultConfig : `dict`

This should contain a mapping of the default config values your theme expects. If the user doesn't specify a config value, it will be taken from this dict.

## baseDir : `__dirname` (needed for correct asset attribution)

## assets : `[str]`

This lists assets as paths, relative to the `baseDir`. These will be accessible to the `Page` component via the `asset()` function.

## head: `fn(file, themeConfig) => obj`

The returned object has things that should go in the head of the page.

- title: `str`
- scripts: `[str]`
- styles: `[str]`

If a string in `scripts` or `styles` is a relative path, it should be relative to the theme's `baseDir`.

## Page : `React Component`

This is where the bulk of the theme lives.

### Props

Prop|Value
-|-
file|all the data from the file. See below for what that looks like
plugins | a list of plugin data. See below for more info.
styles | a nested object of classnames, derived from the theme's `styles` attribute.
asset | a function for referencing assets. call with the name of an asset, and it returns an absolute path suitable for use in a `src=` or something.

### Plugins

#### blocks

A map of `block location: () => react element`

#### links

A map of `{[title]: link}`, just as in the [file definition](/writing.html).

### File format