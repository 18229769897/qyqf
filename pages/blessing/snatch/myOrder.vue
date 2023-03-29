<template>
	<view>
		<template v-for="item in list">
			<view class="item fx fx-col" :key="item.record_id">
				<view class="fx f1" style="padding: 24rpx 0 30rpx 20rpx;">
					<image :key="item.record_id" :src="item.period.product_img" style="width: 182rpx;height: 182rpx;"></image>
					<view style="margin-left: 20rpx;">
						<view style="font-size: 32rpx;margin-bottom: 20rpx;">{{item.period.product_name}}</view>
						<view class="text" style="line-height: 1.8;">
							参与期号：<text style="color: #0f734f;">{{item.period.number}}</text>
						</view>
						<view class="text" style="line-height: 1.8;">
							开奖时间：{{item.period.opening_time}}
						</view>
					</view>
				</view>
				<view class="user-box fx j-between a-center">
					<text class="text"></text>
					<view class="btn" v-if="!item.status" @click="toPage(`./orderInfo?record_id=${item.record_id}&type=1`)">立即领取</view>
					<view class="btn disabled" v-else>已领取</view>
				</view>
			</view>
		</template>
		<foot :text="loadText" :state="loadState"></foot>
		<view v-if="noData">
			<emptyPage title="暂无数据~"></emptyPage>
		</view>
	</view>
</template>

<script>
	import paging from '@/mixins/paging.js'
	import { buyRecordApi } from "@/api/snatch.js"
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				list: [],
				is_ok: 1,
				is_open: 2
			}
		},
		mixins: [paging],
		onShow() {
			this.getList();
		},
		methods: {
			async getList(options = {}) {
				let opt = {
					first: true,
					...options,
				}
				let params = {
					is_ok: this.is_ok,
					is_open: this.is_open,
					page: this.page,
					limit: this.limit
				}
				let { data: { count, list } } = await buyRecordApi(params);
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
		background: #FFFFFF;
		border-radius: 20rpx;
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
