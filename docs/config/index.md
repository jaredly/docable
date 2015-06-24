---
title: Configuration
subtitle: The basics
navIndex: 3

---
Configuration is done in the `.docable.js` file at the base of your project.

You can look at [the one for this project]() as an example.

Name|Type|Default|Description
-|-|-|-
source|str|`"./docs"`|where the docs are (relative)
dest|str|`"./pages"`|destination for generation (relative)
theme|[Theme](/config/themes.html)|[default theme]()|the theme to use
themeConfig|obj|`{}`|Configuration values for the chosen theme
plugins|array of [Plugins](/config/plugins.html)|See list of default plugins|Order often doesn't matter, but sometimes it would.