# dashboard-widget-notes

Dashboard widget for the Sanity Content Studio which lets you write simple "post-it" notes.

## Site Config Schema

siteConfig.js

```javascript
export default {
  name: 'site-config',
  type: 'document',
  title: 'Site configuration',
  fields: [
    {
      name: 'dashboardNotes',
      type: 'text',
      readOnly: true,
      //hidden: true,
      rows: 5,
    },
  ],
};
```
