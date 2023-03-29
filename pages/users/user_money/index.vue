<template>
	<view>
		<view class="yue-box">
			<view class="status-bar-24"></view>
			<view class="flex align-center" style="padding:0 30rpx;">
				<image src="@/static/images/returntag2.png" @click="back" style="width: 36rpx;" mode="widthFix"></image>
				<u-icon name="order" size="60" class="ml-auto" @click.native="toPage(`/pages/users/user_money/bill?type=1`)"></u-icon>
			</view>
			<view class="" style="padding-left: 32rpx;margin-top: 60rpx;">
				<view class="fz_34">当前余额</view>
				<view class="fz_60" style="margin-top: 10rpx;">{{userInfo.now_money || 0}}</view>
				<view class="btn text-red" @click="toPage(`/pages/users/user_payment/index`,`isRealName`)">充值</view>
			</view>
		</view>
		<view class="wallet-list text-red">
			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/btqb.png" style="width: 90rpx;" mode="widthFix"></image>
				<view style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>补贴钱包</view>
					<view class="fz_34">{{userInfo.brokerage_price || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=2`)">查看明细</view>
					<view class="flex align-center realtive" @click="butieHandle.show=true">
						<view class="fz_32">去操作</view>
						<u-icon name="play-right-fill" size="26" color="#0f734f"></u-icon>
						<menuList :list="butieHandle.list" offsetX="-30rpx" v-model="butieHandle.type" :show.sync="butieHandle.show">
							<template slot-scope="{item}">
								<view class="item">{{item.label}}</view>
							</template>
						</menuList>
					</view>
				</view>
			</view>
			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/dsf.png" style="width: 90rpx;" mode="widthFix"></image>
				<view class="realtive" style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>红包积分</view>
					<view class="fz_34">{{userInfo.wait_released || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=3`)">查看明细</view>
					<view class="flex align-center  realtive" @click="hbjfHandle.show=true">
						<view class="fz_32">去操作</view>
						<u-icon name="play-right-fill" size="26" color="#0f734f"></u-icon>
						<menuList :list="hbjfHandle.list" offsetX="-60rpx" v-model="hbjfHandle.type" :show.sync="hbjfHandle.show">
							<template slot-scope="{item}">
								<view class="item">{{item.label}}</view>
							</template>
						</menuList>
					</view>
				</view>
			</view>
			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/hjz.png" style="width: 90rpx;" mode="widthFix"></image>
				<view class="realtive" style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>焕际值</view>
					<view class="fz_34">{{userInfo.coupons || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=4`)">查看明细</view>
					<view class="flex align-center  realtive" @click="hjzHandle.show=true">
						<view class="fz_32">去操作</view>
						<u-icon name="play-right-fill" size="26" color="#0f734f"></u-icon>
						<menuList :list="hjzHandle.list" offsetX="-50rpx" v-model="hjzHandle.type" :show.sync="hjzHandle.show">
							<template slot-scope="{item}">
								<view class="item">{{item.label}}</view>
							</template>
						</menuList>
					</view>
				</view>
			</view>
			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/hjq.png" style="width: 90rpx;" mode="widthFix"></image>
				<view class="realtive" style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>焕际券</view>
					<view class="fz_34">{{userInfo.ticket || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=10`)">查看明细</view>
					<view class="flex align-center  realtive" @click="hjqHandle.show=true">
						<view class="fz_32">去操作</view>
						<u-icon name="play-right-fill" size="26" color="#0f734f"></u-icon>
						<menuList :list="hjqHandle.list" offsetX="-50rpx" v-model="hjqHandle.type" :show.sync="hjqHandle.show">
							<template slot-scope="{item}">
								<view class="item">{{item.label}}</view>
							</template>
						</menuList>
					</view>
				</view>
			</view>
			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/hjd.png" style="width: 90rpx;" mode="widthFix"></image>
				<view class="realtive" style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>嗨豆</view>
					<view class="fz_34">{{userInfo.bean || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=11`)">查看明细</view>
				</view>
			</view>
			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/hwp.png" style="width: 90rpx;" mode="widthFix"></image>
				<view class="realtive" style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>嗨票</view>
					<view class="fz_34">{{userInfo.haiwen || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=12`)">查看明细</view>
					<view class="flex align-center realtive" @click="haipiaoHandle.show=true">
						<view class="fz_32">去操作</view>
						<u-icon name="play-right-fill" size="26" color="#0f734f"></u-icon>
						<menuList :list="haipiaoHandle.list" offsetX="-20rpx" v-model="haipiaoHandle.type" :show.sync="haipiaoHandle.show">
							<template slot-scope="{item}">
								<view class="item">{{item.label}}</view>
							</template>
						</menuList>
					</view>
				</view>
			</view>

			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/haiquan.png" style="width: 90rpx;" mode="widthFix"></image>
				<view class="realtive" style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>嗨券</view>
					<view class="fz_34">{{userInfo.hi_coupon || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=13`)">查看明细</view>
				</view>
			</view>

			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/spjf.png" style="width: 90rpx;" mode="widthFix"></image>
				<view style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>商品积分</view>
					<view class="fz_34">{{userInfo.buy_points || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=9`)">查看明细</view>
					<view class="flex align-center  realtive" @click="spjfHandle.show=true">
						<view class="fz_32">去操作</view>
						<u-icon name="play-right-fill" size="26" color="#0f734f"></u-icon>
						<menuList :list="spjfHandle.list" offsetX="-60rpx" v-model="spjfHandle.type" :show.sync="spjfHandle.show">
							<template slot-scope="{item}">
								<view class="item">{{item.label}}</view>
							</template>
						</menuList>
					</view>
				</view>
			</view>
			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/xfjf.png" style="width: 90rpx;" mode="widthFix"></image>
				<view style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>消费积分</view>
					<view class="fz_34">{{userInfo.integral || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=5`)">查看明细</view>
				</view>
			</view>
			<!-- <view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/axjf.png" style="width: 90rpx;" mode="widthFix"></image>
				<view style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>爱心积分</view>
					<view class="fz_34">{{userInfo.love_points || 0}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=6`)">查看明细</view>
				</view>
			</view> -->
			<view class="wallet-item flex align-center border-bottom">
				<image src="@/static/images/hjz.png" style="width: 90rpx;" mode="widthFix"></image>
				<view class="realtive" style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>代理商钱包</view>
					<view class="fz_34">{{userInfo.money_dl}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=7`)">查看明细</view>
					<view class="flex align-center  realtive" @click="dlsHandle.show=true">
						<view class="fz_32">去操作</view>
						<u-icon name="play-right-fill" size="26" color="#0f734f"></u-icon>
						<menuList :list="dlsHandle.list" offsetX="-50rpx" v-model="dlsHandle.type" :show.sync="dlsHandle.show">
							<template slot-scope="{item}">
								<view class="item">{{item.label}}</view>
							</template>
						</menuList>
					</view>
				</view>
			</view>

			<view class="wallet-item flex align-center" v-if="userInfo.service && userInfo.service.is_verify">
				<image src="@/static/images/hjz.png" style="width: 90rpx;" mode="widthFix"></image>
				<view class="realtive" style="width: 200rpx;margin-left: 50rpx;color: #666666;">
					<view>商户钱包</view>
					<view class="fz_34">{{userInfo.mer_money}}</view>
				</view>
				<view class="flex flex_1 align-center justify-between">
					<view @click="toPage(`/pages/users/user_money/bill?type=8`)">查看明细</view>
					<view class="flex align-center realtive" @click="storeHandle.show=true">
						<view class="fz_32">去操作</view>
						<u-icon name="play-right-fill" size="26" color="#0f734f"></u-icon>
						<menuList :list="storeHandle.list" offsetX="-50rpx" v-model="storeHandle.type" :show.sync="storeHandle.show">
							<template slot-scope="{item}">
								<view class="item">{{item.label}}</view>
							</template>
						</menuList>
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="show2" show-cancel-button title="商品积分兑换补贴钱包" @confirm="commit" async-close>
			<view>
				<view class="content">
					<input type="number" v-model="count" class="text-center fz_34" placeholder-style="font-size:28rpx" placeholder="请输入参与兑换的商品积分数量">
				</view>
				<view class="text-center fz_26" style="color: red;margin-bottom: 20rpx;">1商品积分={{buy_points_exchange_rate}}补贴钱包</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import { buyPointsExchangeConfigApi, buyPointsExchangeApi } from "@/api/user.js";
	export default {
		data() {
			return {
				show2: false,
				buy_points_exchange_rate: 0,
				count: "",
				// 补贴钱包操作
				butieHandle: {
					show: false,
					type: {},
					list: [
						{ label: "结算" },
						{ label: "结算记录" },
					]
				},

				// 焕际值操作
				hjzHandle: {
					show: false,
					type: {},
					list: [
						{ label: "焕际值充值" },
						{ label: "焕际值转赠" },
					]
				},

				// 焕际券操作
				hjqHandle: {
					show: false,
					type: {},
					list: [
						{ label: "焕际券充值" },
						{ label: "焕际券转赠" },
					]
				},

				// 嗨票操作
				haipiaoHandle: {
					show: false,
					type: {},
					list: [
						{ label: "嗨票兑换" },
					]
				},

				// 红包积分操作
				hbjfHandle: {
					show: false,
					type: {},
					list: [
						{ label: "红包积分转赠" },
					]
				},


				// 商品积分操作
				spjfHandle: {
					show: false,
					type: {},
					list: [
						{ label: "兑换补贴钱包" },
					]
				},

				// 代理商钱包操作
				dlsHandle: {
					show: false,
					type: {},
					list: [
						{ label: "结算" },
						{ label: "结算记录" },
					]
				},

				// 商户钱包操作
				storeHandle: {
					show: false,
					type: {},
					list: [
						{ label: "结算" },
						{ label: "结算记录" },
					]
				},
			}
		},
		watch: {
			"hjzHandle.type": {
				handler(val) {
					switch (val.index) {
						case 0:
							this.toPage("/pages/coupons/index?type=0");
							break
						case 1:
							this.toPage("/pages/coupons/index?type=1");
							break
					}
				}
			},

			"hjqHandle.type": {
				handler(val) {
					switch (val.index) {
						case 0:
							this.toPage("/pages/users/hjq/index?type=0");
						case 1:
							this.toPage("/pages/users/hjq/index?type=1");
							break
					}
				}
			},

			"haipiaoHandle.type": {
				handler(val) {
					switch (val.index) {
						case 0:
							this.toPage("/pages/haipiao/exchange");
					}
				}
			},

			"butieHandle.type": {
				async handler(val) {
					switch (val.index) {
						case 0:
							if (!this.userInfo.is_reals_ok) {
								if (!(await this.$msg.alert("请先上传身份证正反面照片"))) return;
								this.toPage(`/pages/user/autonyms`)
								return;
							}
							this.toPage(`/pages/users/user_cash/index`, `isRealName`);
							break
						case 1:
							this.toPage("/pages/withdrawRecord/index?type=1");
							break
					}
				}
			},

			"spjfHandle.type": {
				handler(val) {
					switch (val.index) {
						case 0:
							this.show2 = true;
							break
					}
				}
			},
			"dlsHandle.type": {
				handler(val) {
					switch (val.index) {
						case 0:
							this.toPage(`/pages/users/user_cash/dls`, `isRealName`);
							break
						case 1:
							this.toPage("/pages/withdrawRecord/index?type=6");
							break
					}
				}
			},
			"storeHandle.type": {
				handler(val) {
					switch (val.index) {
						case 0:
							this.toPage(`/pages/users/user_cash/store`, `isRealName`);
							break
						case 1:
							this.toPage("/pages/withdrawRecord/index?type=3");
							break
					}
				}
			},
			"hbjfHandle.type": {
				handler(val) {
					switch (val.index) {
						case 0:
							console.log(val);
							this.toPage(`/pages/hbjf/index`, `isRealName`);
							break
					}
				}
			}
		},
		computed: {
			...mapGetters(["userInfo"])
		},

		onLoad() {
			this.getConfig();
		},

		onShow() {
			
			this.$store.dispatch("USERINFO")
		},

		methods: {
			async getConfig() {
				let { data: { buy_points_exchange_rate } } = await buyPointsExchangeConfigApi();
				this.buy_points_exchange_rate = buy_points_exchange_rate;
			},

			async commit() {
				if (!this.count) return (this.$msg.fail("请输入要转换的商品积分数量"), setTimeout(() => this.show2 = false, 300));
				if (Number(this.count) > Number(this.userInfo.buy_points)) return (this.$msg.fail("商品积分余额不足"), setTimeout(() => { this.show2 = false, this.count = "" }, 300));
				try {
					let { message } = await buyPointsExchangeApi({ count: Number(this.count) });
					this.$msg.succ(message);
				} catch (e) {
					return this.$msg.fail(e);
				} finally {
					this.count = "";
					this.show2 = false
				}
			},
		}
	}
</script>

<style lang="scss">
	.yue-box {
		background-image: url(/static/images/wallet-bg.png);
		width: 750rpx;
		height: 505rpx;
		background-repeat: no-repeat;
		background-size: 100%;
		color: #fff;
	}

	.btn {
		background-color: #fff;
		width: 130rpx;
		height: 50rpx;
		border-radius: 100px;
		text-align: center;
		line-height: 50rpx;
		font-size: 32rpx;
		margin-top: 10rpx;
	}

	.wallet-list {
		background-color: #fff;
		padding: 0 32rpx;
	}

	.wallet-item {
		padding: 34rpx 0;
	}

	.border-bottom {
		border-bottom: 1rpx solid #ededed;
	}

	.content {
		padding: 30rpx 0;
		display: flex;
		justify-content: center;
	}
</style>
