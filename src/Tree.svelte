<script>
    import { onMount, getContext, setContext, createEventDispatcher } from "svelte";
    import Node from './Node.svelte'

    const dispatch = createEventDispatcher();

    // const { getTreeItems } = getContext('treeItems');
    // const treeItems = getTreeItems();
    export let treeItems;

    export let refresh = false;

    let dragging;
    setContext('dragging', {
        getDragged: () => dragging
    });

    function selectItem(item) {
        console.log('selected item: ' + item);
        dispatch('selected', findByIndexPath(item.slice(), treeItems))
    }

    function dragStart(event) {
        dragging = event.detail;
    }

    function findByIndexPath(indexPath, currentElement) {
        if (indexPath.length === 0) {
            return currentElement;
        }
        const currentIndex = indexPath.shift();
        const current = currentElement.children[currentIndex];       
        if (current.hasOwnProperty('children')) {
            return findByIndexPath(indexPath, current);
        } else {
            return current;
        }
    }

    function getAllIndexes(arr, val) {
        var indexes = [], i;
        for(i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }

    function indexToRemove(oldParent, newParent, newPosition, draggedItem) {
        if(oldParent !== newParent) {
            return oldParent.children.indexOf(draggedItem);
        }
        const allIndexes = getAllIndexes(oldParent.children, draggedItem);
        if(allIndexes.length !== 2) {
            console.error('found too few/too many indexes', allIndexes);
            return;
        }
        return allIndexes.find((index) => {
            return `${index}` !== `${newPosition.slice().pop()}`
        });        
    }

    function handleDrop(event) {
        const oldPosition = event.detail.oldPosition.slice();
        const newPosition = event.detail.newPosition.slice(1); //remove 'dropzone' prefix

        const oldParent = findByIndexPath(oldPosition.slice(0, oldPosition.length - 1), treeItems);
        const newParent = findByIndexPath(newPosition.slice(0, newPosition.length - 1), treeItems);
        const draggedItem = findByIndexPath(oldPosition.slice(), treeItems);

        // insert draggedItem at the new position
        console.log('new parent by index ' + JSON.stringify(newPosition), newParent);

        const newChildren = newParent.children.slice();
        newChildren.splice(newPosition.slice().pop(), 0, draggedItem);
        newParent.children = newChildren;

        // remove the draggedItem from the old position.
        // If we just moved the element within the same parent, 
        // we must consider that it is present now twice within the children. 
        const index = indexToRemove(oldParent, newParent, newPosition.slice(), draggedItem);
        console.log('index to remove is ' + index);
        oldParent.children.splice(index, 1);
        draggedItem.refresh = new Array();

        treeItems = JSON.parse(JSON.stringify(treeItems));
        //treeItems.children = treeItems.children.slice();

        dispatch('orderChanged', treeItems)

        dragging = null;

        refresh = new Array();
    }

</script>

<div class="tree">
    {#if treeItems}
        <Node  {...treeItems} expanded refresh
            on:selected={(treeItem) => selectItem(treeItem.detail)} 
            on:dragstart={(event) => dragStart(event)}
            on:drop={handleDrop} />
    {:else}
        <p class="loading">loading...</p>
    {/if}
</div>
