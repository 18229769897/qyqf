<template>
	<view class='nav acea-row acea-row' :style="'background:'+bgColor[0].item+';margin:' +mbConfig+'rpx '+prConfig+'rpx 0;border-radius:'+bgStyle+'rpx;'" v-if="menus.length">
		<block v-if="rowStyle == 0">
			<scroll-view scroll-x="true" style="white-space: nowrap; display: flex" show-scrollbar="false">
				<view v-for="(item,index) in menus" :key="index" class='item' :style="'color:'+titleColor" @click="menusTap(item.info[1].value)">
					<view class='pictrue skeleton-rect'>
						<image :src='item.img' :style="'border-radius:'+menuStyle"></image>
					</view>
					<view class="menu-txt" :style="'color:'+titleColor">{{item.info[0].value}}</view>
				</view>
			</scroll-view>
		</block>		
		<block v-else v-for="(item,index) in menus" :key="index">
			<view class='item' :style="'color:'+titleColor+';width:'+number" @click="menusTap(item.info[1].value)">
				<view class='pictrue skeleton-rect'>
					<image :src='item.img' :style="'border-radius:'+menuStyle"></image>
				</view>
				<view class="menu-txt" :style="'color:'+titleColor">{{item.info[0].value}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	import {merPath} from "@/utils/index"
	
	export default {
		name: 'menus',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			merId:{}
		},
		data() {
			return {
				menus: this.dataConfig.menuConfig.list,
				bgColor: this.dataConfig.bgColor.color,
				menuStyle: this.dataConfig.menuStyle.type ? '50%' : 0,
				rowStyle: this.dataConfig.tabConfig.tabVal,  //0单行1多行
				bgStyle: this.dataConfig.bgStyle.type ? '16' : '0',
				titleColor: this.dataConfig.titleColor.color[0].item,
				mbConfig: this.dataConfig.mbConfig.val*2,
				prConfig: this.dataConfig.prConfig.val*2,
				rowNum: this.dataConfig.rowsNum.type,//0两行，1三行，2四行
				number: this.dataConfig.number.type == 0 ? '33.33%' : this.dataConfig.number.type == 1 ? '25%' : '20%',  //三个四个五个 
			};
		},
		created() {},
		mounted() {},
		methods: {
			menusTap(url) {		
				let data = this.$util.stringIntercept(url, 1, '\?');
				data = this.$util.stringIntercept(data, 1, '\=');
				uni.setStorageSync('storeIndex', data);
				url = merPath(url, this.merId)
				
				if(url.indexOf("http") != -1){
					// #ifdef H5
					location.href = url
					// #endif
				}else{
					if(['/pages/goods_cate/goods_cate','/pages/order_addcart/order_addcart','/pages/user/index'].indexOf(url) == -1){
						uni.navigateTo({
							url:url
						})
					}else{
						uni.switchTab({
							url:url
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.nav {
		padding-bottom: 30rpx;
		.item {
			margin-top: 30rpx;
			width: 20%;
			text-align: center;
			font-size: 24rpx;
			display: inline-block;
			.pictrue {
				width: 82rpx;
				height: 82rpx;
				margin: 0 auto;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.menu-txt {
				font-size: 24rpx;
				color: #454545;
				margin-top: 15rpx;
			}
			&.four {
				width: 25%;
				.pictrue {
					width: 90rpx;
					height: 90rpx;
				}
			}
		}
	}
</style>
