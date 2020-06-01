<script>
    export let label;
    export let isLeafNode;
    export let data;
</script>
<style>
    .leafNode {
        font-style: italic;
    }
    .folderNode {
        text-transform: uppercase;
    }
    .clickable {
        cursor: pointer;
    }
</style>
{#if isLeafNode}
    <span class="leafNode clickable">{label}</span>
{:else}
    <span class="folderNode clickable">{label}</span>

{/if}
