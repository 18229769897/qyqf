<template>
	<view>
		<view class="header">
			<view class="status-bar-24"></view>
			<view class="fx a-center header-title">
				<uni-icons type="back" size="24" color="#524e4d" @click="back"></uni-icons>
				<view class="title fx fx-center fz_32 bold">嗨券商城</view>
			</view>
		</view>
		<view class="fill-box"></view>
		<view class="floor"></view>
		<view class="main">
			<view class="list">
				<template v-for="item in goodsList">
					<view class="item fx a-center">
						<image :src="item.image" style="width: 200rpx;height: 200rpx;border-radius: 16rpx;"></image>
						<view class="ml-2 fx fx-col pt-1" style="align-self: stretch;">
							<view class="bold" style="width: 380rpx;">{{item.store_name}}</view>
							<view class="mt-auto fx a-center">
								<text>售价:</text>
								<view style="color: #fc3a38;">￥<text class="fz_34">{{ parseFloat(item.price).toFixed(1) }}</text></view>
							</view>
							<view class="btn fx-center mt-1" @click="toDetail(item.product_id)">立即购买</view>
						</view>
					</view>
				</template>
			</view>
			<loadMore :text="loadText" :state="loadState" />
			<view v-if="noData">
				<emptyPage title="暂无数据" />
			</view>
		</view>
	</view>
</template>

<script>
	import { getProducListApi } from "@/api/store";
	import { mapGetters } from "vuex";
	import paging from "@/mixins/paging.js"

	export default {
		data() {
			return {
				goodsList: [],
			}
		},
		mixins: [paging],
		computed: {
			...mapGetters(['isLogin', "userInfo"]),
		},
		onLoad() {
			this.getGoodsList();
		},
		onReachBottom() {
			this.getGoodsList({ first: false, loading: false });
		},
		methods: {
			// 获取商品列表
			async getGoodsList(options = {}) {
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
					product_type: 10
				}
				try {
					let { data: { list } } = await getProducListApi(params, option);
					this.setList("goodsList", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
				}
			},
			toDetail(product_id) {
				this.toPage(`/pages/goods_details/index?id=${product_id}`)
			}
		},
	}
</script>

<style>
	page {
		background-color: #fdf8f4 !important;
	}
</style>

<style lang="scss">
	.header {
		width: 750rpx;
		position: fixed;
		z-index: 10;
		background-color: #fdf8f4;

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

	.floor {
		width: 750rpx;
		height: 384rpx;
		background-image: url("/static/images/haiquan-bg.png");
		background-size: 100%;
		background-repeat: no-repeat;
		position: relative;
	}

	.main {
		margin-top: -166rpx;
		position: relative;
		z-index: 1;
		padding-bottom: 40rpx;
	}

	.item {
		width: 702rpx;
		padding: 24rpx;
		margin-left: auto;
		margin-right: auto;
		background-color: #fff;
		border-radius: 10rpx;
		box-shadow: 4rpx 4rpx 14rpx rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.item+.item {
		margin-top: 26rpx;
	}

	.btn {
		background-color: #e83928;
		color: #fff;
		width: 170rpx;
		height: 52rpx;
		border-radius: 12rpx;
	}
</style>
