<template>
	<view :style="viewColor">
		<form @submit="formSubmit" report-submit='true'>
			<view class="release_content">
				<view class="release_item">
					<view class="photo_count">
						<view class="input_photo acea-row row-middle">
							<view class="pictrue" v-for="(item, index) in formData.image" :key="index">
								<image :src="item"></image>
								<view class="close_btn" @click="DelPic(index)"><text class="iconfont icon-guanbi4"></text></view>
							</view>
							<view v-if="formData.image.length < 6" class="pictrue acea-row row-center-wrapper row-column add" @click="clk">
								<view><text class='iconfont icon-icon25201'></text></view>
								<view class="text">添加图片</view>
							</view>
						</view>
					</view>
					<view class="textarea">
						<textarea placeholder='分享使用体验和心得，获得更多点赞和关注哦~(600字以内)' name="comment" placeholder-class='placeholder'v-model="formData.content" maxlength="600"></textarea>
					</view>
				</view>
				<view class="release_item">
					<view class='item acea-row row-between-wrapper'>
						<view class='name'><text class="iconfont icon-baobeilianjie"></text>添加宝贝({{productList.length}})</view>
						<view class="select">
							<view class="select_count" @click.stop="addProduct">
								<text v-if="productList.length == 0" class="text">选择商品</text>
								<view v-else class="text">
									<image class="image" v-for="(item,index) in productList" :key="index" :src="item.image || (item.spu && item.spu.image)"></image>
								</view>
								<text class="iconfont icon-xiangyou"></text>
							</view>
						</view>
					</view>
					<view class='item acea-row row-between-wrapper'>
						<view class='name'><text class="iconfont icon-canyuhuati"></text>参与话题</view>
						<view class="select">
							<view class="select_count" @click.stop="addTopic">
								<text v-if="!topicName.topic_name"class="text">选择话题</text>
								<text v-else class="text_name">
									<text class="icon">#</text>
									<text class="title">{{topicName.topic_name}}</text>
									<text class="iconfont icon-guanbi5" @click.stop="deleteTopic"></text>
								</text>
								<text class="iconfont icon-xiangyou"></text>
							</view>
						</view>
					</view>
				</view>
				<button class="release_btn button" form-type="submit">发布</button>
			</view>
		</form>
		<avatar @upload="doUpload" @getName="getImgName" quality="1" ref="avatar" selWidth="250upx" selHeight="250upx"></avatar>
		<!-- 提到的宝贝弹窗 -->
		<uni-popup ref="associated" type="bottom">
			<associated @close="close" @getProduct="getProduct" :checkedObj="productList"></associated>
		</uni-popup>
		<!-- 话题弹窗 -->
		<uni-popup ref="participateTopic" type="bottom">
			<participate-topic @close="close" @getTopic="getTopic"></participate-topic>
		</uni-popup>
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
	import { mapGetters } from "vuex";
	import authorize from '@/components/Authorize';
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	import associated from '../components/associated.vue';
	import participateTopic from '../components/participateTopic.vue';
	import {TOKENNAME, HTTP_REQUEST_URL} from '@/config/app.js';
	import {createPlantApi, updatePlantApi, plantDetailApi, orderAssociatePlantApi} from "@/api/community";
	import { setStorage, getStorage } from '../../../libs/uniApi.js';
	import store from '@/store';
	export default {
		components: {
			avatar,
			associated,
			participateTopic,
			authorize,
		},
		data() {
			return {
				formData: {
					image: [],
					content: "",
					topic_id: "",
					spu_id: [],
				},
				productList: [],
				topicName: {},
				isUpload: true,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				id: "",
				order_id: "",
				imgName: ""
			};
		},
		computed: mapGetters(['isLogin','viewColor']),
		watch:{
			formData:{
				handler(n){
					if(!this.id){
						setTimeout(()=>{
							setStorage('addPlant', n);
						});
					}
				},
				deep: true
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.order_id = options.order_id
			if (!this.isLogin)  {
                this.isAuto = true;
                this.isShowAuth = true
			}else{
				if(this.id){
					this.getDetail()
				} else {
					const data = getStorage('addPlant');
					if(data){
						this.formData.content = data.content || '';
						this.formData.image = data.image || [];
					}
				}
				if(this.order_id)this.getOrderGoods()
			}
		},
		methods: {
			onLoadFun() {
				this.isShowAuth = false;
			},
            // 授权关闭
            authColse: function(e) {
                this.isShowAuth = e;
            },
			/*获取图文详情*/
			getDetail(){
				let that = this
				plantDetailApi(that.id).then(res => {
					that.formData = res.data
					that.productList = res.data.relevance || []
					that.topicName = res.data.topic || {}
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
			/*获取关联订单商品*/
			getOrderGoods(){
				let that = this
				orderAssociatePlantApi(that.order_id).then(res => {
					that.productList = res.data || []
					that.formData.spu_id = res.data.map(val => val.spu_id)
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
			/*删除话题*/
			deleteTopic(){
				this.formData.topic = {}
				this.topicName = {}
			},
			clk() {
				let avatar = this.$refs.avatar;
				avatar.fChooseImg(1,{selWidth: '350upx', selHeight: '350upx', inner: true});
			},
			doUpload(rsp) {
				let that = this
				uni.uploadFile({
					url: HTTP_REQUEST_URL + '/api/upload/image/field',
					filePath: rsp.path,
					name: 'field',
					formData: {
						'filename': rsp.path,
						'name': that.imgName
					},
					header: {
						// #ifdef MP
						"Content-Type": "multipart/form-data",
						// #endif
						[TOKENNAME]: 'Bearer ' + store.state.app.token
					},
					success: (uploadFileRes) => {
						let imgData = JSON.parse(uploadFileRes.data)
						if(imgData.data)that.formData.image.push(imgData.data.path)
					},
					complete(res) {
						let data = JSON.parse(res.data)
						that.$util.Tips({
							title: data.message
						});

					}
				});
			},
			getImgName(name){
				this.imgName = name
			},
			/**删除图片*/
			DelPic: function(index) {
				let that = this
				that.formData.image.splice(index, 1);
			},
			/*添加宝贝*/
			addProduct(){
				this.$refs.associated.open();
			},
			/*添加话题*/
			addTopic(){
				this.$refs.participateTopic.open();
			},
			close(){
				this.$refs.associated.close();
				this.$refs.participateTopic.close();
			},
			/*获取选中的宝贝*/
			getProduct(data){
				this.productList = data;
				this.formData.spu_id = data.map(val => val.spu_id)
				this.$refs.associated.close();
			},
			/*获取选中的话题*/
			getTopic(item){
				if(!item.topic_id){
					this.topicName = {}
				}else{
					this.topicName = item
				}
				this.formData.topic_id = item.topic_id;
				this.$refs.participateTopic.close();
			},
			/**
			 * 提交数据
			 */
			formSubmit: function(e) {
				let that = this,
					value = that.formData;
				if (value.image.length == 0) return that.$util.Tips({
					title: '请添加专题图片'
				});
				if (!value.content) return that.$util.Tips({
					title: '请分享使用心得和体会'
				});
				if(that.id){
					if (value.relevance.length){
						value.spu_id = value.relevance.map(val => (val.spu&&val.spu.spu_id) || val.spu_id)
					}
				}
				// if (value.spu_id.length == 0) return that.$util.Tips({
				// 	title: '请添加宝贝'
				// });
				value.order_id = that.order_id
				uni.showLoading({
					title: '保存中',
					mask: true
				})
				that.id ? updatePlantApi(that.id, value).then(res => {
					uni.hideLoading()
					that.$util.Tips({
						title: res.messge,
						icon: 'success'
					});
					setTimeout(function() {
						uni.redirectTo({
							url:'/pages/plantGrass/plant_detail/index?id='+res.data.community_id
						})
					}, 1000);
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				}) : createPlantApi(value).then(res => {
					uni.hideLoading()
					that.$util.Tips({
						title: res.messge,
						icon: 'success'
					});
					setStorage('addPlant', '');
					setTimeout(function() {
						uni.redirectTo({
							url:'/pages/plantGrass/plant_detail/index?id='+res.data.community_id
						})
					}, 1000);
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #F5F5F5;
	}
	.release_content{
		padding: 0 20rpx;
		.release_item{
			background: #ffffff;
			padding: 0 30rpx;
			border-radius: 10rpx;
			margin-top: 20rpx;
		}
		.photo_count{
			padding: 30rpx 0;
		}
	}
	.input_photo .pictrue,.input_photo .uni-image,.input_photo image{
		width: 210rpx;
		height: 210rpx;
		border-radius: 8rpx;
		margin-right: 11rpx;
		position: relative;
		&:nth-child(3n){
			margin-right: 0;
		}
		.close_btn{
			width: 40rpx;
			height: 40rpx;
			background: rgba(0,0,0,.6);
			border-radius: 0 8rpx 0 8rpx;
			position: absolute;
			top: 0;
			right: 0;
			text-align: center;
			.iconfont{
				color: #fff;
				font-size: 16rpx;
			}
		}

	}
	.input_photo .pictrue{
		margin-bottom: 20rpx;
	}
	.input_photo .add{
		border: 1rpx solid #DDDDDD;
		color: #BBBBBB;

		.iconfont{
			font-size: 50rpx;
		}
		.text{
			margin-top: 20rpx;
			font-size: 27rpx;
		}
	}
	.textarea textarea {
		font-size: 28rpx;
		padding-bottom: 38rpx;
		width: 100%;
		box-sizing: border-box;
		height: 400rpx;
		overflow: hidden;
	}
	.textarea .placeholder {
		color: #BBBBBB;
	}
	.release_item .item{
		height: 106rpx;
		border-bottom: 1rpx solid #eee;
		position: relative;
		font-size: 30rpx;
		&:last-child{
			border-bottom: none;
		}
		.name{
			color: #333333;
			.iconfont {
				margin-right: 10rpx;
				font-size: 28rpx;
			}
		}
		.select{
			color: #bbbbbb;
			.select_count{
				display: flex;
				align-items: center;
			}
			.text{
				margin-right: 15rpx;
				display: flex;
				align-items: center;
				.image,image,uni-image{
					width: 60rpx;
					height: 60rpx;
					margin-right: 5rpx;
				}
			}
			.iconfont{
				font-size: 24rpx;
			}
			.text_name{
				color: var(--view-theme);
				padding: 5rpx 12rpx;
				background: var(--view-minorColor);
				border-radius: 23rpx;
				font-size: 24rpx;
				margin-right: 10rpx;
				.icon{
					color: var(--view-theme);
					font-weight: bold;
					font-size: 24rpx;
				}
				.title{
					margin: 0 10rpx;
				}
				.iconfont{
					font-size: 16rpx;
				}
			}
		}
	}
	.button{
		width: 710rpx;
		height: 86rpx;
		line-height: 86rpx;
		color: #ffffff;
		text-align: center;
		font-size: 32rpx;
		background: var(--view-theme);
		border-radius: 43rpx;
	}
	.release_btn{
		position: fixed;
		bottom: 60rpx;
		left: 20rpx;
	}
</style>
