<script>
    export let label;
    export let data = null;
    export let isLeafNode;
</script>
<style>
    .isLeafNode {
        padding-left: 1.0em;
    }
    .clickable {
        cursor: pointer;
    }
</style>
<span class={`clickable ${isLeafNode? 'isLeafNode' : ''}`}>{label}</span>