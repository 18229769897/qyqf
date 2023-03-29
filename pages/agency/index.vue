<template>
	<view class="page-box">
		<view class="fill-bg"></view>
		<headBar2 title="代理商中心" white noText />
		<view class="header fx fx-col j-center" style="padding: 0 40rpx;">
			<view class="fx a-center">
				<view style="font-size: 32rpx;" v-if="status==200">代理收益</view>
				<view class="btn" v-if="status==2" @click="toPage(`./apply`)">去申请</view>
			</view>
			<view style="margin: 40rpx 0;" class="fx a-end" v-if="status==200">
				<text style="font-size: 56rpx;">{{item.income?parseFloat(item.income).toFixed(2):"0.00" }}</text> <text style="font-size: 34rpx; margin-left: 36rpx;margin-bottom: 4rpx;"></text>
			</view>
			<view v-if="status==2" style="font-size: 44rpx; line-height: 1.8;letter-spacing:6rpx;">暂未开通</view>
			<view v-if="status==3" style="font-size: 44rpx; line-height: 1.8;letter-spacing:6rpx;">申请审核中</view>
			<view class="money_data fx j-between a-center">
				<view @click="toPage(`/pages/agency/apply_record`)">申请记录</view>
				<view v-if="status==200" @click="toPage(`/pages/agency/detail`)">收益明细</view>
			</view>
		</view>

		<view class="main" v-if="status==200">
			<view class="card-box fx a-center">
				<image src="@/static/images/dllx.png" style="width: 70rpx; height: 70rpx;"></image>
				<view style="margin-left: 18rpx;">代理类型</view>
				<view class="money_number">{{ map[item.hjAgentUser.agentLevel] }}</view>
			</view>
			<view class="card-box fx a-center">
				<image src="@/static/images/dlqy.png" style="width: 70rpx; height: 70rpx;"></image>
				<view style="margin-left: 18rpx;">代理区域</view>
				<view class="money_number" v-if="item.hjAgentUser.agentLevel==1">{{item.hjAgentUser.province}}</view>
				<view class="money_number" v-if="item.hjAgentUser.agentLevel==2">{{item.hjAgentUser.province}} {{item.hjAgentUser.city}}
				</view>
				<view class="money_number" v-if="item.hjAgentUser.agentLevel==3">
					{{item.hjAgentUser.province}} {{item.hjAgentUser.city}} {{item.hjAgentUser.district}}
				</view>
				<view class="money_number fz_26" v-if="item.hjAgentUser.agentLevel==4">
					{{item.hjAgentUser.province}} {{item.hjAgentUser.city}} {{item.hjAgentUser.district}} {{item.hjAgentUser.street}}
				</view>
			</view>
			<view class="card-box fx a-center">
				<image src="@/static/images/qysl.png" style="width: 70rpx; height: 70rpx;"></image>
				<view style="margin-left: 18rpx;">区域数量</view>
				<view class="money_number">{{item.areaNumber}}人</view>
			</view>
			<view class="card-box fx a-center">
				<image src="@/static/images/qyyj.png" style="width: 70rpx; height: 70rpx;"></image>
				<view style="margin-left: 18rpx;">区域业绩</view>
				<view class="money_number">{{parseFloat(item.achievement).toFixed(2) }}</view>
			</view>

			<view class="card-box fx a-center">
				<image src="@/static/images/qyyj.png" style="width: 70rpx; height: 70rpx;"></image>
				<view style="margin-left: 18rpx;">今日区域业绩</view>
				<view class="money_number">{{parseFloat(item.achievementDay).toFixed(2) }}</view>
			</view>
		</view>
		<view v-else>
			<emptyPage title="您未开通代理商"></emptyPage>
		</view>
	</view>
</template>
<script>
	import { getProxyShopDetailApi } from '@/api/javaApi.js';
	export default {
		data() {
			return {
				isApply: false, // 是否申请过代理商,
				number: "", // 代理商收益
				item: {
					hjAgentUser: {}
				},
				status: "", // 2:未申请过代理商  3:申请正在审核中  200:申请已通过，已经是代理商
				map: {
					1: "省代理",
					2: "市代理",
					3: "区代理",
					4: "街道代理"
				}
			};
		},
		onShow() {
			this.getDetail()
		},
		methods: {
			async getDetail() {
				try {
					uni.showLoading()
					let { status, data } = await getProxyShopDetailApi();
					this.item = data;
					this.status = data.code;
				} catch (e) {
					console.log(e);
				} finally {
					uni.hideLoading()
				}
			}
		}
	}
</script>

<style scoped>
	@import url("/static/css/common.css");

	page {
		background-color: #f5f5f5 !important;
	}

	.page-box {
		padding: 30rpx 24rpx;
	}

	.header {
		background-image: url(@/static/images/dls_bg.png);
		height: 308rpx;
		background-size: cover;
		position: relative;
		color: #FFFFFF;
	}

	.btn {
		width: 132rpx;
		height: 38rpx;
		font-size: 27rpx;
		text-align: center;
		line-height: 39rpx;
		color: #555555;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 50rpx;
	}

	.money_data {
		position: absolute;
		right: 40rpx;
		left: 40rpx;
		bottom: 0;
		height: 68rpx;
		font-size: 28rpx;
	}

	.main {
		margin-top: 30rpx;
		position: relative;
		z-index: 2;
	}

	.card-box {
		height: 140rpx;
		background-color: #FFFFFF;
		border-radius: 14rpx;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.06);
		padding: 0 26rpx 0 40rpx;
	}

	.card-box+.card-box {
		margin-top: 30rpx;
	}

	.money_number {
		color: #e0534c;
		font-size: 30rpx;
		font-weight: 500;
		padding-right: 20rpx;
		margin-left: auto;
	}

	.fill-bg {
		position: fixed;
		z-index: 0;
		background-image: linear-gradient(to bottom, rgba(90, 184, 127,0.9), rgba(90, 184, 127, 0.2));
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
	}
</style>
