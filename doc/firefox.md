# Transparent background
To enable transparent backgrounds add the following to your `userChrome.css`

```css
#main-window,
#browser {
	background: transparent !important;
	background-color: transparent !important;
}

:root {
	--tabpanel-background-color: #00000000 !important;
}

.browser-toolbar {
	&:not(.titlebar-color) {
		background-color: #00000000 !important;
	}
}

toolbox#navigator-toolbox {
	background-color: #00000000 !important;
}
```
Source: https://reddit.com/r/FirefoxCSS/comments/1ox2vvm/how_do_i_make_the_page_background_fully/
