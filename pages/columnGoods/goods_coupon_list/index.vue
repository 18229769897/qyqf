<template>
	<view :style="viewColor">
		<view class='productList'>
			<view class='search acea-row row-between-wrapper'>
				<view class="back" @click='set_where(1)'>
					<view class="iconfont icon-xiangzuo"></view>
				</view>
				<view class='input acea-row row-between-wrapper'><text class='iconfont icon-sousuo'></text>
					<input placeholder='输入商品名称搜索' placeholder-class='placeholder' confirm-type='search' name="search" :value='where.keyword'
					 @confirm="searchSubmit"></input>
				</view>
			</view>
			<view class="nav-wrapper">
					<view class='nav acea-row row-middle'>
						<view class='item' @click="downStatus = !downStatus" :class="{'t-color':downKey>0 && firstKey == 0}">
							{{downMenu[downKey].title}}
							<text v-if="!downStatus" class="iconfont icon-xiala1 spin"></text>
							<text v-else class="iconfont icon-xiala1"></text>
						</view>
						<view class='item' :class="{'t-color':firstKey == 3}" @click='set_where(3)'>
							销量
						</view>
						<view class='item' :class="{'t-color':firstKey == 2}" @click='set_where(2)'>
							价格
							<image v-if="price==1" :src="domain+'/static/diy/up'+keyColor+'.png'"></image>
							<image v-else-if="price==2" :src="domain+'/static/diy/down'+keyColor+'.png'"></image>
							<image v-else src='/static/images/horn.png'></image>
						</view>
						<!-- down -->
						<view class='item' :class="{'t-color':firstKey == 4}" @click='bindRight'>
							筛选
							<text class="iconfont icon-shaixuan"></text>
						</view>
					</view>
			</view>

			<block>
				<view class="container">
					<view v-if="productList.length>0" class="coupon_count acea-row">
						<text class="text">以下商品适用于</text>
						<text class="coupon_used" :style="{ 'background-image': `url(${domain}/static/diy/coupon${keyColor}.png)` }">满{{couponData.use_min_price}}减{{couponData.coupon_price}}</text>
					</view>
					<!-- 商品 -->
					<view class='list acea-row row-between-wrapper on'>
						<view class='item on' hover-class='none' v-for="(item,index) in productList" :key="index"
						 @click="godDetail(item)">
							<view class='pictrue on'>
								<image :src='item.image' class="on"></image>
							</view>
							<view class='text on acea-row row-between-wrapper'>
								<view class='name line1'>
									<text class="text_name line1">{{item.store_name}}</text>
								</view>
								<view class="item_bot">
									<view class='money t-color on'>
										￥<text class='num'>{{item.price}}</text>
									</view>
									<view class="item_tags acea-row">
										<text v-if="item.merchant.type_name && item.product_type == 0" class="font-bg-red">{{item.merchant.type_name}}</text>
										<text v-else-if="item.merchant.is_trader && item.product_type == 0" class="font-bg-red">自营</text>
										<text v-if="item.product_type != 0" :class="'font_bg-red type'+item.product_type">{{item.product_type == 1 ? "秒杀" : item.product_type == 2 ? "预售" : item.product_type == 3 ? "助力" : item.product_type == 4 ? "拼团" : ""}}</text>
										<text class="tags_item ticket" v-if="item.issetCoupon">领券</text>
										<text class="tags_item delivery" v-if="item.delivery_free == 1">包邮</text>
									</view>
									<view class="score">{{item.rate}}评分 {{item.reply_count}}条评论</view>
									<view class="company" v-if="item.merchant" @click.stop="goShop(item.mer_id)">
										<text class="line1">{{item.merchant.mer_name}}</text>
										<view class="flex">
											进店
											<text class="iconfont icon-xiangyou"></text>
										</view>
									</view>
								</view>

							</view>
						</view>
					</view>
				</view>


				<view class='noCommodity' v-if="productList.length==0 && where.page > 1">
					<view class='pictrue' style="margin: 60rpx auto;">
						<image src='/static/images/noShopper.png'></image>
					</view>
					<recommend :hostProduct="hostProduct" :isLogin="isLogin"></recommend>
				</view>
			</block>
			<rightSlider v-if="rightBox" :status="rightBox" :brandList="brandList" @confirm="confirm" @close="close"></rightSlider>
		</view>
		<view class="down-wrapper" v-if="downStatus">
			<view class="bg"></view>
			<view class="down-box">
				<view class="down-item" v-for="(item,index) in downMenu" :key="item.key" :class="{'on':index == downKey}" @click="bindDown(item,index)">
					{{item.title}}
					<text v-if="index == downKey" class="iconfont icon-gou"></text>
				</view>
			</view>
		</view>
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
		<!-- #ifndef H5 -->
		<passwordPopup></passwordPopup>
		<!-- #endif -->
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
	import { getCouponProductlist, getProductHot, getBrandlist } from '@/api/store.js';
	import recommend from '@/components/recommend';
	import rightSlider from '@/components/rightSlider.vue'
	import WaterfallsFlow from '@/components/WaterfallsFlow/WaterfallsFlow.vue'
	import {openBargainSubscribe} from '@/utils/SubscribeMessage.js';
	import {initiateAssistApi} from '@/api/activity.js';
	import { mapGetters } from "vuex";
	import { configMap } from "@/utils";
	import { HTTP_REQUEST_URL } from '@/config/app';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import authorize from '@/components/Authorize';
	import {
		goShopDetail
	} from '@/libs/order.js'
	const app = getApp();
	export default {
		computed: configMap(['hide_mer_status'],mapGetters(['uid','isLogin','scrollTop','viewColor','keyColor'])),
		components: {
			// #ifndef H5
			passwordPopup,
			// #endif
			recommend,
			rightSlider,
			WaterfallsFlow,
			authorize,
		},
		watch:{

		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				productList: [],
				couponData: {},
				list: [],
				where: {
					coupon_id: '',
					cate_id: '',
					order: '',
					price_on: '',
					price_off: '',
					brand_id: '',
					keyword:'',
					page:1,
					limit:30
				},
				price: 0,
				stock: 0,
				nows: false,
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				title: '',
				hostProduct: [],
				hotPage: 1,
				hotLimit: 10,
				hotScroll: false,
				// 筛选框
				rightBox: false,
				//品牌列表
				brandList: [],
				downKey: 0,
				downStatus: false,
				// 下拉菜单
				downMenu: [{
						title: '综合排序',
						key: 1,
					},
					{
						title: '评分',
						key: 2,
					},
					{
						title: '新品',
						key: 3,
					}
				],
				// 是否第一个
				firstKey:0,
				// tab切换
				tabIndex: 1,
				// 商铺列表
				storeList: [],
				sotreParam:{
					keyword:'',
					page:1,
					limit:30,
					order:''
				},
				storeKey:0,
				storeScroll:true,
				isShowAuth: false, //是否隐藏授权
				isAuto: false, //没有授权的不会自动授权
			};
		},
		// 滚动监听
		onPageScroll() {
			uni.$emit('scroll');
		},
		onLoad: function(options) {
			this.$set(this.where, 'cate_id', options.id || '');
			this.$set(this.where, 'coupon_id', options.coupon_id || '');
			this.title = options.title || '';
			this.$set(this.where, 'keyword', options.searchValue || '');
			this.get_product_list(true);
			this.get_host_product();
		},
		onReady(){},
		mounted: function() {
			this.get_product_list(true);
		},
		methods: {
			// 授权回调
			onLoadFun() {
				this.isShowAuth = false
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			// 去店铺
			goShop(id){
				if(this.hide_mer_status != 1){
					uni.navigateTo({
						url:`/pages/store/index?id=${id}`
					})
				}
			},

			// 店铺排序
			storeTab(key){
				this.storeKey = key
				if(key == 0){
					this.sotreParam.order = ''
				}else if(key == 1){
					this.sotreParam.order = 'sales'
				}else{
					this.sotreParam.order = 'rate'
				}
				this.sotreParam.page = 1
				this.storeScroll = true
				this.storeList = []
			},
			// 右侧切换
			bindRight(){
				this.price = 0;
				this.firstKey = 4
				this.getBrandlist()

			},
			// 品牌列表
			getBrandlist(){
				let temp = []
				getBrandlist({
					cate_id:this.where.cate_id,
					keyword:this.where.keyword
				}).then(res=>{
					temp = res.data.list.map(item=>{
						return {
							...item,
							check:false
						}
					})
					if(this.where.brand_id.length>0){
						this.where.brand_id.forEach((ids,index)=>{
							temp.forEach(el=>{
								if(ids == el.brand_id){
									el.check = true
								}
							})
						})
					}
					this.brandList = temp
					this.rightBox = true
				})
			},
			// 去详情页
			godDetail(item) {
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
			// 组件确定
			confirm(data) {
				let arr = []
				if(data.brandList.length == 0){
					this.where.brand_id = ''
				}else{
					data.brandList.forEach(item =>{
						arr.push(item.brand_id)
					})
					this.where.brand_id =arr
				}
				this.rightBox = data.status
				this.where.price_on = data.price_on
				this.where.price_off = data.price_off
				this.loadend = false;
				this.$set(this.where, 'page', 1)
				this.get_product_list(true);

			},
			// 组件关闭
			close() {
				this.rightBox = false
			},
			// 下拉选项
			bindDown(item, index) {
				this.firstKey = 0
				if(index == 0){
					this.where.order = ''
				}else if(index == 1){
					this.where.order = 'rate'
				}else if(index == 2){
					this.where.order = 'is_new'
				}
				this.downKey = index
				this.downStatus = false
				this.loadend = false;
				this.$set(this.where, 'page', 1)
				this.get_product_list(true);
			},
			searchSubmit: function(e) {
				let that = this;
				that.$set(that.where, 'keyword', e.detail.value);

					that.loadend = false;
					that.$set(that.where, 'page', 1)
					this.get_product_list(true);


			},
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
					that.hotScroll = res.data.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data.list)
					// that.$set(that, 'hostProduct', res.data)
				});
			},
			//点击事件处理
			set_where: function(e) {
				switch (e) {
					case 1:
					uni.setStorageSync('storeIndex', this.where.cate_id);
					uni.navigateBack()
					break
					case 2:
						this.firstKey = e
						if (this.price == 0){
							this.price = 1;
							this.where.order = 'price_asc'
						}else if (this.price == 1){
							this.price = 2;
							this.where.order = 'price_desc'
						}else if (this.price == 2){
							this.price = 0;
							this.where.order = ''
						}
						this.$set(this.where, 'page', 1)
						this.get_product_list(true);
						break;
					case 3:
						this.price = 0;
						this.loadend = false;
						this.$set(this.where, 'order', 'sales')
						this.$set(this.where, 'page', 1)
						this.get_product_list(true);
						this.firstKey = e
						break;
				}
				this.loadend = false;
				this.$set(this.where, 'page', 1);
				this.get_product_list(true);
			},
			//查找产品
			get_product_list: function(isPage) {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				if (isPage === true) that.$set(that, 'productList', []);
				that.loading = true;
				that.loadTitle = '';
				getCouponProductlist(that.where).then(res => {
					this.couponData = res.data.coupon;
					let list = res.data.list;
					let productList = that.$util.SplitArray(list, that.productList);
					let loadend = list.length < that.where.limit;
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? '已全部加载' : '加载更多';
					that.$set(that, 'productList', productList);
					that.$set(that.where, 'page', that.where.page + 1);
				}).catch(err => {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
			},
		},
		onPullDownRefresh() {

		},
		onReachBottom() {
			if (this.productList.length > 0) {
				this.get_product_list('');
			} else {
				this.get_host_product();
			}
		},
		onPullDownRefresh(){
			// 模拟上拉刷新
			setTimeout(()=>{
				const newList = this.productList.reverse();
				this.productList = newList;
				uni.stopPullDownRefresh();
			},500)
		}
	}
</script>
<style lang="scss">
	.productList .search {
		width: 100%;
		height: 86rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 9;
		background-color: var(--view-theme);
	}

	.productList .search .back {
		display: flex;
		align-items: center;
		width: 40rpx;
		height: 60rpx;

		.iconfont {
			color: #fff;
			font-size: 36rpx;
		}
	}
	.font-bg-red {
		background-color: var(--view-theme);
		border: 1rpx solid var(--view-theme);
		&.type2{
			background-color: #FD6523;
			border: 1rpx solid #FD6523;
		}
	}
	.productList .search .input {
		width: 650rpx;
		height: 60rpx;
		background-color: #fff;
		border-radius: 50rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.productList .search .input input {
		flex: 1;
		height: 100%;
		font-size: 26rpx;
		margin-left: 10rpx;
	}

	.productList .search .input .placeholder {
		color: #999;
	}

	.productList .search .input .iconfont {
		font-size: 35rpx;
		color: #555;
	}

	.productList .search .icon-pailie,
	.productList .search .icon-tupianpailie {
		color: #fff;
		width: 62rpx;
		font-size: 40rpx;
		height: 86rpx;
		line-height: 86rpx;
	}

	.productList .nav-wrapper {
		z-index: 9;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		margin-top: 86rpx;
		background-color: var(--view-theme);

		.tab-bar {
			display: flex;
			align-items: center;

			.tab-item {
				position: relative;
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 8rpx 0 20rpx;
				color: #fff;
				font-size: 28rpx;
				font-weight: bold;

				&::after {
					content: ' ';
					position: absolute;
					left: 50%;
					bottom: 18rpx;
					width: 30rpx;
					height: 3rpx;
					background: transparent;
					transform: translateX(-50%);
				}

				&.on {
					&::after {
						background: #fff;
					}
				}
			}
		}
	}

	.productList .nav {
		height: 86rpx;
		color: #454545;
		font-size: 28rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		padding: 0 28rpx;
	}

	.productList .nav .item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}

	.productList .nav .item.t-color {
		font-weight: bold;
	}

	.productList .nav .item image {
		width: 15rpx;
		height: 19rpx;
		margin-left: 10rpx;
	}

	.productList .list {
		padding: 0 20rpx;
	}
	.productList .list.on {
		background-color: #fff;
		border-top: 1px solid #f6f6f6;
	}
.item_tags{
	margin-top: 8rpx;
}
.item_tags .tags_item {
	display: inline-block;
	font-size: 20rpx;
	text-align: center;
	border-radius: 5rpx;
	padding: 0 4rpx;
	line-height: 28rpx;
	margin-right: 8rpx;

}
.item_tags .tags_item.ticket{
	color: #E93323;
	border: 1rpx solid #E93323;
}
.item_tags .tags_item.delivery{
	color: #FF9000;
	border: 1rpx solid #FF9000;
}
.container{
	margin-top: 168rpx;
}
.coupon_count{
	background: var(--view-minorColor);
	padding: 15rpx 30rpx 12rpx;

	color: var(--view-theme);
	font-size: 26rpx;
	line-height: 36rpx;
	.text{
		padding: 4rpx 0;
	}
}
.coupon_used{
	display: flex;
	align-items: center;
	justify-content: center;
	max-width: 300rpx;
	padding: 3rpx 16rpx;
	margin-left: 10rpx;
	background-size: 100% 100%;
	font-size: 24rpx;
	font-weight: normal;
	color: var(--view-priceColor);
	
}
	.noCommodity {
		background-color: #fff;
		padding-bottom: 30rpx;
	}

	.spin {
		display: block;
		transform: rotate(180deg);
		font-size: 36rpx;
	}

	.icon-xiala1 {
		margin-top: 6rpx;
	}

	.icon-shaixuan {
		font-size: 30rpx;
		margin-left: 10rpx;
	}

	.down-wrapper {
		.bg {
			z-index: 8;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .5);
		}
		.down-box {
			z-index: 8;
			position: fixed;
			left: 0;
			top: 170rpx;
			width: 100%;
			padding: 0 40rpx 28rpx 74rpx;
			background-color: #F8F8F8;
			border-radius: 0 0 24rpx 24rpx;
			.down-item {
				margin-top: 28rpx;
				font-size: 24rpx;
				color: #454545;
				&.on {
					color: var(--view-theme);
				}
				.iconfont{
					float: right;
				}
			}
		}
	}

	.store-wrapper {
		margin-top: 240rpx;
		border-top: 1px solid #F6F6F6;

		.star-box {
			display: flex;
			align-items: center;

			.star {
				position: relative;
				width: 111rpx;
				height: 19rpx;
				background: url(~pages/columnGoods/images/star.png);
				background-size: 111rpx 19rpx;
			}

			.star-active {
				position: absolute;
				left: 0;
				top: 0;
				width: 111rpx;
				height: 19rpx;
				overflow: hidden;
				background: url(~pages/columnGoods/images/star_active.png);
				background-size: 111rpx 19rpx;
			}

			.num {
				color: $theme-color;
				font-size: 24rpx;
				margin-left: 10rpx;
			}
		}

		.store-item {
			margin-bottom: 12rpx;
			padding: 40rpx 20rpx;
			background-color: #fff;

			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left-wrapper {
					display: flex;
					align-items: center;

					.logo {
						width: 80rpx;
						height: 80rpx;

						image {
							width: 80rpx;
							height: 80rpx;
							border-radius: 6rpx;
						}
					}

					.con-box {
						margin-left: 20rpx;

						.name {
							font-size: 30rpx;
							color: #333;
							font-weight: bold;
						}
					}
				}

				.link {
					width: 114rpx;
					height: 50rpx;
					line-height: 50rpx;
					background: linear-gradient(-90deg, rgba(246, 122, 56, 1) 0%, rgba(241, 27, 9, 1) 100%);
					border-radius: 25rpx;
					text-align: center;
					color: #fff;
					font-size: 24rpx;
				}
			}

			.pic-wrapper {
				display: flex;
				margin-top: 30rpx;

				.pic-item {
					position: relative;
					width: 226rpx;
					height: 226rpx;
					margin-right: 16rpx;

					image {
						width: 226rpx;
						height: 226rpx;
						border-radius: 16rpx;
					}

					.price {
						position: absolute;
						right: 0;
						bottom: 0;
						height: 36rpx;
						padding: 0 10rpx;
						line-height: 36rpx;
						text-align: center;
						background: rgba(0, 0, 0, .5);
						border-radius: 16rpx 2rpx 16rpx 2rpx;
						color: #fff;
						font-size: 24rpx;

						text {
							font-size: 18rpx;
						}
					}

					&:nth-child(3n) {
						margin-right: 0;
					}
				}
			}
		}
	}
	.productList .list .item.on {
		width: 100%;
		display: flex;
		border-bottom: 1rpx solid #f6f6f6;
		padding: 30rpx 0;
		margin: 0;
		position: relative;
	}
	.productList .list .item .pictrue.on {
		width: 260rpx;
		height: 260rpx;
	}
	.productList .list .item .pictrue image {
		width: 260rpx;
		height: 260rpx;
		border-radius: 16rpx;
	}
	.productList .list .item .text {
		font-size: 30rpx;
		color: #222;
		width: 460rpx;
		padding: 0 0 0 22rpx;
		justify-content: space-between;
		.name,.item_bot{
			width: 100%;
		}
	}

	.productList .list .item .text .money {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		font-weight: bold;
		color: var(--view-priceColor);
	}
	.productList .list .item .text .money .num {
		font-size: 34rpx;
	}
	.productList .distance {
		display: flex;
		align-items: center;
		font-size: 24rpx;
		color: #999999;

		.icon-xiangyou {
			font-size: 24rpx;
			line-height: 24rpx;
		}
	}


	.productList .list .item .text .score {
		margin-top: 10rpx;
		color: #737373;
		font-size: 20rpx;
	}

	.productList .list .item .text .company {
		display: flex;
		align-items: center;
		color: #737373;
		font-size: 20rpx;
		margin-top: 10rpx;

		.name {
			display: inline-block;
			width: 200rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.flex {
			display: flex;
			align-items: center;
			margin-left: 10rpx;
			color: #282828;
			.iconfont {
				font-size: 16rpx;
				margin-top: 4rpx;
			}
		}
	}

</style>
