<template>
	<view :style="viewColor">
		<view class="navTabBox">
			<view class="longTab">
				<view class="tab-item" v-for="(item,index) in tabList" :key="index" :class="{'on':index == tabIndex}"
					@click="bindTab(index)"><text>{{item.title}}</text></view>
			</view>
		</view>
		<view class="main">
			<view v-show="tabIndex==0">
				<view class="form-item">
					<view class="title">充值数量：</view>
					<tui-input placeholder="请输入充值数量" type="number" v-model="num"></tui-input>
					<payType :list="[`now_money`]" :payType.sync="payType"></payType>
					<view style="margin-top: 50rpx;padding-left: 30rpx;">
						<view class="btn-red" @click="recharge">立即充值</view>
					</view>
				</view>
			</view>

			<view v-show="tabIndex==1">
				<view class="form-item">
					<view class="title">接收方手机号码：</view>
					<tui-input placeholder="请输入接收方手机号码" type="number" v-model="form.phone"></tui-input>
				</view>
				<view class="form-item">
					<view class="title">转赠数量：</view>
					<tui-input placeholder="请输入转增数量" type="number" v-model="form.count"></tui-input>
				</view>
				<view style="margin-top: 50rpx;padding-left: 30rpx;">
					<view class="btn-red" @click="give">立即转赠</view>
				</view>
			</view>
		</view>
		<pay2 :show.sync="show2" @finish="$emit(`finish`,$event)" @close="$off(`finish`)" ref="pay2"></pay2>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import { rechargeWechat2, giveHjqApi } from "@/api/user.js";
	export default {
		data() {
			return {
				tabIndex: 0,
				show1: true,
				show2: false,
				num: "",
				payType: "now_money",
				tabList: [{
						title: '充值'
					},
					{
						title: '转赠'
					}
				],
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
			this.tabIndex = options.type || 0;
		},
		methods: {
			/**
			 * 焕际值充值
			 */
			async recharge() {
				if (!this.num) return this.$msg.fail("请输入充值数量");
				let params = {
					price: this.num,
					type: this.payType,
					check_type: 3,
				}
				if (params.type == "now_money") {
					this.show2 = true;
					this.$on("finish", pwd => {
						params.pay_pwd = pwd;
						this.payment(params);
					});
					return
				}
				this.payment(params);
			},

			async payment(params) {
				try {
					let { message, data } = await rechargeWechat2(params);
					if (params.type == "now_money") {
						this.$store.dispatch("USERINFO");
						this.$msg.succ("购买成功", () => {
							this.show2 = false
						});
					} else {
						await this.appPay(data.data, params.type);
						this.$store.dispatch("USERINFO");
						this.$msg.succ("购买成功");
					}
				} catch (e) {
					console.log(e);
					return this.$msg.fail(e);
				} finally {
					if (params.type == "now_money") {
						this.$refs.pay2.offLock();
					}
				}
			},

			/**
			 * 焕际值转赠
			 */
			async give() {
				let f = this.form;
				if (!/1\d{10}/.test(f.phone)) return this.$msg.fail("请输入正确的手机号码");
				if (!f.count) return this.$msg.fail("请输入转赠数量");
				if (Number(f.count) > this.userInfo.ticket) return this.$msg.fail("焕际券余额不足");
				if (!(await this.$msg.alert("是否确定转赠焕际券"))) return;
				try {
					let { message } = await giveHjqApi(f);
					this.$store.dispatch("USERINFO");
					this.$msg.succ(message);
				} catch (e) {
					console.log(e);
					return this.$msg.fail(e);
				}
			},


			bindTab(index) {
				this.tabIndex = index
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
