<template>
	<view class="user_store_attention" :style="viewColor">
		<view class="item" v-for="(item,index) in storeList" :key="index" :style="{ 'background-image': `url(${domain}/static/diy/store_bg${keyColor}.png)`}">
			<view class="store_header" @click="goStore(item)">
				<image :src="item.merchant.mer_avatar" mode=""></image>
				<view class="info">
					<view class="line1">
						<text class="name line1">{{item.merchant.mer_name}}</text>
						<text v-if="item.merchant.type_name" class="font-bg-red ml8">{{item.merchant.type_name}}</text>
						<text v-else-if="item.merchant.is_trader" class="font-bg-red ml8">自营</text>
					</view>
					<view class="btn" @click.stop="bindDetele(item,index)">取消关注</view>
				</view>
			</view>
			<view class="store_recommend" v-if="item.merchant && item.merchant.showProduct.length>0">
				<block v-for="(itemn,indexn) in item.merchant.showProduct" :key="indexn" v-if="indexn < 3">
					<navigator :url="'/pages/goods_details/index?id='+itemn.product_id"
				 hover-class="none" class="list">
						<view class="picture">
							<easy-loadimage mode="widthFix" :image-src="itemn.image"></easy-loadimage>
						</view>
						<view class="price line1">¥ {{itemn.price}}</view>
					</navigator>
					
				</block>
			</view>
		</view>
		<view class="empty-txt" v-if="storeList.length == 0">暂无数据</view>
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
	let app = getApp();
	import { getMerchantLst,collectDel } from '@/api/store.js'
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
	import {mapGetters} from "vuex";
	import { configMap } from '@/utils';
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default{
		components: { easyLoadimage },
		computed: configMap(['hide_mer_status'], mapGetters(['viewColor', 'keyColor'])),
		data(){
			return {
				domain: HTTP_REQUEST_URL,
				storeList:[],
				isScroll:true,
				page:1,
				limit:20
			}
		},
		onLoad() {
			this.getList()
		},
		onReady(){
		},
		mounted: function() {
		},
		methods:{
			goStore(item){
				if(this.hide_mer_status != 1){
					uni.navigateTo({
						url:`/pages/store/index?id=${item.merchant.mer_id}`
					})
				}				
			},
			getList(){
				if(!this.isScroll) return
				getMerchantLst({
					page:this.page,
					limit:this.limit
				}).then(res=>{
					this.isScroll = res.data.list.length>=this.limit
					this.storeList = this.storeList.concat(res.data.list)
					this.page+=1
				})
			},
			// 删除收藏
			bindDetele(item,index){
				collectDel({
					type:10,
					type_id:item.type_id
				}).then(res=>{
					uni.showToast({
						title:'已取消',
						icon:'none'
					})
					this.storeList.splice(index,1)
				})
			}
		},
		onReachBottom() {
			this.getList()
		},
		// 滚动监听
		onPageScroll(e) {
			// 传入scrollTop值并触发所有easy-loadimage组件下的滚动监听事件
			uni.$emit('scroll');
		}
	}
</script>

<style lang="scss">
.user_store_attention{
	padding: 20rpx;
	.item{
		background-color: #ffffff;
		background-size: 100%;
		background-repeat: no-repeat;
		border-radius: 16rpx;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		background-image: url('../static/images/attention_bg.png');
		&.item_purple{
			background-image: url('../static/images/attention_bg_purple.png');
		}
	}
	.store_header{
		position: relative;
		display: flex;
		padding: 30rpx 10rpx;		
		align-items: center;	
		image{
			width: 88rpx;
			height: 88rpx;
			border-radius: 50%;
		}
		.info{
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			position: relative;
			.name{
				width: 410rpx;
				font-weight: bold;
			}
			.des{
				color: #666666;
				font-size: 22rpx;
			}
			.btn{
				display: flex;
				align-items: center;
				justify-content: center;
				position: absolute;
				right: 0;
				top: 50%;
				width:150rpx;
				height:50rpx;
				transform: translateY(-50%);
				border:1px solid #BBBBBB;
				border-radius:25rpx;
				font-size: 26rpx;
			}
		}
	}
	.store_recommend{
		display: flex;
		padding-bottom: 30rpx;
		.list{
			width: 210rpx;
			.picture,/deep/image,/deep/.easy-loadimage,uni-image{
				width: 210rpx;
				height: 210rpx;
				border-radius: 10rpx;
			}
			margin-right: 20rpx;
			&:last-child{
				margin-right: 0;
			}
			.price{
				text-align: center;
				color: var(--view-priceColor);
				font-size: 24rpx;
				margin-top: 10rpx;
				font-weight: bold;
			}
		}
	}
}

</style>
