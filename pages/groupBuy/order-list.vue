<template>
	<view :style="viewColor">
		<view class='my-order'>
			<view class='header'>
				<view class='picTxt acea-row row-between-wrapper'>
					<view class='text'>
						<view class='name'>拼团订单</view>
					</view>
					<view class='pictrue'>
						<image src='/static/images/orderTime.png'></image>
					</view>
				</view>
			</view>
			<view class='nav acea-row row-around'>
				<template v-for="(item,index) in navList">
					<view class='item' :key="item.value" :class="{'active':selNavIndex==index}" @click="switchNav(index)">
						<view>{{item.label}}</view>
					</view>
				</template>
			</view>

			<view class="list">
				<template v-for="item in orderList">
					<view class="good-item">
						<view class="flex justify-between" style="padding:18rpx 14rpx;">
							{{item.order_sn}}
						</view>
						<view class="across-line"></view>
						<view style="padding: 18rpx 20rpx;">
							<view class="flex align-center">
								<image class="good-pic" :src="item.orderProduct[0].cart_info.product.image"></image>
								<view>
									<view class="ellipsis2" style="width: 300rpx;margin-left: 20rpx;">
										{{item.orderProduct[0].cart_info.product.store_name}}
									</view>
									<view class="fz_30 flex flex-col justify-end" style="color: #888;margin-left: 20rpx;">
										<view class="">￥{{item.orderProduct[0].cart_info.productAttr.price}} x {{item.total_num}}</view>
									</view>
								</view>
								<view class="ml-auto fz_30 flex flex-col justify-end" style="color: #888;">
									<view class="">￥{{item.pay_price}}</view>
								</view>
							</view>
							<view style="text-align: end;color: #888;">{{item.create_time}}</view>
						</view>
						<view class="across-line"></view>
						<view class="flex align-center" style="padding: 24rpx;">
							<view>{{item.block_name}}<text v-if="item.stage_name"> /{{item.stage_name}}</text></view>
						</view>
					</view>
				</template>
			</view>
			<loadMore :text="loadText" :state="loadState" color="#233" />
			<view v-if="noData">
				<emptyPage title="暂无订单~"></emptyPage>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import paging from '@/mixins/paging.js';
	import { getStageList } from "@/api/order";
	export default {
		data() {
			return {
				navList: [
					{ value: 0, label: "已认购" },
					{ value: 1, label: "待赠送" },
					{ value: 2, label: "已赠送" },
					{ value: 3, label: "认购失败" },
					{ value: 4, label: "重新开始" },
				],
				selNavIndex: 0,
				orderList: [],
			}
		},
		onLoad() {
			this.getList();
		},
		mixins: [paging],
		computed: {
			...mapGetters(['viewColor']),
		},
		methods: {
			switchNav(index) {
				if (this.selNavIndex == index) return;
				this.selNavIndex = index;
				this.getList();
			},

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
					stage_stauts: this.selNavIndex
				}
				try {
					let { data: { list } } = await getStageList(params, option);
					this.setList("orderList", list, option.first);
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

<style scoped lang="scss">
	.my-order .header {
		height: 260rpx;
		padding: 0 30rpx;
		background-color: var(--view-theme);
	}

	.my-order .header .picTxt {
		height: 190rpx;
	}

	.my-order .header .picTxt .text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 26rpx;
	}

	.my-order .header .picTxt .text .name {
		font-size: 34rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 20rpx;
	}

	.my-order .header .picTxt .pictrue {
		width: 122rpx;
		height: 109rpx;
	}

	.my-order .header .picTxt .pictrue image {
		width: 100%;
		height: 100%;
	}

	.my-order .nav {
		background-color: #fff;
		width: 690rpx;
		height: 90rpx;
		border-radius: 6rpx;
		margin: -73rpx auto 0 auto;
	}

	.my-order .nav .item {
		text-align: center;
		font-size: 26rpx;
		color: #282828;
		padding: 29rpx 0;
	}

	.my-order .nav .item.active {
		font-weight: bold;
		border-bottom: 5rpx solid var(--view-theme);
	}

	.list {
		padding: 30rpx;
	}

	.good-item {
		background-color: #fff;

		.store-name {
			margin: 0 10rpx;
		}

		.icon-xiangyou {
			font-size: 20rpx;
		}

		.good-pic {
			width: 120rpx;
			height: 120rpx;
		}
	}

	.good-item+.good-item {
		margin-top: 20rpx;
	}

	.across-line {
		height: 1rpx;
		width: 100%;
		background-color: #eee;
	}

	.red-btn {
		width: 160rpx;
		height: 58rpx;
		line-height: 58rpx;
		text-align: center;
		color: #fff;
		border-radius: 100px;
		background-color: var(--view-theme);
	}
</style>
