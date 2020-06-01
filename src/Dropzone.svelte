<script>
    import { getContext, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    const { getDragged } = getContext('dragging');

    export let prefix = null;

    let draggingOver = false;

    // TODO: force keep hierarchy, should be configurable
    function dragAllowed(eventTargetId) {
        return 1;      
    }

    // Called when something is dragged over this node's dropzone. 
    // If this drag action is allowed, the #draggingOver flag is set, in order to highlight the dropzone.
    function handleDragEnter(event) {
        if (!event.target || !event.target.id) return;
        if (dragAllowed(event.target.id) === 0) { return;}
        draggingOver = true;       
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

    function cancelDrag() {
        draggingOver = false;
    }

    function getId() {
        return `dropzone-${prefix}`;
    }
</script>


<style>
    .dropzone.idle {
        height: 3px;
    }
    .dropzone.active {
        background-color: #d2d2d2;
        border: 1px dotted #6d6d6d;
        height: 24px;
    }
</style>
  
  
  
<div class={`dropzone ${draggingOver ? 'active' : 'idle'}`} 
    id={getId()}
    on:dragleave={($event)=>(cancelDrag($event))}  
    on:dragenter={($event)=>(handleDragEnter($event))}  
    on:drop={($event) => (drop($event))} 
    ondragover="return false"></div>