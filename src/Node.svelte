<script>
    import { getContext, createEventDispatcher } from "svelte";
    import Dropzone from './Dropzone.svelte'

    /////////////////////// EVENTS//////////////////////
    const dispatch = createEventDispatcher();

    /////////////// CONTEXT DEPENDENCIES///////////////
    const { getDragged } = getContext('dragging');

    /////////////////////EXPORTED PROPERTIES///////////////////
    // Whether this folder is expanded or not (irrelevant for leaf nodes)
    export let expanded = false;
    // The entity's child elements. If not present, this is assumed to be a leaf node. 
    export let children = null;
    // The label of this node
    export let label;
    // The prefix helps to find an element's position within the tree
    export let prefix = null;
    // (Optional) data. This can be whatever you want, for example to identifier the node afterwards 
    export let data = null;  


    //////////////////// OTHER MEMBERS/////////////////////////
    // Set to true when this folder's dropzone is currently dragged over     
    let draggingOver = false;

    $:isLeafNode = !Array.isArray(children);
    $:isRootNode = prefix === null;
              
    //////////////////FUNCTIONS//////////////////////////
    // Called when this folder is shown/collapsed
	function toggle() {
		expanded = !expanded;
    }

    // Called when this Node has been selected. Dispatches an event to the parent component
    function select() {
        dispatch('selected', `${prefix}`.split('-'));      
    }

    // Resets #draggingOVer flag in order to remove highlighting of dropzone
    function cancelDrag() {
        draggingOver = false;
    }




    // Called when the user starts to drag something.
    // Dispatches an event to notfify the parent who needs to update the context value (see #getDragged).
    function dragStart(event) {
        if (!event.target || !event.target.id) return;              
        dispatch('dragstart', event.target.id.split('-'));
    }


    function getPrefix(index) {
        if (prefix !== null) {
            return `${prefix}-${index}`;
        }
        return index;
    }
</script>


<style>
    .chevron::before {
        border-style: solid;
        border-width: 0.25em 0.25em 0 0;
        content: '';
        display: inline-block;
        height: 0.45em;
        left: 0.15em;
        position: relative;
        top: 0.15em;
        transform: rotate(-45deg);
        vertical-align: top;
        width: 0.45em;
    }
    .chevron.right:before {
        left: 0;
        transform: rotate(45deg);
    }
    .chevron.bottom:before {
        top: 0;
        transform: rotate(135deg);
    }
    .clickable {
        cursor: pointer;
    }
	span {
		padding: 0 0 0 1.5em;
		background-size: 1em 1em;
		cursor: pointer;
	}
    .folderNode {
		font-weight: bold;
    }

    .leafNode {
        padding-left: 2.5em;
    }
	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
	}

	li {
		padding: 0.2em 0;
	}
</style>



<!-- DROPZONE -->
{#if !isRootNode}
    <Dropzone on:drop prefix={prefix}/>
{/if}


<!-- DISPLAY ELEMENT -->
<div draggable=true 
    on:dragstart={($event) => (dragStart($event))} 
    on:dragend={($event) => (cancelDrag($event))}
    id={prefix}>
    {#if !isLeafNode}
        <i class={`clickable chevron ${expanded ? "bottom" : "right"}`} on:click={toggle}></i>
        <span class="folderNode" on:click={() => select()}>{label}</span>
    {:else}
        <span class="clickable leafNode" on:click={() => select()}>{label}</span>
    {/if}
</div>




<!-- CHILDREN  -->
{#if expanded && !isLeafNode}
    <ul>
        {#each children as child, i}
            <li>
                <svelte:self {...child} 
                    expanded
                    data
                    prefix={getPrefix(i)}
                    on:selected 
                    on:dragenter 
                    on:dragleave 
                    on:dragstart 
                    on:dragend 
                    on:drop/>
            </li>
        {/each}
        <li>
            <Dropzone on:drop prefix={getPrefix(children.length)}/>
        </li>
    </ul>
{/if}
