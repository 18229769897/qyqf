<template>
	<view class='recommend'>
		<!-- <view class="common-hd">
			<view class="title">为你推荐</view>
		</view> -->
		<view class='recommendList' :class="indexP?'on':''">
			<WaterfallsFlow :wfList='hostProduct' @itemTap="goDetail" :type="0" />
		</view>
	</view>
</template>

<script>
	import {mapGetters} from "vuex";
	import { goShopDetail } from '@/libs/order.js'
	import {openBargainSubscribe} from '@/utils/SubscribeMessage.js';
	import {initiateAssistApi} from '@/api/activity.js';
	import {toLogin} from '@/libs/login.js';
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue'
	export default {
		components:{WaterfallsFlow},
		computed: mapGetters(['uid']),
		props: {
			hostProduct: {
				type: Array,
				default: function() {
					return [];
				}
			},
			indexP:{
				type: Boolean,
				default: false
			},
			isLogin:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
			};
		},
		mounted() {

		},
		onPullDownRefresh(){
			// 模拟上拉刷新
			setTimeout(()=>{
				const newList = this.hostProduct.reverse();
				this.hostProduct = newList;
				uni.stopPullDownRefresh();
			},500)
		},
		methods: {
			goDetail(item){
				goShopDetail(item, this.uid).then(res => {
				if (this.isLogin) {
						initiateAssistApi(item.activity_id).then(res => {
							let id = res.data.product_assist_set_id;
							uni.hideLoading();
							// #ifndef MP
							uni.navigateTo({
								url: '/pages/activity/assist_detail/index?id=' + id
							});
							// #endif
							// #ifdef MP
							openBargainSubscribe().then(res => {
								uni.hideLoading();
								uni.navigateTo({
									url: '/pages/activity/assist_detail/index?id=' + id
								});
							}).catch((err) => {
								uni.hideLoading();
							});
							// #endif
						}).catch((err) => {
							uni.showToast({
								title: err,
								icon: 'none'
							})
						});
					} else {
						// #ifdef H5 || APP-PLUS
						toLogin();
						// #endif
						// #ifdef MP
						this.$emit('isShowAuth', true);
						this.$emit('isAuto', true);
						// #endif
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.common-hd {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 118rpx;

		.title {
			padding: 0 80rpx;
			font-size: 34rpx;
			color: $theme-color;
			font-weight: bold;
			background-image: url("~@/static/images/index-title.png");
			background-repeat: no-repeat;
			background-size: 100% auto;
			background-position: left center;
		}
	}

	.recommend .recommendList {
		padding: 0 20rpx;
		min-height: 100rpx;
	}

	.recommend .recommendList.on{
		padding: 0;
	}
	// .recommend .recommendList .item {
	// 	width: 345rpx;
	// 	margin-bottom: 30rpx;
	// 	background-color: #fff;
	// 	border-radius: 16rpx;
	// 	padding-bottom: 20rpx;
	// }
	// .recommend .recommendList .item .text{
	// 	padding: 0 20rpx;
	// }
	// .recommend .recommendList .item .coupon{
	// 	background:rgba(255,248,247,1);
	// 	border:1px solid rgba(233,51,35,1);
	// 	border-radius:4rpx;
	// 	font-size:20rpx;
	// 	margin-left: 18rpx;
	// 	padding: 1rpx 4rpx;
	// }

	// .recommend .recommendList .item .pictrue {
	// 	position: relative;
	// 	width: 345rpx;
	// 	height: 345rpx;
	// }

	// .recommend .recommendList .item .pictrue image {
	// 	width: 345rpx;
	// 	height: 345rpx;
	// 	border-radius: 16rpx 16rpx 0 0;
	// }

	// .recommend .recommendList .item .name {
	// 	font-size: 28rpx;
	// 	color: #282828;
	// 	margin: 20rpx 0 10rpx 0;
	// 	display: flex;
	// 	align-items: center;
	// 	.name_text{
	// 		display: inline-block;
	// 		max-width: 300rpx;
	// 	}
	// }

	// .recommend .recommendList .item .money {
	// 	font-size: 20rpx;
	// 	font-weight: bold;
	// }

	// .recommend .recommendList .item .money .num {
	// 	font-size: 34rpx;
	// }
</style>
