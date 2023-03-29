<template>
	<view>
		<template v-for="item in list">
			<view class="item fx fx-col">
				<view class="fx f1" style="padding-left: 25rpx;">
					<image :src="item.product_img" style="width: 160rpx;height: 160rpx;"></image>
					<view style="margin-left: 20rpx;">
						<view style="font-size: 32rpx;margin-bottom: 20rpx;">{{item.product_name}}</view>
						<view class="text" style="line-height: 1.8;">
							参与期号：<text style="color: #0f734f;">{{item.number}}</text>
						</view>
						<view class="text" style="line-height: 1.8;">
							开奖时间：{{item.opening_time}}
						</view>
					</view>
				</view>
				<view class="user-box fx j-between a-center">
					<view class="fx a-center">
						<image src="@/static/images/f.png" style="width: 56rpx;height: 56rpx;" class="circle"></image>
						<text class="text" style="margin-left: 8rpx;">{{item.phone}}中奖</text>
					</view>
					<view class="btn" @click="toPage(`./index`)">试试手气</view>
				</view>
			</view>
		</template>
		<view v-if="noData">
			<emptyPage title="暂无数据~"></emptyPage>
		</view>
		<foot :text="loadText" :state="loadState"></foot>
	</view>
</template>

<script>
	import paging from '@/mixins/paging.js'
	import { mapGetters } from 'vuex'
	import { drawHistoryApi } from "@/api/snatch";
	export default {
		data() {
			return {
				list: [],
				tabIndex: 0
			}
		},
		mixins: [paging],
		onLoad() {
			this.getList();
		},
		methods: {
			async getList(options = {}) {
				let opt = {
					first: true,
					...options,
				}
				let params = {
					page: this.page,
					limit: this.limit,
				}
				let { data: { count, list } } = await drawHistoryApi(params, opt);
				if (opt.first) {
					this.list = list;
					this.noData = count == 0;
					this.count = count;
				} else {
					this.list = this.list.concat(list);
				}
			}
		},
		onReachBottom() {
			if (this.list.length >= this.count) {
				this.loadState = 2;
				return
			}
			this.loadState = 1;
			this.page++;
			this.getList({ first: false });
		}
	}
</script>

<style>
	@import url("/static/css/common.css");

	page {
		padding: 0 30rpx;
	}

	.item {
		height: 366rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding-top: 32rpx;
	}

	.item.item {
		margin-top: 22rpx;
	}

	.text {
		color: #AAAAAA;
		font-size: 24rpx;
	}

	.user-box {
		height: 120rpx;
		padding: 0 30rpx;
		border-top: 1rpx solid #E8E8E8;
	}



	.btn {
		width: 145rpx;
		height: 50rpx;
		background: #0f734f;
		border-radius: 24px;
		text-align: center;
		line-height: 50rpx;
		color: #FFFFFF;
		font-size: 28rpx;
	}
</style>
