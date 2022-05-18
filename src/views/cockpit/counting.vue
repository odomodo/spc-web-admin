<template>
<div>{{datas}}</div>
</template>

<script setup lang="ts">
import {getCurrentInstance,ComponentInternalInstance, onMounted} from 'vue'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const datas = ''

onMounted(() => {
    proxy.$modal.msgSuccess('nihao')
})

</script>