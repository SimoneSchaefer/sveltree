# Sveltree
A very basic drag-and-drop tree component for Svelte 3. 

Define tree items like this:

```
treeItems = {
  label: 'Yummy',
  children: [{
    label: 'Diary products',
    expanded: false,
    children: [
      {label: 'Cheese'}, 
      {label: 'Yogurt'}
    ]
  }, {
    label: 'Fruit',
    expanded: true,
    children: [
      { label: 'Apple' }, 
      { label: 'Banana' }, 
      { label: 'Peach'},
      { label: 'Nuts', 
        children: [
          {label: 'Cashew'},
          {label: 'Peanut'},
          {label: 'Almond'}
        ]}
    ]
  }
  ...
  ```
and use it in your component like this: 
```
<Tree treeItems={treeItems}
     on:selected={(item) => selected = item.detail}
     on:orderChanged={(items) => {treeItems = items.detail}}></Tree>
``` 
See storybook for an example:

```bash
npm run storybook
```

To Run tests:
```bash
npm test # or yarn
```
---

*Template from https://github.com/nirmaoz/svelte-component-library-template.*
