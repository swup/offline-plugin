# Swup Offline Plugin

A [swup](https://swup.js.org) plugin for making content available offline.

- Preload pages for offline access
- Prevent new network requests while offline
- Display a notification when network status changes

> [!WARNING]
> This plugin is in **very early** public development. Features and APIs will not be
> stable for a while, things can and will change.

## Installation

Install the plugin from npm and import it into your bundle.

```bash
npm install @swup/offline-plugin
```

```js
import SwupOfflinePlugin from '@swup/offline-plugin';
```

Or include the minified production file from a CDN:

```html
<script src="https://unpkg.com/@swup/offline-plugin@1"></script>
```

## Usage

To run this plugin, include an instance in the swup options.

```javascript
const swup = new Swup({
  plugins: [new SwupOfflinePlugin()]
});
```

## Offline Content

Lorem ipsum dolor sit amet.

## Options

Lorem ipsum dolor sit amet.

## Hooks

The plugin creates two new hooks.

> **Note** The visit object might be `undefined` or already settled for these hooks

### network:offline

Fires when the user's device goes offline.

```js
swup.hooks.on('network:offline', () => showOfflineBanner());
```

### network:online

Fires when the user's device goes online again.

```js
swup.hooks.on('network:online', () => hideOfflineBanner());
```
