<template>
	<view>
		<view class="container">
			<template v-for="item in list">
				<view class="item fx" :key="item.record_id">
					<image :src="item.product_img" style="width: 182rpx;height: 182rpx;"></image>
					<view class="f1" style="margin-left: 10rpx;">
						<view style="color: #333333; font-size: 30rpx;margin-bottom: 14rpx;">{{item.name}}</view>
						<view style="color:#0f734f;">
							￥0 <text style="color: #AAAAAA;text-decoration:line-through;padding-left: 2px;">￥{{item.price}}</text>
						</view>
						<view class="text" style="margin-top: 10rpx;color: #AAAAAA;">中奖时间：{{item.create_time}}</view>
						<view class="fx">
							<view
								class="btn ml-auto"
								style="margin-top: 10rpx;"
								@click="toPage(`/pages/blessing/snatch/orderInfo?type=2&record_id=${item.record_id}`)"
								v-if="!item.status">
								立即领取
							</view>
							<view
								class="btn ml-auto disabled"
								style="margin-top: 10rpx;"
								v-else>
								已领取
							</view>
						</view>
					</view>
				</view>
			</template>
			<foot :text="loadText" :state="loadState"></foot>
			<view v-if="noData">
				<emptyPage title="暂无数据~"></emptyPage>
			</view>
		</view>
	</view>
</template>

<script>
	import paging from '@/mixins/paging.js'
	import { getDrawApi } from "@/api/snatch.js"
	export default {
		data() {
			return {
				list: [],
			}
		},
		onShow() {
			this.page = 1;
			this.getList();
		},
		mixins: [paging],
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

				let { data: { count, list } } = await getDrawApi(params);
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

	.container {
		padding: 30rpx 30rpx 0;
	}

	.item {
		height: 260rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		position: relative;
		overflow: hidden;
		padding: 32rpx 30rpx 32rpx 25rpx;
	}

	.item+.item {
		margin-top: 25rpx;
	}

	.text {
		color: #777777;
		line-height: 1.7;
		font-size: 26rpx;
	}

	.btn {
		width: 152rpx;
		height: 48rpx;
		background: #0f734f;
		border-radius: 24px;
		text-align: center;
		line-height: 48rpx;
		color: #FFFFFF;
		font-size: 24rpx;
	}
</style>
