<template>
	<view v-if="presellList.length > 0" class="presell-wrapper" :style="'margin-top:'+mbConfig+'rpx;'">
		<view class="presell-count" :class="'wrapper-count'+styleType" :style="'border-radius:'+bgStyle+'rpx'">
			<view class="spike-bd title-bd" :style="'border-radius:'+bgStyle+'rpx '+bgStyle+' 0 0'">
				<view class="title line1"><image class="title-img" src="/static/images/presell_title.png"></image></view>
				<navigator v-if="!merId" url="/pages/activity/presell/index" class="more-btn" hover-class="none">
					进去逛逛
					<text class="iconfont icon-jiantou" hover-class="none"></text>
				</navigator>
			</view>
			<view class="wapper_count">
				<view class="spike-wrapper" :class="'wrapper'+styleType">
					<scroll-view v-if="styleType != 2" :class="'colum'+styleType" :scroll-x="styleType == 0 ? true : false" show-scrollbar="false">
						<navigator
							class="spike-item presell-item"
							v-for="(item, index) in presellList"
							:key="index"
							:url="'/pages/activity/presell_details/index?id=' + item.product_presell_id"
							hover-class="none"
						>
							<view class="img-box presell_imgBox" :class="'img-box'+conStyle">
								<easy-loadimage mode="widthFix" :image-src="item.product.image"></easy-loadimage>
								<view v-if="presellShow" class="box_bg">火热预定中</view>
							</view>
							<view v-if="priceShow || titleShow" class="info">
								<view class="price-box presell-price">
									<text :style="'color:'+themeColor" v-if="priceShow" class="price">
										<text>预售价:￥</text>
										{{ item.price }}
									</text>
									<view v-if="titleShow" class="name line1">{{ item.store_name }}</view>
								</view>
							</view>
						</navigator>
					</scroll-view>
					<block v-else class="acea-row row-between-wrapper combination">
						<navigator 
							class="combination-item" 
							v-for="(item, index) in presellList" 
							:key="index"
							:url="'/pages/activity/presell_details/index?id=' + item.product_presell_id"
							hover-class="none" :style="'border-radius:'+conStyle">
							<view class="info">
								<view class="price-box combination-price">
									<view v-if="titleShow" class="name line1">{{ item.product.store_name }}</view>
									<text :style="'color:'+themeColor" v-if="priceShow" class="price">
										<text>￥</text>
										{{ item.price }}
									</text>
									<text v-if="presellShow" class="gocom_btn">
										去预定
										<text class="iconfont icon-jiantou"></text>
									</text>
								</view>
							</view>
							<view class="img-box">
								<easy-loadimage mode="widthFix" :image-src="item.product.image"></easy-loadimage>
							</view>
						</navigator>
						<navigator v-if="presellList.length == 1" 
							class="combination-item"
							hover-class="none" 
							:url="'/pages/activity/presell_details/index?id=' + presellList[0].product_presell_id"
							:style="'border-radius:'+conStyle">
							<view class="info">
								<view class="price-box combination-price">
									<view v-if="titleShow" class="name line1">{{ presellList[0].product.store_name }}</view>
									<text :style="'color:'+themeColor" v-if="priceShow" class="price">
										<text>￥</text>
										{{ presellList[0].price }}
									</text>
									<text v-if="presellShow" class="gocom_btn">
										去预定
										<text class="iconfont icon-jiantou"></text>
									</text>
								</view>
							</view>
							<view class="img-box">
								<easy-loadimage mode="widthFix" :image-src="presellList[0].product.image"></easy-loadimage>
							</view>
						</navigator>
						<navigator v-if="presellList.length == 1" 
							class="combination-item"
							hover-class="none" 
							:url="'/pages/activity/presell_details/index?id=' + presellList[1].product_presell_id"
							:style="'border-radius:'+conStyle">
							<view class="info">
								<view class="price-box combination-price">
									<view v-if="titleShow" class="name line1">{{ presellList[0].product.store_name }}</view>
									<text :style="'color:'+themeColor" v-if="priceShow" class="price">
										<text>￥</text>
										{{ presellList[0].price }}
									</text>
									<text v-if="presellShow" class="gocom_btn">
										去预定
										<text class="iconfont icon-jiantou"></text>
									</text>
								</view>
							</view>
							<view class="img-box">
								<easy-loadimage mode="widthFix" :image-src="presellList[0].product.image"></easy-loadimage>
							</view>
						</navigator>
						<navigator v-if="presellList.length == 2"
						class="combination-item"
						hover-class="none" 
						:url="'/pages/activity/presell_details/index?id=' + presellList[1].product_presell_id"
						:style="'border-radius:'+conStyle">
							<view class="info">
								<view class="price-box combination-price">
									<view v-if="titleShow" class="name line1">{{ presellList[1].product.store_name }}</view>
									<text :style="'color:'+themeColor" v-if="priceShow" class="price">
										<text>￥</text>
										{{ presellList[1].price }}
									</text>
									<text v-if="presellShow" class="gocom_btn">
										去预定
										<text class="iconfont icon-jiantou"></text>
									</text>
								</view>
							</view>
							<view class="img-box">
								<easy-loadimage mode="widthFix" :image-src="presellList[1].product.image"></easy-loadimage>
							</view>
						</navigator>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
import { getPresellList } from '@/api/activity.js';

export default {
	components:{
		easyLoadimage
	},
	name: 'presellList',
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
	data() {
		return {
			presellList: [],
			mbConfig: this.dataConfig.mbConfig.val*2, //页面间距
			styleType: this.dataConfig.tabConfig.tabVal, //单行，多行，板块
			bgStyle: this.dataConfig.bgStyle.type ? 20 : 0,
			conStyle: this.dataConfig.conStyle.type ? 16 : 0,
			titleShow: this.dataConfig.titleShow.val,
			priceShow: this.dataConfig.priceShow.val,
			themeColor: this.dataConfig.themeColor && this.dataConfig.themeColor.color[0].item,
			presellShow: this.dataConfig.presellShow.val
		};
	},
	created() {},
	mounted() {
		console.log(this.dataConfig)
		this.getPresellProduct()
	},
	methods: {
		// 预售
		getPresellProduct() {
			let that = this;
			getPresellList({
				mer_id: that.merId,limit: that.styleType == 2 ? 3 : 12
			}).then(res => {
				that.presellList = res.data.list;
			}).catch(e => {});
		},
	}
};
</script>

<style scoped lang="scss">
@import '../style/main.scss';
.presell-wrapper{
	margin: 0 20rpx;
}
.spike-wrapper {
	&.wrapper2{
		padding: 0 20rpx 20rpx;
	}
	
}
.presell-count {
	background-color: #fff;
	border-radius: 16rpx;
	box-shadow: 4rpx 2rpx 12rpx 2rpx rgba(0, 0, 0, 0.03);
}
.title-bd {
	margin-bottom: 0;
	padding: 24rpx 30rpx 30rpx 30rpx;
	border-radius: 16rpx 16rpx 0 0;
	background-image: url('data:image/png;base64,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');
	background-size: 100%;
	background-repeat: no-repeat;
	.more-btn {
		top: 23rpx;
	}
}
.wapper_count {
	padding-left: 20rpx;
}
.wrapper-count2{
	.wapper_count{
		padding: 0;
	}
}


</style>
