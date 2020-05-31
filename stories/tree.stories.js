import {TreeView} from '../src/index';
import { action } from '@storybook/addon-actions';

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


export const Example = () => ({
  Component: TreeView,
  props: {
    treeItems: treeItems
  },
  on: { orderChanged: (newOrder) => {
      console.log('new order', newOrder);
      treeItems = newOrder;
  }}
});
