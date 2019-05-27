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