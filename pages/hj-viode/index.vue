<template>
	<view>
		<view class="header">
			<view class="status-bar-24"></view>
			<view class="fx a-center header-title">
				<uni-icons type="back" size="24" color="#524e4d" @click="back"></uni-icons>
				<view class="title fx fx-center fz_32 bold">用户必看</view>
			</view>
		</view>
		<view class="fill-box"></view>
		<view class="floor"></view>
		<view class="main">
			<view class="list fx fx-warp">
				<template v-for="item in list">
					<view class="item" @click="toPage(`./video?article_id=${item.article_id}`)">
						<view style="margin-bottom: 6rpx;" class="fz_30">{{item.title}}</view>
						<image :src="item.image_input" class="w100" mode="widthFix"></image>
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
	import { mapGetters } from "vuex";
	import paging from "@/mixins/paging.js"
	import { getArticleList } from "@/api/api.js";

	export default {
		data() {
			return {
				list: [],
			}
		},
		mixins: [paging],
		onLoad() {
			this.getList();
		},
		onReachBottom() {

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
					let { data: { list } } = await getArticleList(20, params, option);
					this.setList("list", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
				}
			},
		},
	}
</script>

<style>
	page {
		background-color: #f5ffff !important;
	}
</style>

<style lang="scss">
	.header {
		width: 750rpx;
		position: fixed;
		z-index: 10;
		background-color: #f5ffff;

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
		height: 307rpx;
		background-image: url("./images/head-bg.png");
		background-size: 100%;
		background-repeat: no-repeat;
		position: relative;
	}

	.main {
		padding-bottom: 40rpx;
	}

	.list {
		width: 666rpx;
		margin-top: 30rpx;
		margin-left: auto;
		margin-right: auto;
	}

	.list .item:nth-child(2n) {
		margin-left: 24rpx;
	}

	.item {
		width: 321rpx;
		margin-bottom: 14rpx;
	}
</style>
