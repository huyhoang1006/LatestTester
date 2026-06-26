<template>
    <div id="app">
        <router-view />
        <GlobalLoading />
        <GlobalConflictDialog />
    </div>
</template>

<script>
import GlobalLoading from '@/components/GlobalLoading.vue'
import GlobalConflictDialog from '@/views/TreeNode/dialogs/ConflictDialog.vue'

export default {
    name: 'App',
    components: {
        GlobalLoading,
        GlobalConflictDialog,
    }
}
</script>

<style lang="scss">
@charset "utf-8";

html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #ffffff;
}

#app {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    border: none;
}
</style>