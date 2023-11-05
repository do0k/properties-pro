<script lang="ts" setup>
definePageMeta({
	layout: "auth",
});

const username = ref("");
const password = ref("");
const passwordInput = ref<null | HTMLInputElement>(null);
const usernameInput = ref<null | HTMLInputElement>(null);
const loading = ref<boolean>(false);

const handleSubmit = async (e: Event) => {
	e.preventDefault();
	loading.value = true;
	console.log(username, password);
	const { data, error } = await useSend("/api/auth/signup", {
		method: "POST",
		body: {
			username: username.value,
			password: password.value,
		},
		redirect: "manual",
	});
	if (error) {
		console.log(error);
		ElMessage({
			message: "نام‌کاربری و/یا رمزورود اشتباه است",
			grouping: true,
			type: "error",
		});
		usernameInput.value?.focus();
	} else {
		ElMessage({
			message: "شما با موفقیت وارد سیستم شدید",
			grouping: true,
			type: "success",
		});
		await navigateTo("/auth/login");
	}
  loading.value = false
};
</script>

<template lang="pug">
.flex.flex-col.items-center
  el-card
    el-bar(title="ورود به سیستم" icon="teenyicons:lock-outline" icon-size="15px" )
    .max-w-md.mt-3
      el-input(
        v-model="username"
        ref="usernameInput"
        name="username"
        type="text"
        placeholder="نام‌کاربری"
        clearable
        autofocus,
      ).mb-2
        template(#prepend)
          icon(name="teenyicons:user-outline" size="15px" ).text-sky-600
      el-input(
        ref="passwordInput"
        v-model="password"
        name="password"
        type="password"
        placeholder="رمزورود"
        clearable
        show-password,
      ).mb-2
        template(#prepend)
          icon(name="teenyicons:password-outline" size="15px" ).text-sky-600
      el-button(type="primary" :loading="loading" @click="handleSubmit").w-full ثبت نام
        template(#loading)
          icon(name="svg-spinners:90-ring-with-bg" size="22px" ).mx-4
      el-divider یا
      el-button().w-full ورود به حساب کاربری
</template>
