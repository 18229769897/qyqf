<template>
	<view :style="viewColor">
		<view class='collectionGoods' v-if="collectProductList.length">
			<view class='item acea-row row-between-wrapper' v-for="(item,index) in collectProductList" :key="index" v-if="item.spu" @tap="goDetail(item.spu)">
				<view class='pictrue' >
					<easy-loadimage mode="widthFix" :image-src="item.spu.image"></easy-loadimage>
				</view>
				<view class='text acea-row row-column-between'>
					<view class='name'>
						<text v-if="item.spu.product_type != 0" :class="'font_bg-red type'+item.spu.product_type">{{item.spu.product_type == 1 ? "秒杀" : item.spu.product_type == 2 ? "预售" : item.spu.product_type == 3 ? "助力" : item.spu.product_type == 4 ? "拼团" : ""}}</text>
						<text class="name_text line1">{{item.spu.store_name}}</text>
					</view>
					<view class='acea-row row-between-wrapper'>
						<view class='money'>￥{{item.spu.price}}</view>
						<view class='delete' @click.stop='delCollection(item.type_id,index)'>删除</view>
					</view>
				</view>
			</view>
			<view class='loadingicon acea-row row-center-wrapper'>
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
			</view>
		</view>
		<view class='noCommodity' v-else-if="!collectProductList.length && page > 1">
			<view class='pictrue'>
				<image src='../static/images/noCollection.png'></image>
			</view>
			<recommend :hostProduct="hostProduct" :isLogin="isLogin"></recommend>
		</view>
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
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
	import { getCollectUserList, getProductHot, userCollectDel } from '@/api/store.js';
	import { goShopDetail } from '@/libs/order.js'
	import {openBargainSubscribe} from '@/utils/SubscribeMessage.js'
	import {initiateAssistApi} from '@/api/activity.js'
	import { mapGetters } from "vuex";
	import recommend from '@/components/recommend';
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	import authorize from '@/components/Authorize';
	export default {
		components: {
			recommend,
			easyLoadimage,
			authorize
		},
		data() {
			return {
				hostProduct: [],
				loadTitle: '加载更多',
				loading: false,
				loadend: false,
				collectProductList: [],
				limit: 8,
				page: 1,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false ,//是否隐藏授权
				hotScroll:false,
				hotPage:1,
				hotLimit:10
			};
		},
		computed: mapGetters(['isLogin','viewColor']),
		onLoad() {
			if (this.isLogin) {
				this.get_user_collect_product();
				this.get_host_product();
			} else {
				this.isAuto = true;
                this.isShowAuth = true
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		methods: {
			/**
			 * 授权回调
			 */
			onLoadFun: function() {
				this.isShowAuth = false;
				this.get_user_collect_product();
				this.get_host_product();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
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
                    this.isAuto = true;
                    this.isShowAuth = true
					}
				})
			},
			/**
			 * 获取收藏产品
			 */
			get_user_collect_product: function() {
				let that = this;
				if (this.loading) return;
				if (this.loadend) return;
				that.loading = true;
				that.loadTitle = "";
				getCollectUserList({
					page: that.page,
					limit: that.limit
				}).then(res => {
					let collectProductList = res.data.list;
					let loadend = collectProductList.length < that.limit;
					that.collectProductList = that.$util.SplitArray(collectProductList, that.collectProductList);
					that.$set(that, 'collectProductList', that.collectProductList);
					that.loadend = loadend;
					that.loadTitle = loadend ? '我也是有底线的' : '加载更多';
					that.page = that.page + 1;
					that.loading = false;
				}).catch(err => {
					that.loading = false;
					that.loadTitle = "加载更多";
				});
			},
			/**
			 * 取消收藏
			 */
			delCollection: function(id, index) {
				let that = this;
				userCollectDel({
					type:1,
					type_id:id
				}).then(res => {
					return that.$util.Tips({
						title: '取消收藏成功',
						icon: 'success'
					}, function() {
						that.collectProductList.splice(index, 1);
						that.$set(that, 'collectProductList', that.collectProductList);
					});
				});
			},
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				if(that.hotScroll) return
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					that.hotPage++
					that.hotScroll = res.data.list.length<that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data.list)
				});
			}

		},
		onReachBottom() {
			this.get_user_collect_product();
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		}
	}
</script>

<style scoped lang="scss">
	.collectionGoods {
		background-color: #fff;
		border-top: 1rpx solid #eee;
	}
	.font_bg-red {
		background-color: var(--view-theme);
		border: 1rpx solid var(--view-theme);
		&.type2{
			background-color: #FD6523;
			border: 1rpx solid #FD6523;
		}
	}
	.collectionGoods .item {
		margin-left: 30rpx;
		padding-right: 30rpx;
		border-bottom: 1rpx solid #eee;
		height: 180rpx;
	}

	.collectionGoods .item .pictrue {
		width: 130rpx;
		height: 130rpx;
	}

	/deep/.collectionGoods .item .pictrue image,
	/deep/.collectionGoods .item .easy-loadimage, .collectionGoods .item uni-image{
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}

	.collectionGoods .item .text {
		width: 535rpx;
		height: 130rpx;
		font-size: 28rpx;
		color: #282828;
	}

	.collectionGoods .item .text .name {
		width: 100%;
		display: flex;
		align-items: center;
	}
	.collectionGoods .item .name_text{
		display: inline-block;
		max-width: 400rpx;
	}

	.collectionGoods .item .text .money {
		font-size: 26rpx;
		color: var(--view-priceColor);
	}

	.collectionGoods .item .text .delete {
		font-size: 26rpx;
		color: #282828;
		width: 144rpx;
		height: 46rpx;
		border: 1px solid #bbb;
		border-radius: 24rpx;
		text-align: center;
		line-height: 46rpx;
	}

	.noCommodity {
		background-color: #fff;
		padding-top: 1rpx;
		border-top: 0;
	}
</style>
