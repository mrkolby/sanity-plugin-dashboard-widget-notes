# dashboard-widget-notes

Dashboard widget for the Sanity Content Studio which lets you write simple "post-it" notes.

Uses [polished.js](https://polished.js.org/) to find the best contrast depending on the luminosity of the given `backgroundColor`. Override with `color` in options.

![sanity-plugin-dashboard-widget-notes-2](https://user-images.githubusercontent.com/300595/59165189-4edb9480-8b18-11e9-99c1-7cdd1e5049d3.png)

## Quick start

Install the plugin in your Sanity Studio project folder:

```text
sanity install dashboard-widget-notes
```

Add to [dashboardConfig.js](https://www.sanity.io/docs/dashboard/installing-and-configuring-widgets#changing-layout):

```javascript
export default {
  widgets: [
    { name: 'notes' }
    // ...the rest of your widgets
  ]
}
```

## Options

There are some options available.

### `title` (string)

Widget title. Defaults to `Notes`

```javascript
{
  name: 'notes',
  options: {
    title: 'My notes'
  }
}
```

### `placeholder` (string)

Placeholder text in the `<textarea>`. Defaults to `...`

```javascript
{
  name: 'notes',
  options: {
    title: 'My notes',
    placeholder: 'What is up?'
  }
}
```

### `backgroundColor` (string)

Background color for the widget. A black or white text color is set automatically depending on the luminosity. Defaults to `#ffff88`

```javascript
{
  name: 'notes',
  options: {
    title: 'My notes',
    placeholder: 'What is up?',
    backgroundColor: '#eee',
  }
}
```

### `color` (string)

Override text color for the widget.

```javascript
{
  name: 'notes',
  options: {
    title: 'My notes',
    placeholder: 'What is up?',
    backgroundColor: '#eee',
    color: 'red',
  }
}
```

## Local development

1. Fork/clone this repo
2. Install dependencies (`yarn` or `npm install`)
3. Link for local development (`yarn link` or `npm link`)
4. Run build to compile your changes (`yarn build` or `npm run build`)
5. Link in a local studio folder (`yarn link "sanity-plugin-dashboard-widget-notes"` or `npm link sanity-plugin-dashboard-widget-notes`)
6. Add `sanity-dashboard-widget-notes` to the plugin array in `sanity.json`
7. Add `{name: 'notes'}` to your `dashboardConfig.js`
