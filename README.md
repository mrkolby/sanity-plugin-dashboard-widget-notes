# dashboard-widget-notes

Dashboard widget for the Sanity Content Studio which lets you write simple "post-it" notes.

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

## Local development

1. Fork/clone this repo
2. Install dependencies (`yarn` or `npm install`)
3. Link for local development (`yarn link` or `npm link`)
4. Run build to compile your changes (`yarn build` or `npm run build`)
5. Link in a local studio folder (`yarn link "sanity-plugin-dashboard-widget-notes"` or `npm link sanity-plugin-dashboard-widget-notes`)
6. Add `sanity-dashboard-widget-notes` to the plugin array in `sanity.json`
7. Add `{name: 'notes'}` to your `dashboardConfig.js`