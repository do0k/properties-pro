<script lang="ts" setup>
definePageMeta({
	layout: "auth",
	auth: {
		unauthenticatedOnly: true,
		navigateAuthenticatedTo: "/",
	},
});
useHead({
	title: "ورود به سیستم",
});
const { signIn } = useAuth();
const code = ref("");
const mobile = ref("");
const otp = ref("");
const otpSent = ref(false);
const otpDisabled = ref(false);
const time = ref();
const timeLeft = ref(0);
const minLeft = ref(0);
const secLeft = ref(0);
const otpInput = ref<null | HTMLInputElement>(null);
const codeInput = ref<null | HTMLInputElement>(null);
const mobileInput = ref<null | HTMLInputElement>(null);
const loading = ref<boolean>(false);

const sendOtp = async (e: Event) => {
	e.preventDefault();
	const { data, error } = await useSend<{ message: string }, any>(
		"/api/otp/create",
		{
			method: "POST",
			body: {
				mobile: mobile.value,
				code: code.value,
			},
		}
	);
	err(error);
	if (msg(data)) {
		otpSent.value = true;
		otpInput.value?.focus();
		time.value = new Date(data.value?.expire);
		timeLeft.value = (time.value.getTime() - new Date().getTime()) / 1000;
		setInterval(() => {
			if (timeLeft.value > 1) {
				timeLeft.value = (time.value.getTime() - new Date().getTime()) / 1000;
			} else {
				otpDisabled.value = true;
				otpSent.value = false;
				mobileInput.value?.focus();
				time.value = new Date(data.value?.expire);
				timeLeft.value = (time.value.getTime() - new Date().getTime()) / 1000;
			}
		}, 1000);
	}
};

const login = async (e: Event) => {
	e.preventDefault();
	loading.value = true;
	try {
		const { error, url, ok } = await signIn("otp-auth", {
			code: code.value,
			otp: otp.value,
			redirect: false,
			callbackUrl: undefined,
		});
		if (error) {
			ElMessage({
				message: "مقادیر وارد شده اشتباه است",
				grouping: true,
				type: "error",
			});
			codeInput.value?.focus();
		} else {
			ElMessage({
				message: "شما با موفقیت وارد سیستم شدید",
				grouping: true,
				type: "success",
			});
		}
		if (ok && url) {
			const route = getRouteFromUrl(url);
			await navigateTo(route === "/auth/login" ? "/" : route, {
				replace: true,
				redirectCode: 301,
			});
		}
	} catch (e) {}
	loading.value = false;
};
</script>

<template lang="pug">
.flex.flex-col.items-center.font-yekan
  el-card
    el-bar(title="ورود به سیستم" icon="teenyicons:lock-outline" icon-size="15px" )
    .max-w-md.mt-3
      el-input(
        v-model="code"
        ref="codeInput"
        name="code"
        type="text"
        placeholder="کدملی"
        clearable
        autofocus,
      ).mb-2.font-yekan
        template(#prepend)
          //- icon(name="teenyicons:user-outline" size="15px" ).text-sky-600
          .text-sky-600.i-teenyicons-user-outline
      el-input(
        v-model="mobile"
        ref="mobileInput"
        name="mobile"
        type="text"
        placeholder="شماره موبایل"
        clearable
        autofocus,
        @keydown.enter="sendOtp"
      ).mb-2.font-yekan
        template(#prepend)
          //- icon(name="teenyicons:user-outline" size="15px" ).text-sky-600
          .text-sky-600.i-teenyicons-mobile-outline
        template(#append)
          el-button(v-if="!otpSent" type="primary" @click="sendOtp").text-sky-600 ارسال کد
          span(v-else).text-sky-600.mono {{ String(Math.floor((timeLeft / 60) % 60)).padStart(2, '0') }}:{{ String(Math.floor(timeLeft % 60)).padStart(2, '0') }}
      Transition(name="fade")
        el-input(
          v-show="otpSent"
          v-model="otp"
          ref="otpInput"
          type="text"
          name="otp"
          placeholder="کد تایید"
          clearable
          @keydown.enter="login"
        ).mb-2
          template(#prepend)
            //- icon(name="teenyicons:password-outline" size="15px" ).text-sky-600
            .text-sky-600.i-teenyicons-password-outline
      el-button(type="primary" :loading="loading" @click="login").w-full ورود به سیستم
        template(#loading)
          //- icon(name="svg-spinners:90-ring-with-bg" size="22px" ).mx-4
          .mx-4.i-svg-spinners-90-ring-with-bg
    //- el-divider یا
    //- el-button().w-full بازیابی رمزورود
</template>
