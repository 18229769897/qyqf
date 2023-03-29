<template>
	<view class="coupon" :style="'margin: 0 '+prConfig+'rpx'">
		<view class="coupon_count" :style="'background-color:'+themeColor+';margin-top:' + mbConfig +'rpx;border-radius:'+bgStyle+'rpx'" v-if="couponList.length">
			<view class="acea-row coupon-title" :style="{color: titleColor}">
				<text>领优惠券</text>
				<navigator v-if="merId" :url="'/pages/store/home/index?id='+merId+'&type=3'" class="more-box" hover-class="none">
					<view class="txt">查看更多 <text class="iconfont icon-jiantou"></text></view>
				</navigator>
				<navigator v-else url="/pages/activity/collect_coupons/index" class="more-box" hover-class="none">
					<view class="txt">查看更多 <text class="iconfont icon-jiantou"></text></view>
				</navigator>
			</view>
			<scroll-view scroll-x="true" style="white-space: nowrap; vertical-align: middle;" show-scrollbar="false">
				<view class="wrapper">
					<view class="item" :style="!item.issue ?'background:linear-gradient('+bgColor[0].item+' 0%, '+bgColor[1].item+' 100%);':''" style="margin-right: 20rpx;" v-for="(item,index) in couponList"
					 :key="index" hover-class="none">
						<view class="itemCon acea-row row-between-wrapper">
							<view class="text">
								<view class="money"><text>¥</text>{{item.coupon_price}}</view>
								<view class="info">满{{item.use_min_price}}元可用</view>
							</view>
							<view class="bnt" v-if="item.issue"><text>已 领 取</text></view>
							<view class="bnt" v-else @click="receiveCoupon(item)"><text>立 即 领 取</text></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
	</view>
</template>

<script>
	import {
		setCouponReceive
	} from '@/api/api.js';
	import {getCouponLst} from '@/api/activity.js'
    import authorize from '@/components/Authorize';
	import {
		mapGetters
	} from "vuex";
	export default {
		name: 'coupon',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			merId: {
				type: String || Number,
				default: ''
			}
		},
		computed: mapGetters(['isLogin']),
		components: {
            authorize
		},
		watch:{
			isLogin:{
				handler:function(newV,oldV){
					if(newV){
						this.getCoupon();
					}
				},
				deep:true
			}
		},
		data() {
			return {
				couponList: [],
				bgColor: this.dataConfig.bgColor.color,
				themeColor: this.dataConfig.themeColor.color[0].item,
				titleColor: this.dataConfig.titleColor && this.dataConfig.titleColor.color[0].item,
				mbConfig: this.dataConfig.mbConfig.val*2,
				prConfig: this.dataConfig.prConfig.val*2,
				bgStyle: this.dataConfig.bgStyle.type ? 20 : 0,
				isShowAuth: false, //是否隐藏授权
				isAuto: false, //没有授权的不会自动授权
			};
		},
		created() {},
		mounted() {
			this.getCoupon();
		},
		methods: {
			getCoupon: function() {
				let that = this;
				getCouponLst({
					mer_id: that.merId,
					page: 1,
					limit: 10
				}).then(res => {
					that.$set(that, 'couponList', res.data.list);
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				});
			},
			receiveCoupon: function(item) {
				let that = this;
				if (that.isLogin === false) {
                    this.isAuto = true;
                    this.isShowAuth = true
				} else {
					setCouponReceive(item.coupon_id).then(res => {
						item.issue = 1
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}).catch(err => {
						uni.showToast({
							title: err,
							icon: 'none'
						})
					})
				}
			},
			// 授权回调
			onLoadFun() {
				this.isShowAuth = false
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			// 打开授权
			authOpen: function() {
				let that = this;
				if (that.isLogin === false) {
                    this.isAuto = true;
                    this.isShowAuth = true
				}
			},
		}
	}
</script>

<style lang="scss">
	.coupon {
		.coupon_count{
			padding: 0 0 30rpx 20rpx;
		}
		.coupon-title {
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 10rpx;
			font-size: 24rpx;
			color: #282828;
			.more-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				image {
					width: 20rpx;
					height: 20rpx;
					margin-top: 10rpx;
					margin: 10rpx 0 0 5rpx;
				}

				.txt {
					display: block;

					.iconfont{
						font-size: 22rpx;
					}
				}
			}
		}
		.item {
			display: flex;
			width: 304rpx;
			height: 142rpx;
			background-color: #DDDDDD;
			border-radius: 8rpx;
			color: #fff;
			position: relative;
			display: inline-block;
			flex-shrink: 0;
			&::before {
				position: absolute;
				content: ' ';
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background-color: #fff;
				right: 52rpx;
				top: -10rpx;
			}

			&::after {
				position: absolute;
				content: ' ';
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background-color: #fff;
				right: 52rpx;
				bottom: -10rpx;
			}

			.itemCon {
				height: 100%;
				width: 100%;

				.text {
					width: 240rpx;

					.money {
						font-size: 48rpx;
						text-align: center;

						text {
							font-size: 24rpx;
						}
					}

					.info {
						font-size: 24rpx;
						text-align: center;
					}
				}

				.bnt {
					position: relative;
					height: 100%;
					font-size: 20rpx;
					display: block;
					writing-mode: vertical-lr;
					line-height: 1.2;
					width: 64rpx;
					border-left: 1px dashed #fff;
					text{
						position: absolute;
						left: 56%;
						top: 50%;
						transform: translate(-50%,-50%);
					}
				}
			}
		}

		.wrapper {
			display: flex;
		}


	}
</style>
