<template>
	<!-- #ifdef H5 -->
	<view class="header" :style="'background:  '+ bgColor +' ;margin-top:'+ mbConfig +'rpx;'">
		<view class="serch-wrapper flex acea-row row-between-wrapper">
			<view v-if="logoConfig" class="logo skeleton-rect">
				<image :src="logoConfig" mode=""></image>
			</view>
			<navigator :url="merId ? '/pages/store/list/index?mer_id='+merId : '/pages/columnGoods/goods_search/index'" :class="logoConfig ? 'input' : 'uninput'" class="skeleton-rect" hover-class="none" 
			:style="'border-radius:'+boxStyle+'rpx;text-align:'+txtStyle">
				<text class="iconfont icon-xiazai5"></text>
				搜索商品
			</navigator>
			<navigator class="btn skeleton-rect" url="/pages/chat/customer_list/index?type=0" hover-class="none">
				<view class="iconfont icon-xiaoxi" :style="'color:'+iconColor"></view>
				<text class="iconnum bg-color-red" v-if="userInfo.total_unread">{{ userInfo.total_unread }}</text>
			</navigator>
		</view>	
	</view>
	<!-- #endif -->
	<!-- #ifdef MP || APP-PLUS -->
	<view>
		<view class="mp-header" :style="'background: '+ bgColor +' ;margin-top:'+ mbConfig +'rpx;'">
			<view class="sys-head skeleton-rect" view :style="{ height: statusBarHeight }"></view>
			<view class="serch-box skeleton-rect" view style="height: 43px;">
				<view class="serch-wrapper flex">
					<view v-if="logoConfig" class="logo skeleton-rect"><image :src="logoConfig" mode=""></image></view>
					<navigator :url="merId ? '/pages/store/list/index?mer_id='+merId : '/pages/columnGoods/goods_search/index'" :class="logoConfig ? 'input' : 'uninput'" 
					hover-class="none" class="skeleton-rect" :style="'border-radius:'+boxStyle+'rpx;text-align:'+txtStyle">
						<text class="iconfont icon-xiazai5"></text>
						搜索商品
					</navigator>
				</view>
			</view>
		</view>
		<view :style="'height:'+marTop+'px;'"></view>
	</view>
	<!-- #endif -->
</template>

<script>
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	export default {
		name: 'headerSerch',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			userInfo: {
				type: Object,
				default: () => {}
			}, 
			merId: {
				type: String || Number,
				default: ''
			}
		},
		data() {
			return {
				statusBarHeight: statusBarHeight,
				marTop:0,
				searchH: 0,
				bgColor: this.dataConfig.bgColor && this.dataConfig.bgColor.color[0].item,
				iconColor: this.dataConfig.iconColor && this.dataConfig.iconColor.color[0].item,
				boxStyle: this.dataConfig.boxStyle.type ? '0' : '32',
				logoConfig: this.dataConfig.logoConfig.url,
				mbConfig: this.dataConfig.mbConfig.val*2,
				txtStyle: this.dataConfig.txtStyle.type ? 'center' : 'xleft',
			};
		},
		mounted(){
			let that = this;
			// #ifdef H5
			// 获取H5 搜索框高度
			setTimeout(() => {
				let appSearchH = uni.createSelectorQuery().select('.serch-wrapper');
				appSearchH
					.boundingClientRect(function(data) {
						that.searchH = data.height;
					})
					.exec();
			}, 800);
			// #endif
			// #ifdef MP || APP-PLUS
			setTimeout(() => {
				// 获取小程序头部高度
				let info = uni.createSelectorQuery().in(this).select(".mp-header");
				info.boundingClientRect(function(data) {
					that.marTop = data.height
				}).exec()
			}, 100)
			// #endif
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
.header {
	width: 100%;
	background: #ffffff;
	.btn {
		position: relative;
		.iconfont {
			font-size: 45rpx;
		}
	}
	.iconnum {
		min-width: 6px;
		color: #fff;
		border-radius: 15rpx;
		position: absolute;
		right: -10rpx;
		top: -10rpx;
		font-size: 10px;
		padding: 0 4px;
	}
	.serch-wrapper {
		align-items: center;
		padding: 20rpx 30rpx 20rpx 30rpx;
		.logo {
			width: 127rpx;
			height: 46rpx;
		}
		image {
			width: 118rpx;
			height: 42rpx;
		}
		.input,.uninput {
			max-width: 490rpx;
			min-width: 460rpx;
			height: 64rpx;
			line-height: 64rpx;
			padding: 0 0 0 30rpx;
			background: rgba(237, 237, 237, 1);
			border: 1px solid rgba(241, 241, 241, 1);
			color: #bbbbbb;
			font-size: 28rpx;
			.iconfont {
				margin-right: 20rpx;
			}
		}
		.uninput {
			min-width: 610rpx;
			max-width: 620rpx;
		}
	}
	
}
/* #ifdef MP || APP-PLUS */
	.mp-header {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		/* #ifdef H5 */
		padding-bottom: 20rpx;
		/* #endif */
		background-color: #fff;
		.serch-wrapper {
			height: 100%;
			align-items: center;
			padding: 0 50rpx 0 53rpx;
			image {
				width: 118rpx;
				height: 42rpx;
				margin-right: 30rpx;
			}
			.input,.uninput {
				display: flex;
				align-items: center;
				/* #ifndef APP-PLUS */
				width: 305rpx;
				/* #endif */
				/* #ifdef APP-PLUS */
				flex: 1;
				/* #endif */
				height: 58rpx;
				padding: 0 0 0 30rpx;
				background: rgba(247, 247, 247, 1);
				border: 1px solid rgba(241, 241, 241, 1);
				border-radius: 29rpx;
				color: #bbbbbb;
				font-size: 28rpx;
				.iconfont {
					margin-right: 20rpx;
				}
			}
			.uninput {
				min-width: 460rpx;
				max-width: 480rpx;
			}
		}
	}
/* #endif */
</style>
