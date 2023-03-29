<template>
	<view class="page-box">
		<view class="main f1 fx fx-col">
			<view class="form-item">
				<view class="title">手机号码：</view>
				<tui-input placeholder="请输入手机号码" type="number" maxlength="11" v-model="phone"></tui-input>
			</view>
			<view class="form-item" v-show="loginType==`pwd`">
				<view class="title">密码：</view>
				<tui-input placeholder="请输入登录密码" type="password" v-model="password"></tui-input>
			</view>

			<view class="form-item" v-show="loginType==`authCode`">
				<view class="title">短信验证码：</view>
				<tui-input placeholder="请输入短信验证码" maxlength="6" v-model="code">
					<template slot="right">
						<view v-if="disabled">{{sec}}s</view>
						<view v-else @click="getCode">获取验证码</view>
					</template>
				</tui-input>
			</view>

			<view class="fx j-between" style="margin-top: 30rpx;padding: 0 30rpx;">
				<view @click="toPage(`/pages/users/register/index`)" v-if="$env.isDev">注册</view>
				<view @click="toPage(`/pages/users/retrievePassword/index`)">忘记密码</view>
			</view>
			<view class="btn-red w_100" style="margin-top: 80rpx;" @click="login">登录</view>
			<view class="fx-center" style="font-size: 30rpx;margin-top: 40rpx;color: #4f4f4f;">
				<view v-if="loginType==`authCode`" @click="loginType=`pwd`">密码登录</view>
				<view v-if="loginType==`pwd`" @click="loginType=`authCode`">短信登录</view>
			</view>

			<view class="mt-auto text-center">
				<protocol ref="protocol1">
					<view @click.stop="toPage(`/pages/news_details/index?id=152`)">《用户隐私协议》</view>
				</protocol>
			</view>
		</view>
	</view>
</template>
<script>
	import { getCodeApi, registerVerify, loginH5 as pwdLoginApi, loginMobile as authodeLoginApi, getUserInfo } from "@/api/user.js";
	import SendVerifyCode from "@/mixins/SendVerifyCode.js"
	const BACK_URL = "login_back_url";
	export default {
		data() {
			return {
				phone: "",
				code: "",
				password: "",
				loginType: "pwd",
				status: "close",
				clickLock: false
			}
		},
		mixins: [SendVerifyCode],
		onLoad() {

		},
		methods: {
			login() {
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
					return this.$msg.fail("请输入正确的手机号码");
				}
				if (!this.$refs.protocol1.checked) return this.$msg.fail("请先同意隐私政策");
				if (this.loginType == "pwd") {
					this.pwdLogin();
				} else {
					this.authcodeLogin()
				}
			},
			/**
			 * 手机号-密码登录
			 */
			async pwdLogin() {
				if (!this.password) {
					return this.$msg.fail("请输入登录密码");
				}
				let params = {
					account: this.phone,
					password: this.password,
				}
				try {
					let { data } = await pwdLoginApi(params);
					this.$store.commit("LOGIN", {
						'token': data.token,
						'time': data.expires_time - this.$Cache.time()
					});
					let res = await getUserInfo();
					this.$store.commit("SETUID", res.data.uid);
					this.$store.commit("UPDATE_USERINFO", res.data);
					uni.reLaunch({
						url: "/pages/index/index"
					});
				} catch (e) {
					return this.$msg.fail(e);
				} finally {

				}
			},

			/**
			 * 手机号-短信验证码登录
			 */
			async authcodeLogin() {
				if (!this.code) {
					return this.$msg.fail("请输入验证码");
				}
				let params = {
					phone: this.phone,
					sms_code: this.code,
				}
				try {
					let { data } = await authodeLoginApi(params);
					this.$store.commit("LOGIN", {
						'token': data.token,
						'time': data.expires_time - this.$Cache.time()
					});
					let res = await getUserInfo();
					this.$store.commit("SETUID", res.data.uid);
					this.$store.commit("UPDATE_USERINFO", res.data);
					
	
					uni.reLaunch({
						url: "/pages/index/index"
					});
				} catch (e) {
					return this.$msg.fail(e);
				} finally {

				}
			},

			/**
			 * 发送短信验证码
			 */
			async getCode() {
				if (!this.phone) {
					return this.$msg.fail("请填写手机号");
				}
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
					return this.$msg.fail("请输入正确的手机号码");
				}
				try {
					let params = {
						code: "",
						key: "",
						phone: this.phone,
						type: "login"
					}
					let { message, status } = await registerVerify(params);
					if (status == 200) {
						this.$msg.succ(message);
						this.sendCode();
					}
				} catch (e) {
					return this.$msg.fail(e);
				}
			}
		}
	}
</script>

<style>
	page,
	.page-box {
		height: 100vh;
	}

	.page-box {
		background-image: url(@/static/images/login-background.png);
		background-color: #F6F6F6;
		background-size: 750rpx 440rpx;
		background-repeat: no-repeat;
		display: flex;
		flex-direction: column;
		padding: 266rpx 20rpx 130rpx;
	}

	.main {
		background-color: #FFFFFF;
		border-radius: 30rpx;
		padding: 50rpx 30rpx 30rpx;
	}

	.title {
		padding-left: 26rpx;
		font-size: 30rpx;
	}

	.form-item+.form-item {
		margin-top: 46rpx;
	}

	.btn-disable {
		opacity: 0.5;
	}
</style>
