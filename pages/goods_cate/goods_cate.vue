<template>
	<view>
		<skeleton :show="showSkeleton" :isNodes="isNodes" ref="skeleton" loading="chiaroscuro" selector="skeleton"
			bgcolor="#FFF"></skeleton>
		<view class='productSort' :style="{visibility: showSkeleton ? 'hidden' : 'visible', height: winHeight+ 'px' }">
			<view class='header acea-row row-center-wrapper'>
				<navigator url="/pages/columnGoods/goods_search/index" class='acea-row row-between-wrapper input skeleton-rect' hover-class="none">
					<text class='iconfont icon-sousuo'></text>
					<view class="input-box">点击搜索商品信息</view>
				</navigator>
			</view>
			<view class="con-box" :style="viewColor">
				<view class='aside'>
					<scroll-view scroll-y="true" style="height: 100%; overflow: hidden;" scroll-with-animation='true' :scroll-into-view="intoindex">
						<view v-for="(item,index) in productList">
							<view class='item acea-row row-center-wrapper' :class='index==navActive?"on":""' v-if='item.children && item.children.length > 0'
							 :key="item.store_category_id" @click='tap(index,"b"+index)' :id='"sort"+index'><text class="item_text skeleton-rect">{{item.cate_name}}</text>
							 </view>
						</view>
					</scroll-view>
				</view>
				<view class='conter'>
					<scroll-view scroll-y="true" :scroll-into-view="toView" style="height: 100%; overflow: hidden;" @scroll="scroll" scroll-with-animation='true'>
						<view v-for="(p,i) in productList">
							<view class='listw' :id="'b'+i+index" v-for="(item,index) in p.children" :key="item.store_category_id">
								<view class='title acea-row'>
									<view v-if="hotList.length > 0 && i === 0" class='name skeleton-rect'>
										<image class="list_title" :src="domain+'/static/diy/recommend_cate'+keyColor+'.png'"></image>
									</view>
									<view v-else class='name skeleton-rect'>{{item.cate_name}}</view>					
								</view>
								<view class='list acea-row'>
									<block v-for="(itemn,indexn) in item.children" :key="itemn.store_category_id">				
										<navigator hover-class='none' :url="'/pages/columnGoods/goods_list/index?id='+itemn.store_category_id+'&title='+itemn.cate_name"
										 class='item acea-row row-column row-middle'>
											<view class='picture skeleton-rect'>
												<easy-loadimage mode="widthFix" :image-src="itemn.pic"></easy-loadimage>
											</view>
											<view class='name line1'>{{itemn.cate_name}}</view>
										</navigator>
									</block>
								</view>
							</view>
						</view>
						<view :style='"height:"+(height-300)+"rpx;"'></view>
					</scroll-view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<passwordPopup></passwordPopup>
			<!-- #endif -->
		</view>
	</view>
	
</template>

<script>
	let app = getApp();
	import { getCategoryList } from '@/api/store.js';
	// #ifndef H5
	import passwordPopup from '@/components/passwordPopup';
	// #endif
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	import { mapGetters } from "vuex";
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {
			easyLoadimage,
			// #ifndef H5
			passwordPopup,
			// #endif
		},
		computed: mapGetters(['viewColor','keyColor']),
		data() {
			let active = 0;
			// #ifdef H5
			active = location.hash.substr(1);
			// #endif
			return {
				domain: HTTP_REQUEST_URL,
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				navlist: [],
				hotList: [], //推荐分类
				productList: [
					{cate_name: 'skeleton',store_category_id: 0,
					children:[
						{cate_name: 'skeleton',store_category_id: 10,children:[
							{cate_name: '',store_category_id: 101,},
							{cate_name: '',store_category_id: 102,},
							{cate_name: '',store_category_id: 103,},
							{cate_name: '',store_category_id: 104,},
							{cate_name: '',store_category_id: 105,},
							{cate_name: '',store_category_id: 106,}
						]},	
						{cate_name: 'skeleton',store_category_id: 1,
						children:[
						{cate_name: '',store_category_id: 101,},
						{cate_name: '',store_category_id: 102,},
						{cate_name: '',store_category_id: 103,},
						{cate_name: '',store_category_id: 104,},
						{cate_name: '',store_category_id: 105,},
						{cate_name: '',store_category_id: 106,}	
						]},
						{cate_name: '',store_category_id: 20}
						]
					},
					{cate_name: 'skeleton',store_category_id: 2,
					children:[{cate_name:'skeleton',store_category_id: 30}]},
					{cate_name: 'skeleton',store_category_id: 3,
					children:[{cate_name:'skeleton',store_category_id: 31}]},
					{cate_name: 'skeleton',store_category_id: 4,
					children:[{cate_name:'skeleton',store_category_id: 32}]},
					{cate_name: 'skeleton',store_category_id: 5,
					children:[{cate_name:'skeleton',store_category_id: 33}]},
					{cate_name: 'skeleton',store_category_id: 6,
					children:[{cate_name:'skeleton',store_category_id: 34}]},
					{cate_name: 'skeleton',store_category_id: 7,
					children:[{cate_name:'skeleton',store_category_id: 35}]},
					{cate_name: 'skeleton',store_category_id: 8,
					children:[{cate_name:'skeleton',store_category_id: 36}]},
					{cate_name: 'skeleton',store_category_id: 9,
					children:[{cate_name:'skeleton',store_category_id: 37}]},
					{cate_name: 'skeleton',store_category_id: 10,
					children:[{cate_name:'skeleton',store_category_id: 38}]},
					{cate_name: 'skeleton',store_category_id: 11,
					children:[{cate_name:'skeleton',store_category_id: 39}]},
				],
				navActive: 0,
				activceCate: active,
				number: "",
				height: 0,
				hightArr: [],
				toView: "",
				winHeight: 0,
				pidIndex: 0,
				intoindex: ""
			}
		},
		watch:{
			navActive(n){
			// #ifdef H5
			history.replaceState(null, null, "#" + this.productList[n].store_category_id);
			// #endif
			}
		},
		onLoad(options) {
			console.log(this.viewColor)
			let that = this			
			if(options.activceCate){
				this.activceCate = options.activceCate;
			}
			uni.getSystemInfo({
				success: function(res) {
					console.log(res,'res')
					that.winHeight = res.windowHeight
				},
			});
			// #ifdef H5
			document.body.addEventListener('touchmove', function(event) {
				if (that.$route.path == '/pages/goods_cate/goods_cate') {
					event.preventDefault();
				}
			}, {
				passive: false
			});
			// #endif
			this.getAllCategory();
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
			return {
				path: '/pages/goods_cate/goods_cate?activceCate=' + this.productList[this.navActive] ? this.productList[this.navActive].store_category_id : 0
			}
		},
		// #endif
		onShareTimeline: function() {
			return {
				query: {
					activceCate: this.productList[this.navActive] ? this.productList[this.navActive].store_category_id : 0,
				}
			}
		},
		//点击底部tabbar调用
		onTabItemTap() {
			this.getAllCategory();
		},
		onReady() {
			this.isNodes++;
		},
		methods: {
			infoScroll: function() {
				let that = this;
				//this.number = that.productList[len - 1].children.length;
				//设置商品列表高度
				uni.getSystemInfo({
					success: function(res) {
						that.height = (res.windowHeight) * (750 / res.windowWidth) - 98;
					},
				});
				let hightArr = [];
				for (let i = 0; i < that.productList.length; i++) {
					if(!that.productList[i].children){
						continue;
					}
					for (let j = 0; j < that.productList[i].children.length; j++) {
						//获取元素所在位置
						let query = uni.createSelectorQuery().in(this);
						let idView = "#b" + i + j;
						query.select(idView).boundingClientRect();
						query.exec(function(res) {
							if(res[0]){
								let top = res[0].top;
								hightArr.push({top,i});
							}
						});
					};
				};
				that.hightArr = hightArr;
			},
			tap: function(index, id) {
				this.toView = ''+id+0;
				this.navActive = index;
				setTimeout(()=>{
					uni.$emit('scroll');
				}, 300);
			},
			getAllCategory: function() {
				let that = this;
				let value = ""
				that.pidIndex = 0;
				getCategoryList().then(res => {
					that.productList = res.data.list;
					that.hotList = res.data.hot;
					if(that.hotList.length>0){
						let hot = {
							cate_name: '推荐分类',store_category_id: 0,
							children: [
								{
									cate_name:'推荐分类',
									store_category_id: 1,
									children:that.hotList
								}
							]
						}
						that.productList.unshift(hot)
					}
					console.log(that.productList)
					that.getCateFrom(that.productList)
					that.$nextTick(function(){
						that.infoScroll();
						setTimeout(()=>that.tap(that.pidIndex, 'b' + that.pidIndex),200);
					})
					that.activceCate = 0;
					that.intoindex = ""
					uni.removeStorageSync('storeIndex')
					setTimeout(() => {
						that.showSkeleton = false
					}, 500)
				})
			},
			//获取首页分类来源
			getCateFrom: function(arr) {
				let pid = uni.getStorageSync('storeIndex')
				let i = ""
				arr.map((item, index) => {
					if ((this.activceCate && item.store_category_id == this.activceCate) || item.store_category_id == pid) {
						this.pidIndex = index
						i = 'sort' + index
						// this.intoindex = 'sort'+index
						return;
					}
				})
				this.$nextTick(() => {
					this.intoindex = i
				})

			},
			scroll: function(e) {
				uni.$emit('scroll');
				let scrollTop = e.detail.scrollTop + 10;
				let scrollArr = this.hightArr;
				for (let i = 0; i < scrollArr.length; i++) {
					if (scrollTop >= 0 && scrollTop < scrollArr[1].top - scrollArr[0].top) {
						this.navActive = 0
					} else if (scrollTop >= scrollArr[i].top - scrollArr[0].top && scrollTop < (scrollArr[i + 1] ? scrollArr[i + 1].top : 0) - scrollArr[0].top) {
						this.navActive = scrollArr[i].i
					} else if (scrollTop >= scrollArr[scrollArr.length - 1].top - scrollArr[0].top) {
						this.navActive = scrollArr[scrollArr.length - 1].i
					}
				}
			},
			searchSubmitValue: function(e) {
				if (this.$util.trim(e.detail.value).length > 0)
					uni.navigateTo({
						url: '/pages/columnGoods/goods_list/index?searchValue=' + e.detail.value
					})
				else
					return this.$util.Tips({
						title: '请填写要搜索的产品信息'
					});
			},
		}
	}
</script>


<style scoped lang="scss">
	.productSort {
		display: flex;
		flex-direction: column;
		width: 100%;

		.con-box {
			flex: 1;
			display: flex;
			overflow: hidden;
		}
	}

	.productSort .header {
		width: 100%;
		height: 96rpx;
		background-color: #fff;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.productSort .header .input {
		width: 700rpx;
		height: 60rpx;
		background-color: #f5f5f5;
		border-radius: 50rpx;
		box-sizing: border-box;
		padding: 0 25rpx;
	}

	.productSort .header .input .iconfont {
		font-size: 35rpx;
		color: #555;
	}

	.productSort .header .input .placeholder {
		color: #999;
	}

	.productSort .header .input .input-box {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		height: 100%;
		width: 597rpx;
		color: #999999;
	}

	.productSort .aside {
		background-color: #fff;
		overflow-y: auto;
		overflow-x: hidden;
		width: 200rpx;
		height: 100%;
		overflow: hidden;
	}

	.productSort .aside .item {
		height: 100rpx;
		width: 100%;
		font-size: 26rpx;
		color: #424242;
	}

	.productSort .aside .item_text {
		padding-left: 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.productSort .aside .item.on {
		background-color: #f7f7f7;
		border-left: 4rpx solid var(--view-theme);
		width: 100%;
		text-align: center;
		color: var(--view-theme);
		font-weight: bold;
	}

	.productSort .conter {
		flex: 1;
		height: 100%;
		padding: 0 14rpx;
		background-color: #f7f7f7;
	}

	.productSort .conter .listw {
		// padding-top: 20rpx;
	}

	.productSort .conter .listw .title {
		height: 100rpx;
		align-items: center;
	}

	.productSort .conter .listw .title .line {
		width: 100rpx;
		height: 2rpx;
		background-color: #f0f0f0;
	}

	.productSort .conter .listw .title .name {
		font-size: 28rpx;
		color: #333;
		margin: 0 30rpx;
		font-weight: bold;
	}
    .productSort .conter .listw .title .list_title,
	.productSort .conter .listw .title uni-image,
	.productSort .conter .listw .title image{
		width: 110rpx;
		height: 26rpx;
		border-radius: 0;
	}
	.productSort .conter .list {
		flex-wrap: wrap;
		background: #fff;
		border-radius: 16rpx;
		padding-bottom: 26rpx;
	}

	.productSort .conter .list .item {
		width: 174rpx;
		margin-top: 26rpx;
	}

	.productSort .conter .list .item .picture,
	.productSort .conter uni-image,
	.productSort .conter .list .item image,
	/deep/.easy-loadimage{
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
	}
	

	.productSort .conter .list .item .name {
		font-size: 24rpx;
		color: #333;
		height: 56rpx;
		line-height: 56rpx;
		width: 120rpx;
		text-align: center;
	}
</style>