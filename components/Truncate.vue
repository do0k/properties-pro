<script lang="ts" setup>
enum Placement {
	'top',
	'bottom',
	'left',
	'right'
}
const {content, placement} = defineProps<{
  placement: Placement,
	content: string
}>()
</script>

<template lang="pug">
el-tooltip(:content="content")
	.truncate
		slot
</template>