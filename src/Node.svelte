<script>
    import { getContext, createEventDispatcher } from "svelte";

    /////////////////////// EVENTS//////////////////////
    const dispatch = createEventDispatcher();

    /////////////// CONTEXT DEPENDENCIES///////////////
    const { getDragged } = getContext('dragging');

    /////////////////////EXPORTED PROPERTIES///////////////////
    // Whether this folder is expanded or not (irrelevant for leaf nodes)
    export let expanded = false;
    // The entity's child elements. If not present, this is assumed to be a leaf node. 
    export let children = null;
    // The entity associated with this node, e.g. a part, chapter or scene
    export let label;
    // The prefix helps to find an elementÄs position within the tree
    export let prefix = null;  

    export let refresh = false;

    //////////////////// OTHER MEMBERS/////////////////////////
    // Set to true when this folder's dropzone is currently dragged over     
    let draggingOver = false;
              
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

    // Whether dragging the currently dragged element onto this node's dropzone is allowed
    // based on the structure member)
    function dragAllowed(eventTargetId) {
        return 1;

        //TODO: config param if hierarchy needs to stay the same
        const newFollowUpType = eventTargetId.split('-')[1];
        if (newFollowUpType === getDragged().entityType) return 1;
        if (structure.indexOf(newFollowUpType) === structure.indexOf(getDragged().entityType) - 1) return 2;
        return 0;        
    }

    // Whether this node is a leaf node or not
    function isLeafNode() {
        console.log('isLeafNode: ' + label + ', children: ', children);
        return !Array.isArray(children);
    }

    function isRootNode() {
        return prefix === null;
    }

    // Called when something is dragged over this node's dropzone. 
    // If this drag action is allowed, the #draggingOver flag is set, in order to highlight the dropzone.
    function handleDragEnter(event) {
        if (!event.target || !event.target.id) return;
        if (dragAllowed(event.target.id) === 0) { return;}
        draggingOver = true;       
    }

    // Called when the user starts to drag something.
    // Dispatches an event to notfify the parent who needs to update the context value (see #getDragged).
    function dragStart(event) {
        if (!event.target || !event.target.id) return;              
        dispatch('dragstart', event.target.id.split('-'));
    }

    // Called when something is dropped onto the dropzone. 
    // Dispatches an event to notify the parent.
    function drop(event) {
        if (!event.target || !event.target.id) return;
        if (dragAllowed(event.target.id) > 0) {
            dispatch('drop', {
                oldPosition: getDragged(),
                newPosition: event.target.id.split('-'),
            });
        }       
        cancelDrag();
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
    .chevron.left:before {
        left: 0.25em;
        transform: rotate(-135deg);
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

    .dropzone.idle {
        height: 3px;
    }
    .dropzone.active {
        background-color: #d2d2d2;
        border: 1px dotted #6d6d6d;
        height: 24px;
    }
</style>



<!-- DROPZONE -->
{#if !isRootNode()}
<div class={`dropzone ${draggingOver ? 'active' : 'idle'}`} 
    id={`dropzonebefore-${prefix}`}
    on:dragleave={($event)=>(cancelDrag($event))}  
    on:dragenter={($event)=>(handleDragEnter($event))}  
    on:drop={($event) => (drop($event))} 
    ondragover="return false"></div>
{/if}

<!-- DISPLAY ELEMENT -->
<div draggable=true 
    on:dragstart={($event) => (dragStart($event))} 
    on:dragend={($event) => (cancelDrag($event))}
    id={prefix}>
    {#if !isLeafNode()}
        <i class={`clickable chevron ${expanded ? "bottom" : "right"}`} on:click={toggle}></i>
        <span class="folderNode" on:click={() => select()}>{label}</span>
    {:else}
        <span class="clickable leafNode" on:click={() => select()}>{label}</span>
    {/if}
</div>



<!-- CHILDREN  -->
{#if expanded && children}
    <ul>
        {#each children as child, i}
            <li>
                <svelte:self {...child} 
                    refresh
                    data
                    expanded
                    prefix={getPrefix(i)}
                    on:selected 
                    on:dragenter 
                    on:dragleave 
                    on:dragstart 
                    on:dragend 
                    on:drop/>
            </li>
        {/each}
    </ul>
{/if}
