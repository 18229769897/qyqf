<template>
	<view v-if="plantList.length > 0" :style="'margin-top:'+mbConfig+'rpx;'">
		<view class="plant-count skeleton-rect" :style="'margin: 0 '+prConfig+'rpx;border-radius:'+bgStyle+'rpx'">
			<block v-if="community_status">
				<view class="spike-bd plant_bg">
					<view class="title line1"><image class="title-img" src="/static/images/plant_title.png"></image></view>
					<navigator v-if="!merId" :open-type="open_grass ? 'switchTab' : 'navigate'" url="/pages/plant_grass/index" class="more-btn" hover-class="none">
						好物分享
						<text class="iconfont icon-jiantou" hover-class="none"></text>
					</navigator>
				</view>
				<view class="live-wrapper plant" style="border-radius: 0;">
					<scroll-view :class="'colum'+styleType" :scroll-x="styleType == 0 ? true : false" >
						<navigator hover-class="none" 
						:url="'/pages/plantGrass/plant_detail/index?id='+item.community_id" 
						v-for="(item, index) in plantList" 
						:key="index" 
						class="item" 
						:class="'plant-item'+styleType"
						:style="'border-radius:'+conStyle+'rpx'"
						>
							<view :class="'img-box'+conStyle">
								<easy-loadimage mode="widthFix" :image-src="item.image[0]"></easy-loadimage>
								<view class="item_text">
									<text v-if="titleShow" class="text_name line1">{{item.title}}</text>
									<view v-if="avatarShow || nicknameShow" class="text_count acea-row">
										<image v-if="avatarShow" :src="(item.author && item.author.avatar) || '/static/images/f.png'" ></image>
										<text v-if="nicknameShow" class="name line1">{{(item.author && item.author.nickname) || ''}}</text>
									</view>
									<view class="like_count" v-if="styleType == 1">
										<text class="iconfont" :class="item.relevance_id ? 'icon-shoucang1' : 'icon-dianzan'"></text>
										<text class="collect">{{item.count_start}}</text>
									</view>
								</view>
							</view>
						</navigator>
					</scroll-view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue';
import { graphicLstApi } from '@/api/community.js';
import { openPlantGrass } from "@/config/app.js";
import { mapGetters } from 'vuex';
import { configMap } from '@/utils';
export default {
	computed: configMap(['community_status']),
	components:{
		easyLoadimage
	},
	name: 'plantList',
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
			plantList: [],
			open_grass: openPlantGrass,
			mbConfig: this.dataConfig.mbConfig.val*2, //页面间距
			styleType: this.dataConfig.tabConfig.tabVal, //单行，多行，板块
			prConfig: this.dataConfig.prConfig.val*2, //背景间距
			bgStyle: this.dataConfig.bgStyle.type ? 16 : 0,
			conStyle: this.dataConfig.conStyle.type ? 16 : 0,
			titleShow: this.dataConfig.titleShow.val,
			avatarShow: this.dataConfig.avatarShow.val,
			nicknameShow: this.dataConfig.nicknameShow.val
		};
	},
	created() {},
	mounted() {
		this.getPlantList()
	},
	methods: {
		// 种草
		getPlantList(){
			let that = this;
			graphicLstApi({
				mer_id: that.merId,
				limit: 6
			}).then(res => {
					that.plantList = res.data.list;
			}).catch(e => {});
		},
	}
};
</script>

<style scoped lang="scss">
@import '../style/main.scss';
.plant-count{
	background: #ffffff;
	box-shadow: 4rpx 2rpx 12rpx 2rpx rgba(0, 0, 0, 0.03);
}
.plant_bg{
	margin-bottom: 0;
	border-radius: 0;
	padding: 24rpx 20rpx 27rpx 30rpx;
	background-image: url('data:image/png;base64,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');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	.more-btn{
		top: 22rpx;
	}
}
.live-wrapper {
	position: relative;
	width: 100%;
	overflow: hidden;
	border-radius: 16rpx;
	padding: 20rpx 20rpx 0;
	image {
		width: 100%;
		height: 400rpx;
	}
	.item{
		position: relative;
		width: 280rpx;
		height: 280rpx;
		display: inline-block;
		overflow: hidden;
		margin-right: 20rpx;
		/deep/image,.easy-loadimage,uni-image {
			width: 280rpx;
			height: 280rpx;
		}
		.img-box16{
			/deep/image,.easy-loadimage,uni-image {
				border-radius: 16rpx;
			}
		}
		.img-box0{
			/deep/image,.easy-loadimage,uni-image {
				border-radius: 0;
			}
		}
		&::before{
			content: "";
			display: block;
			width: 280rpx;
			height: 280rpx;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 9;
		}
		.item_text{
			width: 260rpx;
			padding: 17rpx 15rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			color: #ffffff;
			z-index: 9;
			image {
				width: 34rpx;
				height: 34rpx;
				border-radius: 100%;
			}
			.text_name{
				font-size: 24rpx;
				width: 260rpx;
				word-break: normal;
				word-wrap: break-word;
				display: block;
			}
			.text_count{
				margin-top: 12rpx;
				align-items: center;
				.name{
					font-size: 18rpx;
					margin-left: 10rpx;
					max-width: 200rpx;
				}
			}
		}
		&.plant-item1{
			width: 324rpx;
			height: 440rpx;
			margin-bottom: 20rpx;
			&:nth-child(2n){
				margin-right: 0;
			}
			/deep/image,.easy-loadimage,uni-image {
				width: 324rpx;
				height: 334rpx;
			}
			&::before{
				width: 324rpx;
				height: 334rpx;
			}
			.item_text{
				position: static;
				color: #282828;
				position: relative;
				width: 100%;
				height: 110rpx;
				.text_name {
					font-size: 28rpx;
					font-weight: bold;
				}
				.text_count{
					width: 100%;
					display: flex;
					align-items: center;
					.name{
						max-width: 160rpx;
					}
				}
				.like_count{
					position: absolute;
					bottom: 10rpx;
					right: 20rpx;
					font-size: 24rpx;
					display: flex;
					align-items: center;
					.iconfont{
						margin-right: 6rpx;
					}
					.icon-shoucang1{
						color: #E93323;
					}
				}
				image {
					width: 34rpx;
					height: 34rpx;
					border-radius: 100%;
				}
			}
		}
	}
}
</style>
