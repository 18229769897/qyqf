<template>
	<view class="page-box">
		<view class="main fx fx-col">
			<view class="form-item">
				<view class="title">手机号码：</view>
				<tui-input placeholder="请输入手机号码" type="number" maxlength="11" v-model="phone"></tui-input>
			</view>
			<view class="form-item">
				<view class="title">短信验证码：</view>
				<tui-input placeholder="请输入短信验证码" maxlength="6" v-model="sms_code">
					<template slot="right">
						<view v-if="disabled">{{text}}</view>
						<view v-else @click="getCode">获取验证码</view>
					</template>
				</tui-input>
			</view>
			<view class="form-item">
				<view class="title">登录密码：</view>
				<tui-input placeholder="请输入登录密码" type="password" v-model="password"></tui-input>
			</view>

			<view class="form-item">
				<view class="title">确认登录密码：</view>
				<tui-input placeholder="请再次输入登录密码" type="password" v-model="rePassword"></tui-input>
			</view>

			<view class="form-item">
				<view class="title">填写地址：</view>
				<tui-input placeholder="点击选择地址" disabled @click="show = true"
					:value="address.province?`${address.province},${address.city},${address.district},${address.street}`:''"></tui-input>
			</view>

			<view class="form-item">
				<view class="title">推荐人：</view>
				<tui-input placeholder="请输入推荐人手机号码" type="number" maxlength="11" v-model="spread"></tui-input>
			</view>

			<view class="btn-red w_100" style="margin-top: 80rpx;" @click="userRegister">注册</view>

			<addrList :show.sync="show" v-model="address" />

			<view class="text-center" style="margin-top: 40rpx;">
				<protocol ref="protocol1">
					<view @click.stop="toPage(`/pages/news_details/index?id=152`)">《用户隐私协议》</view>
					<view @click.stop="toPage(`/pages/news_details/index?id=156`)">《焕际优选用户服务协议》</view>
				</protocol>
			</view>
		</view>
	</view>
</template>
<script>
	import { registerVerify, register } from "@/api/user.js";
	import SendVerifyCode from "@/mixins/SendVerifyCode.js";
	export default {
		data() {
			return {
				phone: "",
				sms_code: "",
				password: "",
				rePassword: "",
				spread: "",
				address: {
					province: "", //省
					city: "", // 市
					district: "", // 区
					street: "", // 街道
				},
				show: false,
			}
		},
		mixins: [SendVerifyCode],
		onLoad() {

		},
		methods: {
			async userRegister() {
				if (!this.$refs.protocol1.checked) return this.$msg.fail("请勾选用户协议");
				if (!this.phone) return this.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.phone)) return this.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if (!this.sms_code) return this.$util.Tips({
					title: '请填写验证码'
				});
				if (!/^[\w\d]+$/i.test(this.sms_code)) return this.$util.Tips({
					title: '请输入正确的验证码'
				});
				if (!this.password) return this.$util.Tips({
					title: '请填写密码'
				});

				if (this.password != this.rePassword) {
					return this.$util.Tips({
						title: '两次密码不一致'
					});
				}

				if (!this.spread) {
					return this.$msg.fail("请输入推荐人手机号");
				}
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(this.spread)) {
					return this.$msg.fail("推荐人手机号格式错误");
				}

				if (!this.address.province) return this.$msg.fail("请选择地址");

				register({
						phone: this.phone,
						sms_code: this.sms_code,
						pwd: this.password,
						confirm_pwd: this.rePassword,
						spread: this.spread,
						...this.address,
					})
					.then(res => {
						uni.showToast({
							title: "注册成功",
						})
						let data = res.data;
						this.$store.commit("LOGIN", {
							'token': data.token,
							'time': data.exp
						});
						this.$store.commit("SETUID", data.user.uid);
						this.$store.commit('UPDATE_USERINFO', data.user);
						setTimeout(() => {
							uni.reLaunch({
								url: "/pages/user/index"
							})
						}, 800)
					})
					.catch(res => {
						this.$util.Tips({
							title: res
						});
					});
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
						type: "register"
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
