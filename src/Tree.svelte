<script>
    import { onMount, getContext, setContext, createEventDispatcher } from "svelte";
    import Node from './Node.svelte'

    const dispatch = createEventDispatcher();

    export let treeItems;
    export let options;

    let internalOptions = {
        labelFormatter: () => import ('./DefaultLabelFormatter.svelte'),
        collapseClass: 'chevron bottom',
        expandClass : 'chevron right'
    };

    onMount(async () => {    
        internalOptions = Object.assign(internalOptions, options);
    });
         

    let dragging;
    setContext('dragging', {
        getDragged: () => dragging
    });

    function selectItem(item) {
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
        newParent.children.splice(newPosition.slice().pop(), 0, draggedItem);

        // remove the draggedItem from the old position.
        // If we just moved the element within the same parent, 
        // we must consider that it is present now twice within the children. 
        const index = indexToRemove(oldParent, newParent, newPosition.slice(), draggedItem);
        oldParent.children.splice(index, 1);
        dragging = null;
        dispatch('orderChanged', treeItems)
    }
</script>



<div class="tree">
    {#if treeItems}
        <Node  
            {...treeItems} 
            internalOptions={internalOptions}
            expanded 
            on:selected={(treeItem) => selectItem(treeItem.detail)} 
            on:dragstart={(event) => dragStart(event)}
            on:drop={handleDrop} />
    {/if}
</div>
