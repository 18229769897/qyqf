<template>
	<view>
		<view class='newsDetail'>
			<view class='conters'>
				<jyf-parser :html="content.replace(/<br\/>/ig, '')" ref="article" :tag-style="tagStyle"></jyf-parser>
			</view>
			<view class="picTxt acea-row row-between-wrapper" v-if="store_info.id">
				<view class="pictrue">
					<image :src="store_info.image"></image>
				</view>
				<view class="text">
					<view class="name line1">{{store_info.store_name}}</view>
					<view class="money font-color">
						￥<text class="num">{{store_info.price}}</text>
					</view>
					<view class="y_money">￥{{store_info.ot_price}}</view>
				</view>
				<navigator :url="'/pages/goods_details/index?id='+store_info.id" hover-class="none" class="label"><text
						class="span">查看商品</text></navigator>
			</view>
			<!-- #ifdef H5 -->
			<button class="bnt bg-color" hover-class='none' @click="listenerActionSheet" v-if="this.$wechat.isWeixin()">和好友一起分享</button>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<button class="bnt bg-color" open-type="share" hover-class='none'>和好友一起分享</button>
			<!-- #endif -->
		</view>
		<shareInfo @setShareInfoStatus="setShareInfoStatus" :shareInfoStatus="shareInfoStatus"></shareInfo>

	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------
	import parser from "@/components/jyf-parser/jyf-parser";
	import {
		getArticleDetails
	} from '@/api/api.js';
	import shareInfo from '@/components/shareInfo';
	import home from '@/components/home';
	export default {
		components: {
			shareInfo,
			home,
			"jyf-parser": parser,
		},
		data() {
			return {
				id: 0,
				articleInfo: [],
				store_info: {},
				content: '',
				shareInfoStatus: false,
				tagStyle: {
					img: 'width:100%;display:block;'
				},
			};
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			if (options.hasOwnProperty('id')) {
				this.id = options.id;
			} else {
				// #ifndef H5
				uni.navigateBack({
					delta: 1
				});
				// #endif
				// #ifdef H5
				history.back();
				// #endif
			}
		},
		onShow: function() {
			this.getArticleOne();
		},
		methods: {
			getArticleOne: function() {
				let that = this;
				getArticleDetails(that.id).then(res => {
					uni.setNavigationBarTitle({
						title: res.data.title.substring(0, 7) + "..."
					});
					that.$set(that, 'articleInfo', res.data);
					that.$set(that, 'store_info', res.data.store_info ? res.data.store_info : {});
					that.content = res.data.content.content;
					// #ifdef H5
					if (this.$wechat.isWeixin()) {
						this.setShareInfo();
					}
					// #endif
				});
			},
			listenerActionSheet() {
				this.shareInfoStatus = true
			},
			setShareInfoStatus() {
				this.shareInfoStatus = false
			},
			setShareInfo: function() {
				let href = location.href;
				let configAppMessage = {
					desc: this.articleInfo.synopsis,
					title: this.articleInfo.title,
					link: href,
					imgUrl: this.articleInfo.image_input
				};
				this.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"], configAppMessage);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}

	.newsDetail .title {
		padding: 0 30rpx;
		font-size: 34rpx;
		color: #282828;
		font-weight: bold;
		margin: 45rpx 0 23rpx 0;
		line-height: 1.5;
	}

	.newsDetail .list {
		margin: 0 30rpx;
		// border-bottom: 1rpx solid #eee;
		padding-bottom: 25rpx;
	}

	.newsDetail .list .label {
		font-size: 30rpx;
		color: #B1B2B3;
		// height: 38rpx;
		// border-radius: 3rpx;
		// text-align: center;
		// line-height: 38rpx;
		// padding: 0 10rpx;
	}

	.newsDetail .list .item {
		margin-left: 27rpx;
		font-size: 30rpx;
		color: #B1B2B3;
	}

	.newsDetail .list .item .iconfont {
		font-size: 28rpx;
		margin-right: 10rpx;
	}

	.newsDetail .list .item .iconfont.icon-shenhezhong {
		font-size: 26rpx;
	}

	.newsDetail .conters {
		padding: 0 30rpx;
		font-size: 32rpx;
		// color: #8A8B8C;
		line-height: 1.7;

		/deep/ img {
			max-width: 100%;
		}
	}

	.newsDetail .picTxt {
		width: 690rpx;
		height: 200rpx;
		border-radius: 20rpx;
		border: 1px solid #e1e1e1;
		position: relative;
		margin: 30rpx auto 0 auto;
	}

	.newsDetail .picTxt .pictrue {
		width: 200rpx;
		height: 200rpx;
	}

	.newsDetail .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx 0 0 20rpx;
		display: block;
	}

	.newsDetail .picTxt .text {
		width: 460rpx;
	}

	.newsDetail .picTxt .text .name {
		font-size: 30rpx;
		color: #282828;
	}

	.newsDetail .picTxt .text .money {
		font-size: 24rpx;
		margin-top: 40rpx;
		font-weight: bold;
	}

	.newsDetail .picTxt .text .money .num {
		font-size: 36rpx;
	}

	.newsDetail .picTxt .text .y_money {
		font-size: 26rpx;
		color: #999;
		text-decoration: line-through;
	}

	.newsDetail .picTxt .label {
		position: absolute;
		background-color: #303131;
		width: 160rpx;
		height: 50rpx;
		right: -7rpx;
		border-radius: 25rpx 0 6rpx 25rpx;
		text-align: center;
		line-height: 50rpx;
		bottom: 24rpx;
	}

	.newsDetail .picTxt .label .span {
		background-image: linear-gradient(to right, #fff71e 0%, #f9b513 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.newsDetail .picTxt .label:after {
		content: " ";
		position: absolute;
		width: 0;
		height: 0;
		border-bottom: 8rpx solid #303131;
		border-right: 8rpx solid transparent;
		top: -7rpx;
		right: 0;
	}

	.newsDetail .bnt {
		color: #fff;
		font-size: 30rpx;
		width: 690rpx;
		height: 90rpx;
		border-radius: 45rpx;
		margin: 48rpx auto;
		text-align: center;
		line-height: 90rpx;
	}
</style>
