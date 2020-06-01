import TreeView from '../src/views/TreeView.svelte';

export default {
  title: 'Tree',
  component: TreeView,
};

let treeItems = {
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
  }, {
    label: 'Vegetables',
    expanded: true,
    children: [
      { label: 'Eggplant' }, 
      { label: 'Pepper' }, 
      { label: 'Broccoli'},
      { label: 'Mushroom'},
      { label: 'Cauliflower'},
    ]
  }],
};


export const Basic = () => ({
  Component: TreeView,
  props: {
    treeItems: treeItems
  },
  on: { 
    orderChanged: (newOrder) => {
      treeItems = newOrder;
    }
  }
});


export const CustomLabels = () => ({
  Component: TreeView,
  props: {
    treeItems: treeItems,
    options: {
      labelFormatter: () => import ('../src/views/ExampleFormatter.svelte')
    }
  },
  on: { orderChanged: (newOrder) => {
      treeItems = newOrder;
  }}
});

export const CustomClasses = () => ({
  Component: TreeView,
  props: {
    treeItems: treeItems,
    options: {
      collapseClass:"fa fa-folder-open",
      expandClass:"fa fa-folder",
      labelFormatter: () => import ('../src/views/ExampleFormatter.svelte')

    }
  },
  on: { orderChanged: (newOrder) => {
      treeItems = newOrder;
  }}
});

