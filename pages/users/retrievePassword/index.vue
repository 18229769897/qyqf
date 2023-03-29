<template>
	<view class="page-box">
		<view class="main f1 fx fx-col">
			<view class="form-item">
				<view class="title">手机号码：</view>
				<tui-input placeholder="请输入手机号码" type="number" maxlength="11" v-model="account"></tui-input>
			</view>
			<view class="form-item">
				<view class="title">设置登录密码：</view>
				<tui-input placeholder="设置登录密码" type="password" v-model="password"></tui-input>
			</view>
			
			<view class="form-item">
				<view class="title">确认密码：</view>
				<tui-input placeholder="再次输入登录密码" type="password" v-model="confirm_pwd"></tui-input>
			</view>

			<view class="form-item">
				<view class="title">短信验证码：</view>
				<tui-input placeholder="请输入短信验证码" maxlength="6" v-model="captcha">
					<template slot="right">
						<view v-if="disabled">{{text}}</view>
						<view v-else @click="code">获取验证码</view>
					</template>
				</tui-input>
			</view>
			<view class="btn-red w_100" style="margin-top: 80rpx;" @click="registerReset">确定</view>

			<!-- <view class="mt-auto text-center">
				<protocol ref="protocol1">
					<view @click.stop="toPage(`/pages/news_details/index?id=2`)">《用户隐私协议》</view>
				</protocol>
			</view> -->
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		registerVerify,
		registerForget,
		getCodeApi,
		getCaptcha
	} from "@/api/user";
	import {
		validatorDefaultCatch
	} from "@/utils/dialog";
	import attrs, {
		required,
		alpha_num,
		chs_phone
	} from "@/utils/validate";
	import { configMap } from '@/utils';

	export default {
		name: "RetrievePassword",
		mixins: [sendVerifyCode],
		data: function() {
			return {
				account: "",
				password: "",
				confirm_pwd: "",
				captcha: "",
				codeKey: "",
				codeUrl: "",
				codeVal: "",
				isShowCode: false,
			};
		},
		computed: configMap(['login_logo']),
		onReady() {
		},
		mounted: function() {
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			again() {
				this.codeUrl =
					VUE_APP_API_URL + "/captcha?" + this.keyCode + Date.parse(new Date());
				console.log(this.codeUrl);
			},

			async code() {
				let that = this;

				if (!that.account) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});

				await registerVerify({
						phone: that.account,
						type: 'change_pwd',
						key: that.codeKey,
						code: that.codeVal,
					})
					.then(res => {

						that.$util.Tips({
							title: res.message
						});
						that.sendCode();
					}).catch(res => {
						console.log(res, 'res')
						that.getcaptcha();
						that.$util.Tips({
							title: res
						});
					});

			},

			getcaptcha() {
				let that = this
				getCaptcha().then(data => {
					that.codeUrl = data.data.captcha; //图片路径
					that.codeVal = data.data.code; //图片验证码
					that.codeKey = data.data.key //图片验证码key
				})
				that.isShowCode = true;
			},
			async registerReset() {
				var that = this;
				if (!that.account) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if (that.password == '123456') return that.$util.Tips({
					title: '您输入的密码过于简单'
				});
				if (that.password != that.confirm_pwd) return that.$util.Tips({
					title: '两次密码不一致'
				});
				if (!that.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				registerForget({
						phone: that.account,
						sms_code: that.captcha,
						pwd: that.password,
						confirm_pwd: that.confirm_pwd
					})
					.then(res => {
						that.$msg.succ(res.message,()=>{
							that.back();
						});
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						})
					});
			},
		}
	};
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
