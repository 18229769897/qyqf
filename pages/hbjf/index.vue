<template>
	<view :style="viewColor">
		<view class="main">
			<view class="form-item">
				<view class="title">接收方手机号码：</view>
				<tui-input placeholder="请输入接收方手机号码" type="number" v-model="form.phone"></tui-input>
			</view>
			<view class="form-item">
				<view class="title">转赠数量：</view>
				<tui-input placeholder="请输入充值数量" type="number" v-model="form.count"></tui-input>
			</view>
			<view style="margin-top: 50rpx;padding-left: 30rpx;">
				<view class="btn-red" @click="give">立即转赠</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import { rechargeWechat2, giveHaiHui,giveHbjfApi } from "@/api/user.js";
	export default {
		data() {
			return {
				show1: true,
				show2: false,
				num: "",
				payType: "weixin",
				form: {
					phone: "",
					count: ""
				}
			};
		},
		computed: {
			...mapGetters(["viewColor", "userInfo"])
		},
		onLoad(options) {
			
		},
		methods: {

			/**
			 * 红包积分转赠
			 */
			async give() {
				let f = this.form;
				if (!/1\d{10}/.test(f.phone)) return this.$msg.fail("请输入正确的手机号码");
				if (!f.count) return this.$msg.fail("请输入转赠数量");
				if (Number(f.count) > this.userInfo.wait_released) return this.$msg.fail("红包积分余额不足");
				if (!(await this.$msg.alert("是否确定转赠红包积分"))) return;
				try {
					let { message } = await giveHbjfApi(f);
					this.$store.dispatch("USERINFO");
					this.$msg.succ(message);
				} catch (e) {
					return this.$msg.fail(e);
				}
			},
		},
	}
</script>

<style scoped lang="scss">
	.navTabBox {
		background: #fff;
		height: 90rpx;
	}

	.longTab {
		display: flex;
		text-align: center;
	}

	.tab-item {
		width: 50%;
		display: inline-block;
		line-height: 90rpx;

		text {
			position: relative;
			display: inline-block;
		}
	}

	.tab-item.on {
		color: var(--view-theme);

		text {
			&:after {
				content: "";
				display: inline-block;
				width: 90%;
				height: 3rpx;
				background-color: var(--view-theme);
				position: absolute;
				left: 5%;
				bottom: 0;
			}
		}
	}

	.main {
		background-color: #fff;
		width: 700rpx;
		margin-left: auto;
		margin-right: auto;
		margin-top: 50rpx;
		padding: 40rpx 40rpx 40rpx 10rpx;
		border-radius: 16rpx;
		box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.04);
	}

	.title {
		padding-left: 26rpx;
		font-size: 30rpx;
	}

	.form-item+.form-item {
		margin-top: 46rpx;
	}
</style>
