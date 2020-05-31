// NOTE: original code from https://testing-library.com/docs/svelte-testing-library/example
// NOTE: jest-dom adds handy assertions to Jest and it is recommended, but not required.
import '@testing-library/jest-dom/extend-expect'

import { render } from '@testing-library/svelte'

import Tree from '../src/Tree.svelte'

const treeItems =       { 
  label: 'Yummy',
  children: [{
    label: 'Diary products',
    expanded: false,
    children: [
      {label: 'Cheese'}, 
      {label: 'Yogurt'}
    ]
  }, 
  {
    label: 'Fruit',
    expanded: true,
    children: [
      { label: 'Apple' }, 
      { label: 'Banana' }, 
      { label: 'Nuts', 
        children: [
          {label: 'Cashew'},
          {label: 'Peanut'},
          {label: 'Almond'}
        ]}
    ]
  }]
}

describe('Tree', () => {

  it('shows all items', () => {
    const { getByText } = render(Tree, { treeItems });
    expect(getByText('Yummy')).toBeInTheDocument()
    expect(getByText('Diary products')).toBeInTheDocument()
    expect(getByText('Cheese')).toBeInTheDocument()
    expect(getByText('Yogurt')).toBeInTheDocument()
    expect(getByText('Fruit')).toBeInTheDocument()
    expect(getByText('Apple')).toBeInTheDocument()
    expect(getByText('Banana')).toBeInTheDocument()
    expect(getByText('Nuts')).toBeInTheDocument()
    expect(getByText('Cashew')).toBeInTheDocument()
    expect(getByText('Peanut')).toBeInTheDocument()
    expect(getByText('Almond')).toBeInTheDocument()
  });


  it('assigns correct node class', () => {
    const { getByText } = render(Tree, { treeItems });
    expect(getByText('Yummy')).toHaveClass('folderNode');
    expect(getByText('Diary products')).toHaveClass('folderNode');
    expect(getByText('Fruit')).toHaveClass('folderNode');
    expect(getByText('Nuts')).toHaveClass('folderNode');
    expect(getByText('Cheese')).toHaveClass('leafNode');
    expect(getByText('Yogurt')).toHaveClass('leafNode');
    expect(getByText('Apple')).toHaveClass('leafNode');
    expect(getByText('Cashew')).toHaveClass('leafNode');
    expect(getByText('Peanut')).toHaveClass('leafNode');
    expect(getByText('Almond')).toHaveClass('leafNode');
  });
});