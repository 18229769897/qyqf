<template>
	<view>
		<view class="ChangePassword">
			<form @submit="editPwd" report-submit='true'>
				<view class="phone">当前手机号：{{phone}}</view>
				<view class="list">
					<view class="item" @click="upPay(1)">
						<input type='password' disabled placeholder='请输入6位支付密码' placeholder-class='placeholder' name="password"
							:value="password"></input>
					</view>
					<view class="item" @click="upPay(2)">
						<input type='password' disabled placeholder='确认支付密码' placeholder-class='placeholder' name="qr_password"
							:value="qr_password"></input>
					</view>
					<view class="item acea-row row-between-wrapper">
						<input type='number' placeholder='填写验证码' placeholder-class='placeholder' class="codeIput" name="captcha"
							:value="captcha"></input>
						<button class="code font-color" :class="disabled === true ? 'on' : ''" :disabled='disabled' @click="code">
							{{ text }}
						</button>
					</view>
				</view>
				<button form-type="submit" class="confirmBnt bg-color">确认修改</button>
			</form>
		</view>
		<u-keyboard tips=" " :safe-area-inset-bottom="true" :dot-enabled="false" @change="valChange" @backspace="backspace" v-model="show"
			:cancelBtn="false"></u-keyboard>
		<!-- #ifdef MP -->
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
		<!-- #endif -->
	</view>
</template>

<script>
	import sendVerifyCode from "@/mixins/SendVerifyCode.js";
	import {
		getUserInfo,
		registerVerify,
		changePayPwd,
		getLogout
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	export default {
		mixins: [sendVerifyCode],
		components: {
			// #ifdef MP
			authorize
			// #endif
		},
		data() {
			return {
				sel: "",
				show: false,
				userInfo: {},
				phone: '',
				password: '',
				captcha: '',
				qr_password: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false //是否隐藏授权
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad() {
			if (this.isLogin) {
				this.getUserInfo();
			} else {
				// #ifdef H5 || APP-PLUS
				toLogin();
				// #endif 
				// #ifdef MP
				this.isAuto = true;
				this.$set(this, 'isShowAuth', true)
				// #endif
			}
		},
		methods: {
			upPay(flag) {
				this.show = true;
				this.sel = flag;
			},
			valChange(val) {
				if (this.sel == 1) {
					if (this.password.length < 6) {
						this.password += val;
					}
				}
				if (this.sel == 2) {
					if (this.qr_password.length < 6) {
						this.qr_password += val;
					}
				}
			},
			backspace() {
				if (this.sel == 1) {
					if (this.password.length) {
						this.password = this.password.substr(0, this.password.length - 1);
					}
				}
				if (this.sel == 2) {
					if (this.qr_password.length) {
						this.qr_password = this.qr_password.substr(0, this.qr_password.length - 1);
					}
				}
			},
			/**
			 * 授权回调
			 */
			onLoadFun: function(e) {
				this.isShowAuth = false;
				this.getUserInfo();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					let tel = res.data.phone;
					let phone = tel.substr(0, 3) + "****" + tel.substr(7);
					that.$set(that, 'userInfo', res.data);
					that.phone = phone;
				});
			},
			/**
			 * 发送验证码
			 * 
			 */
			async code() {
				let that = this;
				if (!that.userInfo.phone) return that.$util.Tips({
					title: '手机号码不存在,无法发送验证码！'
				});
				await registerVerify({
						phone: this.userInfo.phone,
						type: "change_pay_pwd"
					})
					.then(res => {
						that.$util.Tips({
							title: res.msg
						});
						that.sendCode();
						uni.showToast({
							title: "短信发送成功"
						})
					}).catch(err => {
						return that.$util.Tips({
							title: err
						});
					});
			},
			/**
			 * H5登录 修改密码
			 * 
			 */
			editPwd: function(e) {
				let that = this,
					password = e.detail.value.password,
					qr_password = e.detail.value.qr_password,
					captcha = e.detail.value.captcha;
				if (!password) return that.$util.Tips({
					title: '请输入新密码'
				});
				if (qr_password != password) return that.$util.Tips({
					title: '两次输入的密码不一致！'
				});
				if (!captcha) return that.$util.Tips({
					title: '请输入验证码'
				});
				changePayPwd({
					phone: that.userInfo.phone,
					sms_code: e.detail.value.captcha,
					pwd: e.detail.value.password,
					confirm_pwd: e.detail.value.qr_password,
				}).then(res => {
					this.$store.dispatch("USERINFO");
					this.$msg.succ("修改成功", () => {
						this.toTabPage("/pages/index/index");
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}

	.ChangePassword .phone {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 55rpx;
	}

	.ChangePassword .list {
		width: 580rpx;
		margin: 53rpx auto 0 auto;
	}

	.ChangePassword .list .item {
		width: 100%;
		height: 110rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.ChangePassword .list .item input {
		width: 100%;
		height: 100%;
		font-size: 32rpx;
	}

	.ChangePassword .list .item .placeholder {
		color: #b9b9bc;
	}

	.ChangePassword .list .item input.codeIput {
		width: 340rpx;
	}

	.ChangePassword .list .item .code {
		font-size: 32rpx;
		background-color: #fff;
	}

	.ChangePassword .list .item .code.on {
		color: #b9b9bc !important;
	}

	.ChangePassword .confirmBnt {
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		color: #fff;
		margin: 92rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;
	}
</style>
