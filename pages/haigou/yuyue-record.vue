<template>
	<view>
		<view class="header">
			<view class="status-bar-24"></view>
			<view class="fx a-center header-title">
				<!-- <uni-icons type="back" size="24" color="#524e4d" @click="back"></uni-icons> -->
				<view class="title fx fx-center fz_32 bold">查看预约</view>
			</view>
		</view>
		<view class="fill-box"></view>
		<view class="main">
			<view class="list">
				<template v-for="item in list">
					<view class="item">
						<view class="fx a-center">
							<u-icon name="checkmark-circle-fill" size="40" color="#f39800"></u-icon>
							<text class="fz_28 bold ml-2" style="padding-bottom: 4rpx;">预约成功</text>
							<text class="ml-auto" style="color: #9fa0a0;">预约</text>
						</view>
						<view class="mt-3 fz_32 bold" v-if="item.position">嗨购专区-{{item.position.name}}</view>
						<view class="mt-1 fz_28" style="line-height: 1.6;color: #3e3a39;">
							<view>预约时间：{{item.create_time}}</view>
							<view v-if="item.position">预约场次：{{item.position.time==1?"上午场":"下午场"}}</view>
							<view v-if="item.product">预约产品：{{item.product.store_name}}</view>
							<view>已支付：{{parseInt(item.money)}}张焕际券</view>
						</view>
					</view>
				</template>
			</view>
			<view v-if="noData">
				<emptyPage title="暂无数据" />
			</view>
		</view>
	</view>
</template>

<script>
	import paging from '@/mixins/paging.js'
	import { haigouReserveApi } from "@/api/product.js";
	export default {
		data() {
			return {
				list: [1]
			}
		},
		mixins: [paging],
		onShow() {
			this.getList();
		},
		methods: {
			async getList(options = {}) {
				let option = {
					loading: true,
					first: true,
					...options,
				}
				if (option.first) {
					this.page = 1;
					this.loadState = 0;
				}
				if (this.lockLoad || this.loadState == 2) return;
				this.lockLoad = true;
				let params = {
					page: this.page,
					limit: this.limit,
				}
				try {
					let { data: { list } } = await haigouReserveApi(params, option);
					this.setList("list", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
				}
			},
		},
		onReachBottom() {
			this.getList({ loading: false, first: false });
		}
	}
</script>

<style>
	page {
		background-color: #f6f8f9 !important;
	}
</style>

<style lang="scss">
	.header {
		width: 750rpx;
		position: fixed;
		z-index: 10;
		background-color: #efefef;

		.header-title {
			height: 50px;
			padding: 0 30rpx;
			position: relative;

			.title {
				position: absolute;
				width: 200rpx;
				left: 0;
				right: 0;
				margin: 0 auto;
				color: #595758;
			}
		}
	}

	.fill-box {
		/* #ifdef APP-PLUS */
		height: calc(50px + var(--status-bar-height));
		/* #endif */

		/* #ifdef H5 */
		height: calc(50px + 24px);
		/* #endif */
	}

	.main {
		padding: 40rpx 30rpx;
	}

	.item {
		background-color: #fff;
		border-radius: 18rpx;
		padding: 36rpx 30rpx;
	}

	.item+.item {
		margin-top: 26rpx;
	}
</style>
