<script>
    import Tree from '../Tree.svelte'
    export let treeItems;
    let selected;
    let newOrder;
</script>

<style>
    .flex-container{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
</style>

<h1>Tree Example</h1>
<div class="flex-container">
    <div>
        <Tree 
            treeItems={treeItems}
            on:selected={(item) => selected = item.detail}
            on:orderChanged={(items) => {treeItems = items.detail}}></Tree>
    </div>
    <div>
        <h2>Current items: </h2>
        <pre>{ JSON.stringify(treeItems, undefined, 2) }</pre>
    </div>
    <div>
        <h2>Selected item</h2>
        <pre>{ JSON.stringify(selected, undefined, 2) }</pre>
    </div>
</div>

