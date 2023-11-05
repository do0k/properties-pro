<script lang="ts" setup>
definePageMeta({
	middleware: ['protected']
})

const user = await useAuthenticatedUser()

const handleSubmit = async (e: Event) => {
	await useFetch('/api/auth/logout', {
		method: 'POST',
		redirect: 'manual'
	})
	await navigateTo('/auth/login')
}
</script>

<template>

</template>