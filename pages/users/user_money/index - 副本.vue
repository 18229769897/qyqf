<template>
	<view :style="viewColor">
		<view class='my-account'>
			<view class='wrapper'>
				<view class='header'>
					<view class='headerCon'>
						<view class='account acea-row row-top row-between'>
							<view class='assets'>
								<view>总资产(元)</view>
								<view class='money'>{{userInfo.now_money || 0}}</view>
							</view>
							<!-- #ifdef APP-PLUS || H5 -->
							<navigator url="/pages/users/user_payment/index" hover-class="none" class='recharge t-color'>充值</navigator>
							<!-- #endif -->
							<!-- #ifdef MP -->
							<view @click="openSubscribe('/pages/users/user_payment/index')" class='recharge t-color'>充值</view>
							<!-- #endif -->
						</view>
						<view class='cumulative acea-row row-top'>
							<!-- v-if="balance_func_status == 1" -->
							<view class='item'>
								<view>累计充值(元)</view>
								<view class='money'>{{userInfo.total_recharge || 0}}</view>
							</view>
							<view class='item'>
								<view>累计消费(元)</view>
								<view class='money'>{{userInfo.total_consume || 0}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class='nav acea-row row-middle'>
					<navigator class='item' hover-class='none' url='/pages/users/user_bill/index'>
						<view class='pictrue'>
							<image :src="domain+'/static/diy/record1'+keyColor+'.png'"></image>
						</view>
						<view>账单记录</view>
					</navigator>
					<navigator class='item' hover-class='none' url='/pages/users/user_bill/index?type=1'>
						<view class='pictrue'>
							<image :src="domain+'/static/diy/record2'+keyColor+'.png'"></image>
						</view>
						<view>消费记录</view>
					</navigator>
					<navigator class='item' hover-class='none' url='/pages/users/user_bill/index?type=2'>
						<view class='pictrue'>
							<image :src="domain+'/static/diy/record3'+keyColor+'.png'"></image>
						</view>
						<view>充值记录</view>
					</navigator>
				</view>
			</view>
		</view>
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
	</view>
</template>

<script>
	let app = getApp();
	import {
		getProductHot
	} from '@/api/store.js';
	import {
		openRechargeSubscribe
	} from '@/utils/SubscribeMessage.js';
	import {
		getUserInfo,
		userActivity
	} from '@/api/user.js';
	import {
		mapGetters
	} from "vuex";
	import recommend from '@/components/recommend/index';
	import authorize from '@/components/Authorize';
	import { configMap } from '@/utils';
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {
			recommend,
			authorize
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				userInfo: {},
				hostProduct: [],
				isClose: false,
				activity: {},
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				hotScroll: false,
				hotPage: 1,
				hotLimit: 10
			};
		},
		computed: configMap(['recharge_switch', 'balance_func_status'], mapGetters(['isLogin', 'viewColor', 'keyColor'])),
		onLoad() {

		},
		onShow() {
			this.getUserInfo()
		},
		onReady() {},
		methods: {
			getUserInfo() {
				getUserInfo().then(res => {
					this.userInfo = res.data
				})
			},
			onLoadFun: function() {
				this.isShowAuth = false;
				this.getUserInfo();
				this.get_host_product();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			// #ifdef MP
			openSubscribe: function(page) {
				console.log(123);
				console.log(page);
				uni.showLoading({
					title: '正在加载',
				})
				console.log(456);
				openRechargeSubscribe().then(res => {
					console.log(789);
					uni.hideLoading();
					uni.navigateTo({
						url: page,
					});
				}).catch(() => {
					uni.hideLoading();
				});
			},
			// #endif
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				if (that.hotScroll) return
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					that.hotPage++
					that.hotScroll = res.data.list.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data.list)
				});
			}
		},
		onReachBottom() {
			this.get_host_product();
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		}
	}
</script>

<style scoped lang="scss">
	.my-account .wrapper {
		background-color: #fff;
		padding: 32rpx 0 34rpx 0;
		margin-bottom: 14rpx;
	}

	.my-account .wrapper .header {
		width: 690rpx;
		height: 330rpx;
		background-image: linear-gradient(to right, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
		border-radius: 16rpx;
		margin: 0 auto;
		box-sizing: border-box;
		color: rgba(255, 255, 255, 0.6);
		font-size: 24rpx;
	}

	.t-color {
		color: var(--view-theme);
	}

	.my-account .wrapper .header .headerCon {
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArIAAAFKCAYAAADhULxpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEzMUM4RDlEM0YxNTExRTk4OUJFQ0Q4Qjg0RDBCMzQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEzMUM4RDlFM0YxNTExRTk4OUJFQ0Q4Qjg0RDBCMzQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTMxQzhEOUIzRjE1MTFFOTg5QkVDRDhCODREMEIzNDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTMxQzhEOUMzRjE1MTFFOTg5QkVDRDhCODREMEIzNDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6ymvxvAAAIhklEQVR42uzd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');
		background-repeat: no-repeat;
		background-size: 100%;
		height: 100%;
		width: 100%;
		padding: 36rpx 0 29rpx 0;
		box-sizing: border-box;
	}

	.my-account .wrapper .header .headerCon .account {
		padding: 0 35rpx;
	}

	.my-account .wrapper .header .headerCon .account .assets .money {
		font-size: 72rpx;
		color: #fff;
		// font-family: 'Guildford Pro';
	}

	.my-account .wrapper .header .headerCon .account .recharge {
		font-size: 28rpx;
		width: 150rpx;
		height: 54rpx;
		border-radius: 27rpx;
		background-color: #fff9f8;
		text-align: center;
		line-height: 54rpx;
	}

	.my-account .wrapper .header .headerCon .cumulative {
		margin-top: 46rpx;
	}

	.my-account .wrapper .header .headerCon .cumulative .item {
		flex: 1;
		padding-left: 35rpx;
	}

	.my-account .wrapper .header .headerCon .cumulative .item .money {
		font-size: 48rpx;
		// font-family: 'Guildford Pro';
		color: #fff;
		margin-top: 6rpx;
	}

	.my-account .wrapper .nav {
		height: 155rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.my-account .wrapper .nav .item {
		flex: 1;
		text-align: center;
		font-size: 26rpx;
		color: #999;
	}

	.my-account .wrapper .nav .item .pictrue {
		width: 44rpx;
		height: 44rpx;
		margin: 0 auto;
		margin-bottom: 20rpx;
	}

	.my-account .wrapper .nav .item .pictrue image {
		width: 100%;
		height: 100%;
	}

	.my-account .wrapper .advert {
		padding: 0 30rpx;
		margin-top: 30rpx;
	}

	.my-account .wrapper .advert .item {
		background-color: #fff6d1;
		width: 332rpx;
		height: 118rpx;
		border-radius: 10rpx;
		padding: 0 27rpx 0 25rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		color: #e44609;
	}

	.my-account .wrapper .advert .item.on {
		background-color: #fff3f3;
		color: #e96868;
	}

	.my-account .wrapper .advert .item .pictrue {
		width: 78rpx;
		height: 78rpx;
	}

	.my-account .wrapper .advert .item .pictrue image {
		width: 100%;
		height: 100%;
	}

	.my-account .wrapper .advert .item .text .name {
		font-size: 30rpx;
		font-weight: bold;
		color: #f33c2b;
		margin-bottom: 7rpx;
	}

	.my-account .wrapper .advert .item.on .text .name {
		color: #f64051;
	}

	.my-account .wrapper .list {
		padding: 0 30rpx;
	}

	.my-account .wrapper .list .item {
		margin-top: 44rpx;
	}

	.my-account .wrapper .list .item .picTxt .iconfont {
		width: 82rpx;
		height: 82rpx;
		border-radius: 50%;
		background-image: linear-gradient(to right, #ff9389 0%, #f9776b 100%);
		text-align: center;
		line-height: 82rpx;
		color: #fff;
		font-size: 40rpx;
	}

	.my-account .wrapper .list .item .picTxt .iconfont.yellow {
		background-image: linear-gradient(to right, #ffccaa 0%, #fea060 100%);
	}

	.my-account .wrapper .list .item .picTxt .iconfont.green {
		background-image: linear-gradient(to right, #a1d67c 0%, #9dd074 100%);
	}

	.my-account .wrapper .list .item .picTxt {
		width: 428rpx;
		font-size: 30rpx;
		color: #282828;
	}

	.my-account .wrapper .list .item .picTxt .text {
		width: 317rpx;
	}

	.my-account .wrapper .list .item .picTxt .text .infor {
		font-size: 24rpx;
		color: #999;
		margin-top: 5rpx;
	}

	.my-account .wrapper .list .item .bnt {
		font-size: 26rpx;
		color: #282828;
		width: 156rpx;
		height: 52rpx;
		border: 1rpx solid #ddd;
		border-radius: 26rpx;
		text-align: center;
		line-height: 52rpx;
	}

	.my-account .wrapper .list .item .bnt.end {
		font-size: 26rpx;
		color: #aaa;
		background-color: #f2f2f2;
		border-color: #f2f2f2;
	}
</style>
