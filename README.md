# v-highlight

Highlight words with this simple and dependency-less Vue 3 directive.

## Installation

Install this directive with:

```sh
npm i --save v-highlight-3
```

```sh
yarn add v-highlight-3
```

And then use it **globally** like this:

```js
import { createApp } from "vue";
import { vHighlight } from "v-highlight-3";

const app = createApp(/** your app component here */);

app.directive("highlight", vHighlight);

app.mount("#app");
```

Or use it locally on some of your components like this:

```html
<template>
  <div v-highlight="['hello', 'world']">
    <p>hello</p>
    <p>world</p>
  </div>
</template>

<script>
import { vHighlight } from "v-highlight-3";

export default {
  directives: {
    "highlight": vHighlight
  }
}
</script>
```

## Options

### Styling

You can customise the class by sending it as an __directive argument__:

```html
<div v-highlight:bg-white="['hello', 'world']">
  <!-- Rest of your HTML -->
</div>
```
**More options coming soon as this is on its first versions...**

## License

This package is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
