<template>
	<view class="product-con">
		<view v-if="storeInfo && storeInfo.merchant">
			<scroll-view :scroll-top="scrollTop" scroll-y='true' scroll-with-animation="true" :style='"height:"+height+"px;"'
			 @scroll="scroll">
				<view id="past0">
					<productConSwiper :imgUrls="storeInfo.slider_image" :videoCoverImg="videoCoverImg" :videoline="storeInfo.video_link"></productConSwiper>
					<!--秒杀-->
					<view v-if="storeInfo.product_type == 1" class='nav acea-row row-between-wrapper'>
						<view class='money'>￥<text class='num'>{{storeInfo.price}}</text><text class='y-money'>￥{{storeInfo.ot_price}}</text></view>
						<view class='acea-row row-middle'>
							<view class='time'>
								<view>距秒杀结束仅剩</view>
								<countDown :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="' : '" :minute-text="' : '" :second-text="' '" :datatime="datatime"></countDown>
							</view>
						</view>
					</view>
					<!--预售-->
					<view v-if="storeInfo.product_type == 2" class='wrapper'>
						<view class='share acea-row row-between row-bottom' style="padding: 0;margin: 0;">
							<view class='money font-color'>
								￥
								<text class='num'>{{storeInfo.price}}</text>
								<text class="price_text">预售价</text>
							</view>
							<view class='iconfont icon-fenxiang' v-if="comForm != 'admin'"></view>
						</view>
						<view class='label acea-row'>
							<view>市场价:￥{{storeInfo.ot_price || ''}}</view>
							<view style="margin-left: 30rpx;">已预定:0{{ storeInfo.unit_name }}</view>
						</view>
						<view class='introduce line2'>
							<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
							<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red">自营</text>
							{{storeInfo.store_name}}</view>
						<view class="presell_count">
							<view>
								<view>预售活动时间：</view>
								<view v-if="storeInfo.start_time && storeInfo.p_end_time" class="presell_time">
									<view class='iconfont icon-shijian1'></view>
									{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getDate() }}日{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getHours() }}时{{ new Date(storeInfo.start_time.replace(/-/g,"/")).getMinutes()}}分
									<span class='area_line'>~</span>
									<view class='iconfont icon-shijian1'></view>
									{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getDate() }}日{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getHours() }}时{{ new Date(storeInfo.p_end_time.replace(/-/g,"/")).getMinutes()}}分
								</view>
							</view>
							<view v-if="storeInfo.presell_type === 2">
								<view>支付尾款时间：</view>
								<view v-if="storeInfo.final_start_time && storeInfo.final_end_time" class="presell_time">
									<view class='iconfont icon-shijian1'></view>
									{{ new Date(storeInfo.final_start_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(storeInfo.final_start_time.replace(/-/g,"/")).getDate() }}日{{ new Date(storeInfo.final_start_time.replace(/-/g,"/")).getHours() }}时{{ new Date(storeInfo.final_start_time.replace(/-/g,"/")).getMinutes()}}分
									<span class='area_line'>~</span>
									<view class='iconfont icon-shijian1'></view>
									{{ new Date(storeInfo.final_end_time.replace(/-/g,"/")).getMonth()+1 }}月{{ new Date(storeInfo.final_end_time.replace(/-/g,"/")).getDate() }}日{{ new Date(storeInfo.final_end_time.replace(/-/g,"/")).getHours() }}时{{ new Date(storeInfo.final_end_time.replace(/-/g,"/")).getMinutes()}}分

								</view>
							</view>
							<view v-if="storeInfo.delivery_type == 1">
								<view v-if="storeInfo.presell_type==1">支付成功后{{ storeInfo.delivery_day }}天内发货</view>
								<view v-if="storeInfo.presell_type==2">付尾款成功后{{ storeInfo.delivery_day }}天内发货</view>
							</view>
							<view v-if="storeInfo.delivery_type == 2">预售结束后{{ storeInfo.delivery_day }}天内发货</view>
						</view>
					</view>
					<!--拼团-->
					<view v-if="storeInfo.product_type == 4" class='wrapper'>
						<view class='share acea-row row-between row-bottom' style="padding: 0;margin: 0;">
							<view class='money '>
								<text class="font-color">￥<text class='num'>{{storeInfo.price}}</text></text>
								<text class="font-gray orig_price">￥<text class='num' style="font-size: 28rpx;">{{storeInfo.ot_price}}</text></text>
							</view>

							<view class='iconfont icon-fenxiang' v-if="comForm != 'admin'"></view>
						</view>

						<view class='introduce line2'>
							<text v-if="(storeInfo.merchant && storeInfo.merchant.type_name)" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
							<text v-else-if="(storeInfo.merchant && storeInfo.merchant.is_trader)" class="font-bg-red">自营</text>
							{{storeInfo.store_name}}
						</view>
						<view class='label acea-row row-between-wrapper'>
							<view>类型:{{storeInfo.buying_count_num ? storeInfo.buying_count_num : 0}}人团</view>
							<view>库存:{{storeInfo.stock ? storeInfo.stock : 0}}</view>
							<view>已拼:{{storeInfo.sales ? storeInfo.sales : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}</view>
						</view>

					</view>
					<view v-if="storeInfo.product_type == 4" class="combination_wrapper">
						<view class='notice acea-row row-middle' v-if="itemNew.length">
							<view class='num font-color'>
								<text class='iconfont icon-laba'></text>
								已拼{{storeInfo.sales ? storeInfo.sales : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}<text
								 class='line'>|</text>
							</view>
							<view class='swiper'>
								<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" interval="2500" duration="500" vertical="true"
								 circular="true">
									<block v-for="(item,index) in itemNew" :key='index'>
										<swiper-item>
											<view class='line1'>{{item.nickname ? item.nickname : ''}}拼团成功</view>
										</swiper-item>
									</block>
								</swiper>
							</view>
						</view>
						<view class='assemble' v-if="pink.length" :style="itemNew.length ? '' : 'margin-top: 20rpx;'">
							<view class='item acea-row row-between-wrapper' v-for='(item,index) in pink' :key='index' v-if="index < AllIndex && pink.length>0">
								<view class='pictxt acea-row row-between-wrapper'>
									<view class='pictrue'>
										<image :src='item.initiator.avatar ? item.initiator.avatar : "/static/images/f.png"'></image>
									</view>
									<view class='text line1'>{{ item.initiator.nickname ? item.initiator.nickname : ""}}</view>
								</view>
								<view class='right acea-row row-middle'>
									<view>
										<view class='lack'>还差<text class='font-color'>{{item.buying_count_num - item.yet_buying_num}}</text>人成团</view>
										<view class='time'>
											剩余
											<count-down :justifyLeft="justifyLeft" :is-day="false" :tip-text="' '" :day-text="' '" :hour-text="':'"
											 :minute-text="':'" :second-text="' '" :datatime="item.end_time"></count-down>
										</view>
									</view>
									<navigator hover-class='none' :url="'/pages/activity/combination_status/index?id='+item.group_buying_id" class='spellBnt'>
										去拼单
										<text class='iconfont icon-jiantou'></text>
									</navigator>
								</view>
							</view>
							<template v-if="pink.length">
								<view class='more' @tap='showAll' v-if="pink.length > AllIndex">查看更多<text class='iconfont icon-xiangxia'></text></view>
								<view class='more' @tap='hideAll' v-else-if="pink.length === AllIndex && pink.length !== AllIndexDefault">收起<text
									 class='iconfont icon-xiangshang'></text></view>
							</template>
						</view>
						<view class='playWay'>
							<view class='title acea-row row-between-wrapper'>
								<view>拼团玩法</view>
							</view>
							<view class='way acea-row row-middle'>
								<view class='item'>
									<text class='num'>①</text>
									<text class="way_text">开团/参团</text>
								</view>
								<view class='iconfont icon-arrow'></view>
								<view class='item'>
									<text class='num'>②</text>
									<text class="way_text">邀请好友</text>
								</view>
								<view class='iconfont icon-arrow'></view>
								<view class='item'>
									<view>
										<text class='num'>③</text>
										<text class="way_text">满员发货</text>
									</view>
									<view class='tip'>不满自动退款</view>
								</view>
							</view>
						</view>
					</view>
					<view v-if="storeInfo.product_type == 0 || storeInfo.product_type == 3 || storeInfo.product_type == 1" class='wrapper'>
						<view v-if="storeInfo.product_type != 1" class='share acea-row row-between row-bottom' style="padding: 0;margin: 0;">
							<view class='money font-color'>
								￥
								<text class='num'>{{storeInfo.price}}</text>
							</view>
							<view class='iconfont icon-fenxiang' v-if="comForm != 'admin'"></view>
						</view>
						<view class='introduce line2'>
							<text v-if="storeInfo.merchant.type_name" class="font-bg-red">{{storeInfo.merchant.type_name}}</text>
							<text v-else-if="storeInfo.merchant.is_trader" class="font-bg-red bg">自营</text>{{storeInfo.store_name ? storeInfo.store_name : ''}}
							</view>
						<view class='label acea-row row-between-wrapper' style="padding-bottom: 10px">
							<view v-if="storeInfo.product_type != 3">原价:￥{{storeInfo.ot_price ? storeInfo.ot_price : ''}}</view>
							<view>库存:{{storeInfo.stock ? storeInfo.stock : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}</view>
							<view>销量:{{storeInfo.sales ? storeInfo.sales : 0}}{{storeInfo.unit_name ? storeInfo.unit_name : ''}}</view>
						</view>
					</view>
					<view class='attribute acea-row row-between-wrapper' @click="selecAttr">
						<view class="acea-row row-between-wrapper">{{attrTxt}}：
							<text class='atterTxt'>{{attrValue}}</text>
						</view>
						<view class='iconfont icon-jiantou'></view>
					</view>
					<!--运费-->
					<view class='attribute acea-row row-between-wrapper' @click="showShip">
						<view class="acea-row row-between-wrapper">运费：
							<text class='atterTxt'>{{shippingValue}}</text>
						</view>
						<view class='iconfont icon-jiantou'></view>
					</view>
					<!--保障-->
					<view v-if="guarantee && guarantee.length" class='attribute acea-row row-between-wrapper' @click="showGuaranee">
						<view class="acea-row row-between-wrapper">保障：
						<view class="guaranteeAttr">
							<text class='atterTxt1' :class="item.guarantee_name ? 'hasAttr' : ''"  v-for="(item,index) in guarantee">
								{{item.guarantee_name ? item.guarantee_name : ''}}
							</text>
						</view>

						</view>
						<view class='iconfont icon-jiantou'></view>
					</view>
					<!--定金预售流程-->
					<view v-if="storeInfo.presell_type === 2" class='acea-row row-between-wrapper wrapper presell_process'>
						<view>流程：
							<view class='process_count'>
								<view class="process_line"></view>
								<span class="text_line text_line1"><text>定金</text></span>
								<span class="text_line text_line2"><text>尾款</text></span>
								<span class="text_line text_line3"><text>发货</text></span>
							</view>
						</view>
					</view>
				</view>
				<!-- 商铺信息 -->
				<view class="store-wrapper" v-if="storeInfo.merchant && hide_mer_status !=1">
					<view class="store-hd">
						<view class="store-info">
							<view class="logo">
								<image :src="storeInfo.merchant.mer_avatar" mode=""></image>
							</view>
							<view class="info">
								<view class="name">{{storeInfo.merchant.mer_name ? storeInfo.merchant.mer_name : ''}}
									<text v-if="storeInfo.merchant.type_name" class="font-bg-red ml8">{{storeInfo.merchant.type_name}}</text>
									<text v-else-if="storeInfo.merchant.is_trader" class="font-bg-red ml8">自营</text>
								</view>
								<view v-if="storeInfo.merchant.care_count" class="txt">
									{{storeInfo.merchant.care_count < 10000 ? storeInfo.merchant.care_count : (storeInfo.merchant.care_count/10000).toFixed(2)+'万'}}人关注
								</view>
								<view v-else class="txt">0人关注</view>
							</view>
						</view>
						<view class="score-wrapper">
							<view class="item">
								商品描述<text>{{storeInfo.merchant.product_score}}</text>
							</view>
							<view class="item">
								卖家服务<text>{{storeInfo.merchant.service_score}}</text>
							</view>
							<view class="item">
								物流服务<text>{{storeInfo.merchant.postage_score}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class='product-intro' id="past3">
					<view class='title'>产品介绍</view>
					<jyf-parser v-if="description.type == 0" :domain='domain' :html="description.content.replace(/<br\/>/ig, '')" ref="article" :tag-style="tagStyle"></jyf-parser>
					<view v-else class="product_content">
						<view v-if="description.content && description.content.title" class="title">{{description.content.title}}</view>
						<view v-if="description.content && description.content.image" class="pictures">
							<image v-for="(item,index) in description.content.image" :key="index" :src="item"></image>
						</view>
					</view>
				</view>
				<view style='height:120rpx;'></view>
			</scroll-view>
		</view>
		<!-- 组件 -->
		<productWindow :attr="attr" :isShow='1' :iSplus='1' @myevent="onMyEvent" @ChangeAttr="ChangeAttr" @ChangeCartNum="ChangeCartNum"
		 @attrVal="attrVal" @iptCartNum="iptCartNum" id='product-window'></productWindow>
		<guaranteeTemplate ref="guartemplate" :guarantee='guarantee' :shipping='shipping'></guaranteeTemplate>
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
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import { getProductDetail, getPreviewProDetail } from '@/api/store.js';
	import productWindow from '@/components/productWindow';
	import productConSwiper from '@/components/productConSwiper';
	import { mapGetters } from "vuex";
	import home from '@/components/home';
	import countDown from '@/components/countDown';
	import parser from "@/components/jyf-parser/jyf-parser";
	import { HTTP_REQUEST_URL } from '@/config/app';
	import guaranteeTemplate from '@/components/freightGuarantee';
	import { configMap } from "@/utils";
	let app = getApp();
	export default {
		components: {
			home,
			productWindow,
			productConSwiper,
			guaranteeTemplate,
			countDown,
			"jyf-parser": parser,
		},
		data() {
			let that = this;
			return {
				statusBarHeight: statusBarHeight, //系统导航条高度
				attrTxt: '请选择', //属性页面提示
				attrValue: '', //已选属性
				animated: false, //购物车动画
				product_id: 0, //商品id
				product_type: 0, //活动类型
				replyCount: 0, //总评论数量
				reply: [], //评论列表
				storeInfo: {
					merchant: {}
				}, //商品详情
				productValue: [], //系统属性
				cart_num: 1, //购买数量
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				isOpen: false, //是否打开属性组件
				actionSheetHidden: true,
				storeImage: '', //海报产品图
				canvasStatus: false, //海报绘图标签
				posterImage: '', //海报路径
				posterbackgd: '/static/images/posterbackgd.png',
				source: '',
				domain: HTTP_REQUEST_URL,
				sharePacket: {
					isState: true, //默认不显示
				}, //分销商详细
				// uid: 0, //用户uid
				circular: false,
				autoplay: false,
				interval: 3000,
				duration: 500,
				clientHeight: "",
				systemStore: {}, //门店信息
				replyChance: 0,
				CartCount: 0,
				isDown: true,
				attr: {
					cartAttr: false,
					productAttr: [],
					productSelect: {}
				},
				description: '',
				navActive: 0,
				activity: [],
				retunTop: true, //顶部返回
				navH: "",
				navList: [],
				opacity: 0,
				scrollY: 0,
				topArr: [],
				toView: '',
				height: 0,
				heightArr: [],
				lock: false,
				scrollTop: 0,
				tagStyle: {
					img: 'width:100%;display:block;'
				},
				// 动画状态
				showAnimate: true,
				codeImg: "",
				videoCoverImg: "",
				shipping: "",
				guarantee: [],
				guaranteeValue: "",
				shippingValue: "",
				uniqueValue: "",
				datatime: 0,
				pink_ok_sum: 0,
				pink: [],
				AllIndexDefault: 0,
				AllIndex: 2,
				maxAllIndex: 0,
				itemNew: [],
				indicatorDots: false,
				preview_key: '',
				comForm: '' // 页面打开的途径，admin代表时后台的预览
			};
		},
		computed: configMap(['hide_mer_status'],mapGetters(['isLogin', 'uid'])),
		onLoad(options) {
			let that = this
			var pages = getCurrentPages();
			let curPage = pages[pages.length - 1];
			if (pages.length <= 1) {
				that.retunTop = false
			}
			let curParam = curPage.options || curPage.$route.query;
			this.source = curParam.source;
			this.navH = 96;
			this.id = options.product_id;
			this.preview_key = options.preview_key;
			this.product_type = options.product_type;
			this.comForm = options.comForm

			uni.getSystemInfo({
				success: function(res) {
					that.height = res.windowHeight
					//res.windowHeight:获取整个窗口高度为px，*2为rpx；98为头部占据的高度；
				},
			});
			this.getPreviewDetails()
		},
		onReady() {},
		onShow() {
			this.getConfig()
		},
		methods: {
			boxStatus(data) {
				this.showAnimate = data
			},
			closeChange: function() {
				this.$set(this.sharePacket, 'isState', true);
			},
			/**查看运费说明*/
			showShip: function() {
				this.$refs.guartemplate.showShippingTel();
			},
			/**查看服务保障*/
			showGuaranee: function() {
				this.$refs.guartemplate.showGuaranteeTel();
			},
			goActivity: function(e) {
				console.log(e);
				let item = e;
				if (item.type === "1") {
					uni.navigateTo({
						url: `/pages/activity/goods_seckill_details/index?id=${item.id}&time=${item.time}&status=1`
					});
				} else if (item.type === "2") {
					uni.navigateTo({
						url: `/pages/activity/goods_bargain_details/index?id=${item.id}&bargain=${this.uid}`
					});
				} else {
					uni.navigateTo({
						url: `/pages/activity/goods_combination_details/index?id=${item.id}`
					});
				}
			},
			/**
			 * 购物车手动填写
			 *
			 */
			iptCartNum: function(e) {
				this.$set(this.attr.productSelect, 'cart_num', e);
			},
			tap: function(index) {
				var id = "past" + index;
				var index = index;
				var that = this;
				this.$set(this, 'toView', id);
				this.$set(this, 'navActive', index);
				this.$set(this, 'lock', true);
				this.$set(this, 'scrollTop', index > 0 ? that.topArr[index] - (app.globalData.navHeight / 2) : that.topArr[index]);
			},
			scroll: function(e) {
				var that = this,
					scrollY = e.detail.scrollTop;
				var opacity = scrollY / 200;
				opacity = opacity > 1 ? 1 : opacity;
				that.$set(that, 'showAnimate', false);
				that.$set(that, 'opacity', opacity);
				that.$set(that, 'scrollY', scrollY);
				if (that.lock) {
					that.$set(that, 'lock', false)
					return;
				}
				for (var i = 0; i < that.topArr.length; i++) {
					if (scrollY < that.topArr[i] - (app.globalData.navHeight / 2) + that.heightArr[i]) {
						that.$set(that, 'navActive', i)
						break
					}
				}
			},

			// 微信登录回调
			onLoadFun: function(e) {
			},
			/**
			 * 购物车数量加和数量减
			 *
			 */
			ChangeCartNum: function(changeValue) {

			},
			attrVal(val) {
				this.$set(this.attr.productAttr[val.indexw], 'index', this.attr.productAttr[val.indexw].attr_values[val.indexn]);
			},
			/**
			 * 属性变动赋值
			 *
			 */
			ChangeAttr: function(res) {
				let productSelect = this.productValue[res];
				if(productSelect)this.$set(this, "uniqueValue", productSelect.unique);
				if (productSelect && productSelect.stock > 0) {
					this.$set(this.attr.productSelect, "image", productSelect.image ? productSelect.image : this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", res);
					this.$set(this, "attrTxt", "已选择");
				}
				 else {
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", 0);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				}
			},
			setClientHeight: function() {
				let that = this;

				let view = uni.createSelectorQuery().in(this).select("#list0");
				view.fields({
					size: true,
				}, data => {
					that.$set(that, 'clientHeight', data.height + 20)
				}).exec();
			},
			/**
			 * 获取产品详情
			 *
			 */
			getGoodsDetails: function() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let that = this;
				getProductDetail({id: that.id, product_type: that.product_type}).then(res => {
					uni.hideLoading();
					let storeInfo = res.data;
					if (storeInfo.video_link && storeInfo.slider_image.length > 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
						storeInfo.slider_image.splice(0, 1)
					} else if (storeInfo.video_link && storeInfo.slider_image.length === 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
					}
					that.$set(that, 'storeInfo', storeInfo);
					that.$set(that, 'description', storeInfo.content);
					that.$set(that, 'reply', res.data.topReply ? [res.data.topReply] : []);
					// that.$set(that, 'replyCount', res.data.replayData.count);
					// that.$set(that, 'replyChance', res.data.replayData.rate);
					that.$set(that.attr, 'productAttr', res.data.attr);
					that.$set(that, 'productValue', res.data.sku);
					that.$set(that.sharePacket, 'priceName', res.data.priceName);
					that.$set(that.sharePacket, 'max', res.data.max_extension);
					that.$set(that.sharePacket, 'min', res.data.min_extension);
					that.$set(that, 'systemStore', res.data.system_store);
					that.$set(that, 'PromotionCode', storeInfo.code_base);
					that.$set(that, 'activity', res.data.activity ? res.data.activity : []);
					that.$set(that, 'shippingValue', res.data.temp ? res.data.temp.name : '');
					that.$set(that, 'guaranteeValue', res.data.guarantee ? res.data.guarantee.template_name : '');
					that.$set(that, 'guarantee', res.data.guaranteeTemplate ? res.data.guaranteeTemplate : []);
					that.$set(that, 'shipping', res.data.temp ? res.data.temp.info : '');
					uni.setNavigationBarTitle({
						title: storeInfo.store_name.substring(0, 7) + "..."
					})
					that.$set(that, 'storeImage', that.storeInfo.image);
					setTimeout(function() {
						that.infoScroll();
					}, 500);
					that.DefaultSelect();
				}).catch(err => {
					//状态异常返回上级页面
					return that.$util.Tips({
						title: err
					}, {
						tab: 3,
						url: 1
					});
				})
			},
			/*获取预览商品详情*/
			getPreviewDetails(){
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let that = this;
				let params = that.preview_key ? {key:that.preview_key} : {id: that.id, product_type: that.product_type}
				getPreviewProDetail(params).then(res => {
					uni.hideLoading();
					let storeInfo = res.data;
					if (storeInfo.video_link && storeInfo.slider_image.length > 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
						storeInfo.slider_image.splice(0, 1)
					} else if (storeInfo.video_link && storeInfo.slider_image.length === 1) {
						this.videoCoverImg = storeInfo.slider_image[0]
					}
					that.$set(that, 'storeInfo', storeInfo);
					that.$set(that, 'description', storeInfo.content);
					that.$set(that.description, 'type', storeInfo.content.type || 0 );
					that.$set(that, 'reply', res.data.topReply ? [res.data.topReply] : []);
					// that.$set(that, 'replyCount', res.data.replayData.count);
					// that.$set(that, 'replyChance', res.data.replayData.rate);
					that.$set(that.attr, 'productAttr', res.data.attr);
					that.$set(that, 'productValue', res.data.sku);
					that.$set(that.sharePacket, 'priceName', res.data.priceName);
					that.$set(that.sharePacket, 'max', res.data.max_extension);
					that.$set(that.sharePacket, 'min', res.data.min_extension);
					that.$set(that, 'systemStore', res.data.system_store);
					that.$set(that, 'PromotionCode', storeInfo.code_base);
					that.$set(that, 'activity', res.data.activity ? res.data.activity : []);
					that.$set(that, 'shippingValue', res.data.temp ? res.data.temp.name : '');
					that.$set(that, 'guaranteeValue', res.data.guarantee ? res.data.guarantee.template_name : '');
					that.$set(that, 'guarantee', res.data.guaranteeTemplate ? res.data.guaranteeTemplate : []);
					that.$set(that, 'shipping', res.data.temp ? res.data.temp.info : '');
					that.$set(that, 'datatime', storeInfo.stop ? Number(storeInfo.stop) : 0);
					uni.setNavigationBarTitle({
						title: storeInfo.store_name.substring(0, 7) + "..."
					})
					that.$set(that, 'storeImage', that.storeInfo.image);
					setTimeout(function() {
						that.infoScroll();
					}, 500);
					that.DefaultSelect();
				}).catch(err => {
					//状态异常返回上级页面
					return that.$util.Tips({
						title: err
					}, {
						tab: 3,
						url: 1
					});
				})
			},
			infoScroll: function() {
				var that = this,
					topArr = [],
					heightArr = [];
				for (var i = 0; i < that.navList.length; i++) { //productList
					//获取元素所在位置
					var query = uni.createSelectorQuery().in(this);
					var idView = "#past" + i;

					query.select(idView).boundingClientRect();
					query.exec(function(res) {
						var top = res[0].top;
						var height = res[0].height;
						topArr.push(top);
						heightArr.push(height);
						that.$set(that, 'topArr', topArr);
						that.$set(that, 'heightArr', heightArr);
					});
				};
			},
			/**
			 * 默认选中属性
			 *
			 */
			DefaultSelect: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				let arr = []
				let unSortArr = []
				console.log(arr, 'arr')
				for (var key in this.productValue) {
					if (this.productValue[key].stock > 0) {
						value = this.attr.productAttr.length ? key.split(",") : [];
						break;
					}
				}
				for (let i = 0; i < productAttr.length; i++) {
					this.$set(productAttr[i], "index", value[i]);
				}
				let productSelect = this.productValue[value.join(",")];
				if (productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", productSelect.image ? productSelect.image : this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "已选择");
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", 1);
					}
				} else if (!productSelect && productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", 0);
					this.$set(this.attr.productSelect, "unique", "");
					this.$set(this, "uniqueValue", "");
					this.$set(this.attr.productSelect, "cart_num", 0);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				} else if (!productSelect && !productAttr.length) {
					this.$set(
						this.attr.productSelect,
						"store_name",
						this.storeInfo.store_name
					);
					this.$set(this.attr.productSelect, "image", this.storeInfo.image);
					this.$set(this.attr.productSelect, "price", this.storeInfo.price);
					this.$set(this.attr.productSelect, "stock", this.storeInfo.stock);
					this.$set(this.attr.productSelect, "unique", this.storeInfo.unique || "");
					this.$set(this, "uniqueValue", this.storeInfo.unique || "");
					this.$set(this.attr.productSelect, "cart_num", 1);
					this.$set(this, "attrValue", "");
					this.$set(this, "attrTxt", "请选择");
				} else if (productSelect && !productAttr.length) {
					this.$set(this.attr.productSelect, "store_name", this.storeInfo.store_name);
					this.$set(this.attr.productSelect, "image", productSelect.image);
					this.$set(this.attr.productSelect, "price", productSelect.price);
					this.$set(this.attr.productSelect, "stock", productSelect.stock);
					this.$set(this.attr.productSelect, "unique", productSelect.unique);
					this.$set(this, "uniqueValue", productSelect.unique);
					this.$set(this, "attrValue", value.join(","));
					this.$set(this, "attrTxt", "已选择");
					if (productSelect.stock == 0) {
						this.$set(this.attr.productSelect, "cart_num", 0);
					} else {
						this.$set(this.attr.productSelect, "cart_num", 1);
					}
				}
			},
			onMyEvent: function() {
				this.$set(this.attr, 'cartAttr', false);
				this.$set(this, 'isOpen', false);
			},

			/**
			 * 打开属性插件
			 */
			selecAttr: function() {
				this.$set(this.attr, 'cartAttr', true);
				this.$set(this, 'isOpen', true);
			},

		},
	}
</script>
<style scoped lang="scss">
	.product-con .price_text {
		display: inline-block;
		width: 90rpx;
		height: 30rpx;
		background: url(~pages/activity/static/images/presell_text.png);
		background-size: 100%;
		color: #FD6523;
		font-size: 22rpx;
		line-height: 30rpx;
		text-align: center;
		margin-left: 27rpx;
		position: relative;
		top: -8rpx;
	}
	.product-con .presell_count {
		margin-top: 20rpx;
		font-size: 26rpx;
		color: #999999;
		.presell_time {
			margin: 8rpx 0 4rpx;
			.area_line {
				display: inline-block;
				margin: 0 6rpx;
			}
		}
		.icon-shijian1 {
			display: inline-block;
			margin-right: 4rpx;
		}
	}
	.product-con .presell_process {
		margin-top: 20rpx;
		height: 110rpx;
		padding: 4rpx 32rpx 32rpx;

		.process_count {
			display: inline-block;
			position: relative;
			top: 24rpx;
			left: 40rpx;
		}
		.process_line {
			width: 414rpx;
			height: 2rpx;
			background: #CCCCCC;
		}
		.text_line {
			display: inline-block;
			width: 25%;
			color: #CCCCCC;
			margin-top: 6rpx;
			position: relative;
			&::after {
				content: "";
				display: inline-block;
				width: 14rpx;
				height: 14rpx;
				background: #CCCCCC;
				border-radius: 100%;
				position: absolute;
				top: -14rpx;
			}
			&.text_line1 {
				text-align: left;
				color: #E93323;
				&::after {
					background: #E93323;
					left: 0;
				}
				text {
					margin-left: -20rpx
				}
			}
			&.text_line3 {
				text-align: right;
				&::after {
					right: 0;
				}
				text {
					margin-right: -20rpx
				}
			}
			&.text_line2 {
				width: 50%;
				text-align: center;
				&::after {
					left: 50%;
					margin-left: -4rpx;
				}
			}
		}
	}
	/*拼团*/
	.product-con .notice {
		width: 100%;
		height: 62rpx;
		background-color: #ffedeb;
		padding: 0 30rpx;
		box-sizing: border-box;
	}
	.product-con .notice .num {
		font-size: 24rpx;
	}
	.product-con .notice .num .iconfont {
		font-size: 30rpx;
		vertical-align: -3rpx;
		margin-right: 20rpx;
	}
	.product-con .notice .num .line {
		color: #282828;
		margin-left: 15rpx;
	}
	.product-con .notice .swiper {
		height: 100%;
		width: 360rpx;
		line-height: 62rpx;
		overflow: hidden;
		margin-left: 14rpx;
	}
	.product-con .notice .swiper swiper {
		height: 100%;
		width: 100%;
		overflow: hidden;
		font-size: 24rpx;
		color: #282828;
	}
	.product-con .playWay {
		background-color: #fff;
		padding: 0 30rpx;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #282828;
	}
	.product-con .playWay .title {
		height: 86rpx;
		border-bottom: 1rpx solid #eee;
	}
	.product-con .playWay .title .iconfont {
		margin-left: 13rpx;
		font-size: 28rpx;
		color: #717171;
	}
	.product-con .playWay .way {
		min-height: 110rpx;
		font-size: 26rpx;
		color: #282828;
	}
	.product-con .playWay .way .iconfont {
		color: #cdcdcd;
		font-size: 40rpx;
		margin: 0 35rpx;
	}
	.product-con .playWay .way .item .num {
		font-size: 34rpx;
		margin-right: 6rpx;
		width: 17px;
		height: 28px;
		display: inline-block;
		vertical-align: middle;
	}
	.product-con .playWay .way .item .tip {
		font-size: 22rpx;
		color: #a5a5a5;
		margin-top: -4rpx;
	}
	.product-con .playWay .way .way_text {
		position: relative;
		top: 4rpx;
	}
	.activity_pin {
		width: auto;
		height: 44rpx;
		line-height: 44rpx;
		background: linear-gradient(90deg, rgba(233, 51, 35, 1) 0%, rgba(250, 101, 20, 1) 100%);
		opacity: 1;
		border-radius: 22rpx;
		padding: 0 15rpx;
		margin-left: 19rpx;
	}
	.activity_miao {
		width: auto;
		height: 44rpx;
		line-height: 44rpx;
		padding: 0 15rpx;
		background: linear-gradient(90deg, rgba(250, 102, 24, 1) 0%, rgba(254, 161, 15, 1) 100%);
		opacity: 1;
		border-radius: 22rpx;
		margin-left: 19rpx;
	}
	.iconfonts {
		color: #fff !important;
		font-size: 28rpx;
	}
	.activity_title {
		font-size: 24rpx;
		color: #fff;
	}
	.activity_kan {
		width: auto;
		height: 44rpx;
		line-height: 44rpx;
		padding: 0 15rpx;
		background: linear-gradient(90deg, rgba(254, 159, 15, 1) 0%, rgba(254, 178, 15, 1) 100%);
		opacity: 1;
		border-radius: 22rpx;
		margin-left: 19rpx;
	}
	.mask {
		z-index: 300 !important;
	}
	.head-bar {
		background: #fff;
	}
	.generate-posters {
		width: 100%;
		height: 170rpx;
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 388;
		transform: translate3d(0, 100%, 0);
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		border-top: 1rpx solid #eee;
	}
	.generate-posters.on {
		transform: translate3d(0, 0, 0);
	}
	.generate-posters .item {
		flex: 50%;
		text-align: center;
		font-size: 30rpx;
	}
	.generate-posters .item .iconfont {
		font-size: 80rpx;
		color: #5eae72;
	}
	.generate-posters .item .iconfont.icon-haibao {
		color: #5391f1;
	}
	.product-con .mask {
		z-index: 88;
	}
	.product-con .footer {
		padding: 0 20rpx 0 30rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
		height: 100rpx;
		background-color: #fff;
		z-index: 277;
		border-top: 1rpx solid #f0f0f0;
	}
	.product-con .footer .item {
		font-size: 18rpx;
		color: #666;
	}
	.product-con .attribute .atterTxt {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		display: inline-block;
		width: 400rpx;
	}
	.product-con .attribute .atterTxt1{
		color: #282828;
		&.hasAttr{
			&:after{
				content: "";
				display: inline-block;
				position: relative;
				top: -6rpx;
				margin: 0 6rpx;
				width: 5rpx;
				height: 5rpx;
				background-color: #282828;
				border-radius: 100%;
			}
			&:last-child{
				&:after{
					display: none;
				}
			}
		}
	}
	.product-intro .title {
		font-size: 30rpx;
		color: #282828;
		text-align: center;
	}
	.product-intro .pictures,.product-intro .pictures uni-image,
	.product-intro .pictures image{
		width: 100%;
	}
	.product-con .guaranteeAttr{
		display: inline-block;
		width: 560rpx;
		overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
	}
	.product-con .superior {
		background-color: #fff;
		margin-top: 20rpx;
		padding-bottom: 10rpx;
	}
	.product-con .superior .title {
		height: 98rpx;
	}
	.product-con .superior .title image {
		width: 30rpx;
		height: 30rpx;
	}
	.product-con .superior .title .titleTxt {
		margin: 0 20rpx;
		font-size: 30rpx;
		background-image: linear-gradient(to right, #f57a37 0%, #f21b07 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.product-con .superior .slider-banner {
		width: 690rpx;
		margin: 0 auto;
		position: relative;
	}
	.product-con .superior .slider-banner swiper {
		height: 100%;
		width: 100%;
	}
	.product-con .superior .slider-banner swiper-item {
		height: 100%;
	}
	.product-con .superior .slider-banner .list {
		width: 100%;
	}
	.product-con .superior .slider-banner .list .item {
		width: 215rpx;
		margin: 0 22rpx 30rpx 0;
		font-size: 26rpx;
	}
	.product-con .superior .slider-banner .list .item:nth-of-type(3n) {
		margin-right: 0;
	}
	.product-con .superior .slider-banner .list .item .pictrue {
		position: relative;
		width: 100%;
		height: 215rpx;
	}
	.product-con .superior .slider-banner .list .item .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6rpx;
	}
	.product-con .superior .slider-banner .list .item .name {
		color: #282828;
		margin-top: 12rpx;
	}
	.product-con .superior .slider-banner .swiper-pagination-bullet {
		background-color: #999;
	}
	.product-con .superior .slider-banner .swiper-pagination-bullet-active {
		background-color: #e93323;
	}
	button {
		padding: 0;
		margin: 0;
		line-height: normal;
		background-color: #fff;
	}
	button::after {
		border: 0;
	}
	action-sheet-item {
		padding: 0;
		height: 240rpx;
		align-items: center;
		display: flex;
	}
	.contact {
		font-size: 16px;
		width: 50%;
		background-color: #fff;
		padding: 8rpx 0;
		border-radius: 0;
		margin: 0;
		line-height: 2;
	}
	.contact::after {
		border: none;
	}
	.action-sheet {
		font-size: 17px;
		line-height: 1.8;
		width: 50%;
		position: absolute;
		top: 0;
		right: 0;
		padding: 25rpx 0;
	}
	.canvas {
		z-index: 300;
		width: 750px;
		height: 1190px;
	}
	.poster-pop {
		width: 450rpx;
		height: 714rpx;
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		z-index: 399;
		top: 50%;
		margin-top: -357rpx;
	}
	.poster-pop image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.poster-pop .close {
		width: 46rpx;
		height: 75rpx;
		position: fixed;
		right: 0;
		top: -73rpx;
		display: block;
	}
	.poster-pop .save-poster {
		background-color: #df2d0a;
		font-size: ：22rpx;
		color: #fff;
		text-align: center;
		height: 76rpx;
		line-height: 76rpx;
		width: 100%;
	}
	.poster-pop .keep {
		color: #fff;
		text-align: center;
		font-size: 25rpx;
		margin-top: 10rpx;
	}
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9;
	}
	.product-con .wrapper {
		padding: 32rpx;
		width: 100%;
		box-sizing: border-box;
	}
	.product-con .nav {
		background-image: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QN/aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDNlZTU0ZDMtNjEwZS03ZjQ4LWEwODgtNTZlMTZiNzI3NTQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI1NEI2MDUyM0ZDMjExRTk5OTg1REI1OUM1NjNEMUZCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI1NEI2MDUxM0ZDMjExRTk5OTg1REI1OUM1NjNEMUZCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUyMDIzNWNmLTIwNGYtOTQ0My05YTBiLWNmMmZlMTJmMDk3NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0M2VlNTRkMy02MTBlLTdmNDgtYTA4OC01NmUxNmI3Mjc1NDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+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');
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.product-con .nav .money {
		font-size: 28rpx;
		color: #fff;
	}

	.product-con .nav .money .num {
		font-size: 48rpx;
	}

	.product-con .nav .money .y-money {
		font-size: 26rpx;
		margin-left: 10rpx;
		text-decoration: line-through;
	}

	.product-con .nav .time {
		font-size: 20rpx;
		color: #fff;
		text-align: center;
	}

	.product-con .nav .time .timeCon {
		margin-top: 10rpx;
	}

	.product-con .nav .time .timeCon .num {
		padding: 0 7rpx;
		font-size: 22rpx;
		color: #ff3d3d;
		background-color: #fff;
		border-radius: 2rpx;
	}

	.product-con .nav .timeState {
		font-size: 28RPX;
		color: #FFF;
	}

	.product-con .nav .iconfont {
		color: #fff;
		font-size: 30rpx;
		margin-left: 20rpx;
	}

	.pro-wrapper .iconn {
		background-image: url('data:image/png;base64,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');
		width: 100rpx;
		height: 100rpx;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		margin: 0 auto;
	}

	.pro-wrapper .iconn.iconn1 {
		background-image: url('data:image/png;base64,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');
	}

	.pictrue_log {
		width: 80upx;
		height: 40upx;
		border-radius: 6upx 0 12upx 0;
		line-height: 40upx;
		font-size: 24upx;
	}

	.pictrue_log_class {
		z-index: 3;
		background: -webkit-gradient(linear, left top, right top, from(rgba(246, 122, 56, 1)), to(rgba(241, 27, 9, 1)));
		background: linear-gradient(90deg, rgba(246, 122, 56, 1) 0%, rgba(241, 27, 9, 1) 100%);
		opacity: 1;
		position: absolute;
		top: 0;
		left: 0;
		color: #fff;
		text-align: center;

	}

	.navbar .header {
		height: 96rpx;
		font-size: 30rpx;
		color: #050505;
		background-color: #fff;
		/* #ifdef MP */
		padding-right: 95rpx;
		/* #endif */
	}

	.navbar .header .item {
		position: relative;
		margin: 0 25rpx;
	}

	.navbar .header .item.on:before {
		position: absolute;
		width: 60rpx;
		height: 5rpx;
		background-repeat: no-repeat;
		content: "";
		background-image: linear-gradient(to right, #ff3366 0%, #ff6533 100%);
		bottom: -10rpx;
		left: 50%;
		margin-left: -28rpx;
	}

	.navbar {
		position: fixed;
		background-color: #fff;
		top: 0;
		left: 0;
		z-index: 99;
		width: 100%;
	}

	.navbar .navbarH {
		position: relative;
	}

	.navbar .navbarH .navbarCon {
		position: absolute;
		bottom: 0;
		height: 100rpx;
		width: 100%;
	}

	.share-box {
		z-index: 1000;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.store-wrapper {
		margin-top: 20rpx;
		background-color: #fff;

		.store-hd {
			padding: 30rpx;
			border-bottom: 1px solid #F5F5F5;

			.store-info {
				position: relative;
				display: flex;

				.logo {
					width: 86rpx;
					height: 86rpx;

					image {
						width: 86rpx;
						height: 86rpx;
						border-radius: 6rpx;
					}
				}

				.info {
					display: flex;
					flex-direction: column;
					justify-content: center;
					margin-left: 20rpx;

					.name {
						font-size: 28rpx;
						color: #282828;
						font-weight: bold;
					}

					.txt {
						margin-top: 8rpx;
						color: #666666;
						font-size: 22rpx;
					}
				}

				.link {
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					display: flex;
					align-items: center;
					justify-content: center;
					width: 114rpx;
					height: 50rpx;
					background: linear-gradient(-90deg, $bg-end 0%, $bg-star 100%);
					border-radius: 25rpx;
					color: #fff;
				}
			}

			.score-wrapper {
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;

				.item {
					color: #948D8C;
					font-size: 26rpx;

					text {
						margin-left: 10rpx;
						color: $theme-color;
					}
				}
			}
		}

		.con-box {
			padding: 20rpx 0 20rpx 30rpx;

			.title {
				font-size: 28rpx;
				color: #282828;
				margin-bottom: 20rpx;
			}

			.img-box {
				display: flex;
				.img-item {
					width: 206rpx;
					margin-right: 20rpx;

					image {
						width: 206rpx;
						height: 206rpx;
						border-radius: 16rpx;
					}

					.txt {
						.title {
							font-size: 28rpx;
							color: #282828;
						}

						.price {
							color: $theme-color;
							font-size: 28rpx;

							text {
								font-size: 20rpx;
							}
						}
					}

				}
			}
		}
	}

	.sys-head {
		background: transparent;
	}

	.head-wrapper {
		z-index: 999;
		display: flex;
		align-items: center;
		position: fixed;
		left: 30rpx;
		top: 0;
		/* #ifdef MP */
		height: 43px;
		/* #endif */
		/* #ifdef H5 */
		height: 114rpx;
		/* #endif */
	}

	.head-menu {
		display: flex;
		align-items: center;
		height: 54rpx;
		width: 140rpx;
		background: rgba(0, 0, 0, .25);
		border-radius: 27rpx;

		.iconfont {
			flex: 1;
			text-align: center;
			color: #fff;
			box-sizing: border-box;

			&.icon-xiangzuo {
				border-right: 1px solid #fff;
			}
		}
	}
</style>
