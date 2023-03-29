<template>
	<view class="page-box">
		<view class="container">
			<template v-for="item in goodsList">
				<view class="goods_item fx">
					<view style="position: relative;">
						<image :src="item.image" style="width: 220rpx;height: 220rpx;"></image>
					</view>
					<view style="margin-left: 30rpx;" class="f1">
						<view style="font-size: 30rpx;font-weight: bold;">{{item.store_name}}</view>
						<view class="fx a-end mt16">
							<view style="color:#0f734f;">
								<text style="font-size: 26rpx;padding-bottom: 4rpx;">积分</text>
								<text style="font-size: 32rpx;font-weight: bold;">{{ parseFloat(item.price).toFixed(1) }}</text>
							</view>
						</view>
					</view>
					<view class="btn" @click="toDetail(item.product_id)">立即购买</view>
				</view>
			</template>
			<loadMore :state="loadState" :text="loadText" color="#333" />
			<view class="flex-sub" v-if="noData">
				<view class='noCommodity'>
					<view class='pictrue'>
						<image src='/static/images/noShopper.png'></image>
					</view>
				</view>
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
			this.getGoodsList({ first: false });
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
					product_type: 3
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

<style scoped lang="scss">
	.container {
		padding: 0 25rpx 0;
		margin-top: 10px;
	}

	.goods_item {
		background-color: #FFFFFF;
		border-radius: 14rpx;
		padding: 14rpx;
		position: relative;
	}

	.goods_item image {
		border-radius: 14rpx;
	}

	.goods_item+.goods_item {
		margin-top: 25rpx;
	}

	.btn {
		width: 148rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border-radius: 60rpx;
		color: #FFFFFF;
		background: #0f734f;
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
	}
</style>
