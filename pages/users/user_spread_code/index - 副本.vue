<template>
	<view :style="viewColor">
		<view class='distribution-posters'>
			<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :circular="circular" :interval="interval" :duration="duration"
			 @change="bindchange" previous-margin="40px" next-margin="40px">
				<block v-for="(item,index) in spreadData" :key="index" class="img-list">
					<swiper-item class="aaa">
						<div class="box" ref="bill" :class="swiperIndex == index ? 'active' : 'quiet'">
							<view class="user-msg">
								<view class="user-code">
									<image class="canvas" :style="{height:hg+'px'}" :src="posterImage[index]" v-if="posterImage[index]"></image>
									<canvas class="canvas" :style="{height:hg+'px'}" :canvas-id="'myCanvas'+ index" v-else></canvas>						
								</view>
							</view>
						</div>
						<!-- <image :src="item.wap_poster" class="slide-image" :class="swiperIndex == index ? 'active' : 'quiet'" mode='aspectFill' /> -->
					</swiper-item>
				</block>
			</swiper>
			<!-- #ifndef H5  -->
			<view class='keep b-color' @click='savePosterPath(posterImage[swiperIndex])'>保存海报</view>
			<!-- #endif -->
			<!-- #ifndef MP || APP-PLUS -->
			<div class="preserve acea-row row-center-wrapper">
				<div class="line"></div>
				<div class="tip">长按保存图片</div>
				<div class="line"></div>
			</div>
			<!-- #endif -->
		</view>
		<!-- #ifdef MP -->
		<!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
		<!-- #endif -->
		
		<view class="qrimg">
			<zb-code ref="qrcode" :show="codeShow" :cid="cid" :val="val" :size="size" :unit="unit" :background="background"
			 :foreground="foreground" :pdground="pdground" :icon="icon" :iconSize="iconsize" :onval="onval" :loadMake="loadMake"
			 @result="qrR" />
		</view>
	</view>
</template>

<script>
	import zbCode from '@/components/zb-code/zb-code.vue'
	import {
		getUserInfo,
		spreadBanner,
		spreadMsg,
		imgToBase
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import home from '@/components/home';
	// #ifdef APP-PLUS
	import {HTTP_REQUEST_URL} from '@/config/app.js'
	// #endif
	export default {
		components: {
			// #ifdef MP
			authorize,
			// #endif
			home,
			zbCode
		},
		data() {
			return {
				imgUrls: [],
				indicatorDots: false,
				posterImageStatus: true,
				circular: false,
				autoplay: false,
				interval: 3000,
				duration: 500,
				swiperIndex: 0,
				spreadList: [],
				userInfo: {},
				poster: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				spreadData: [{}], //新海报数据
				nickName: "",
				siteName: "",
				mpUrl: "",
				canvasImageUrl: '',
				posterImage: [],
				//二维码参数
				codeShow: false,
				cid: '1',
				ifShow: true,
				val: "", // 要生成的二维码值
				size: 200, // 二维码大小
				unit: 'upx', // 单位
				background: '#FFF', // 背景色
				foreground: '#000', // 前景色
				pdground: '#32dbc6', // 角标色
				icon: '', // 二维码图标
				iconsize: 40, // 二维码图标大小
				lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
				onval: true, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				src: '', // 二维码生成后的图片地址或base64
				codeSrc: "",
				wd: 225,
				hg: 500
			};
		},
		computed: mapGetters({
			'isLogin': 'isLogin',
			'userData': 'userInfo',
			'viewColor': 'viewColor'
		}),
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.userSpreadBannerList();
					}
				},
				deep: true
			},
			userData: {
				handler: function(newV, oldV) {
					if (newV) {
						this.$set(this, 'userInfo', newV);
					}
				},
				deep: true
			}
		},
		async onReady() {
			if (this.isLogin) {
				// #ifdef H5
				let userData = await getUserInfo()
				this.val = window.location.host + '?spread=' + userData.data.uid
				// #endif
				await this.spreadMsg()
			} else {
				toLogin();
			}
			
		},
		onShow() {
			// #ifdef APP-PLUS
			console.log(HTTP_REQUEST_URL,'=============')
			// #endif
			this.$nextTick(() => {
				let selector = uni.createSelectorQuery().select('.aaa');
				selector.fields({
					size: true
				}, data => {
					console.log(data)
					this.wd = data.width
					this.hg = data.height
				}).exec();
			})
		},
		methods: {
			onLoadFun: function(e) {
				this.$set(this, 'userInfo', e);
				this.userSpreadBannerList();
			},
			qrR(res) {
				this.codeSrc = res
			},
			//获取图片
			async spreadMsg() {
				let that = this
				let rqData = {
					// #ifdef MP
					type: 'routine',
					// #endif
					// #ifndef MP
					type: 'h5',
					// #endif
				}
				let res = await spreadMsg(rqData);
				console.log(res);
				that.spreadData = res.data.poster
				that.nickName = res.data.nickname
				that.siteName = res.data.site_name

				let codeUrl = "?spread=" + that.userInfo.uid
				// #ifdef MP || APP-PLUS
				let mpUrl = await that.downloadFilestoreImage(res.data.qrcode)
				// #endif
				uni.showLoading({
					title: '海报生成中',
					mask: true
				});
				for (let i = 0; i < res.data.poster.length; i++) {
					let arr2
					// #ifdef MP || APP-PLUS	
					arr2 = [mpUrl, await that.downloadFilestoreImage(res.data.poster[i].pic)]
					// #endif
					// #ifdef H5
					let img = await that.imgToBase(res.data.poster[i].pic)
					arr2 = [await that.imgToBase(res.data.qrcode), img]			
					// #endif
					that.$util.userPosterCanvas(arr2, res.data.nickname, res.data.mark, i, that.wd, that.hg, (tempFilePath) => {
							that.$set(that.posterImage, i, tempFilePath);
					});
					
					
				}
				uni.hideLoading();
			},
			// downloadImg() {
			// 	uni.saveImageToPhotosAlbum({
			// 		filePath: this.posterImage[this.swiperIndex],
			// 		success: function() {
			// 			console.log('save success');
			// 		}
			// 	});
			// },
			async imgToBase(url) {
				let res = await imgToBase({
					image: url
				})
				return res.data.image
			},
			// 二维码生成
			codeImg() {
				// http://当前域名+"?spread="+用户uid
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			bindchange(e) {
				let spreadList = this.spreadList;
				this.swiperIndex = e.detail.current;
				// this.$set(this, 'poster', spreadList[e.detail.current].poster);
			},
			savePosterPath(url) {
				// let that = this;
				// uni.downloadFile({
				// 	url: that.poster,
				// 	success(resFile) {
				// 		if (resFile.statusCode === 200) {
				// 			uni.getSetting({
				// 				success(res) {
				// 					if (!res.authSetting['scope.writePhotosAlbum']) {
				// 						uni.authorize({
				// 							scope: 'scope.writePhotosAlbum',
				// 							success() {
				// 								uni.saveImageToPhotosAlbum({
				// 									filePath: resFile.tempFilePath,
				// 									success: function(res) {
				// 										return that.$util.Tips({
				// 											title: '保存成功'
				// 										});
				// 									},
				// 									fail: function(res) {
				// 										return that.$util.Tips({
				// 											title: res.errMsg
				// 										});
				// 									},
				// 									complete: function(res) {},
				// 								})
				// 							},
				// 							fail() {
				// 								uni.showModal({
				// 									title: '您已拒绝获取相册权限',
				// 									content: '是否进入权限管理，调整授权？',
				// 									success(res) {
				// 										if (res.confirm) {
				// 											uni.openSetting({
				// 												success: function(res) {
				// 													console.log(res.authSetting)
				// 												}
				// 											});
				// 										} else if (res.cancel) {
				// 											return that.$util.Tips({
				// 												title: '已取消！'
				// 											});
				// 										}
				// 									}
				// 								})
				// 							}
				// 						})
				// 					} else {
				// 						uni.saveImageToPhotosAlbum({
				// 							filePath: resFile.tempFilePath,
				// 							success: function(res) {
				// 								return that.$util.Tips({
				// 									title: '保存成功'
				// 								});
				// 							},
				// 							fail: function(res) {
				// 								return that.$util.Tips({
				// 									title: res.errMsg
				// 								});
				// 							},
				// 							complete: function(res) {},
				// 						})
				// 					}
				// 				},
				// 				fail(res) {
				
				// 				}
				// 			})
				// 		} else {
				// 			return that.$util.Tips({
				// 				title: resFile.errMsg
				// 			});
				// 		}
				// 	},
				// 	fail(res) {
				// 		return that.$util.Tips({
				// 			title: res.errMsg
				// 		});
				// 	}
				// })
				let that = this;
				// #ifdef MP
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.writePhotosAlbum']) {
							uni.authorize({
								scope: 'scope.writePhotosAlbum',
								success() {
									uni.saveImageToPhotosAlbum({
										filePath: url,
										success: function(res) {
											that.$util.Tips({
												title: '保存成功',
												icon: 'success'
											});
										},
										fail: function(res) {
											that.$util.Tips({
												title: '保存失败'
											});
										}
									});
								}
							});
						} else {
							uni.saveImageToPhotosAlbum({
								filePath: url,
								success: function(res) {
									that.$util.Tips({
										title: '保存成功',
										icon: 'success'
									});
								},
								fail: function(res) {
									that.$util.Tips({
										title: '保存失败'
									});
								}
							});
						}
					}
				});
				// #endif
				// #ifdef APP-PLUS
				uni.saveImageToPhotosAlbum({
					filePath: url,
					success: function(res) {
						that.$util.Tips({
							title: '保存成功',
							icon: 'success'
						});
					},
					fail: function(res) {
						that.$util.Tips({
							title: '保存失败'
						});
					}
				});
				// #endif
			},
			//图片转符合安全域名路径
			downloadFilestoreImage(url) {
				return new Promise((resolve, reject) => {
					let that = this;
					uni.downloadFile({
						url: url,
						success: function(res) {
							resolve(res.tempFilePath);
						},
						fail: function() {
							return that.$util.Tips({
								title: ''
							});
						}
					});
				})
			},
			setShareInfoStatus: function() {
				if (this.$wechat.isWeixin()) {
					if (this.isLogin) {
						getUserInfo().then(res => {
							let configAppMessage = {
								desc: '分销海报',
								title: res.data.nickname + '-分销海报',
								link: '/pages/index/index?spread=' + res.data.uid,
								imgUrl: this.spreadList[0]
							};
							this.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"], configAppMessage)
						});
					} else {
						toLogin();
					}

				}
			},
			userSpreadBannerList: function() {
				let that = this;
				uni.showLoading({
					title: '获取中',
					mask: true,
				})
				spreadBanner().then(res => {
					uni.hideLoading();
					that.$set(that, 'spreadList', res.data);
					that.$set(that, 'poster', res.data[0].poster);
					// #ifdef H5
					that.setShareInfoStatus();
					// #endif
				}).catch(err => {
					uni.hideLoading();
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #a3a3a3 !important;
	}

	.canvas {
		width: 100%;
		// height: 550px;
	}

	.box {
		width: 100%;
		height: 100%;
		position: relative;
		border-radius: 18rpx;
		overflow: hidden;

		.user-msg {
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			.user-code {
				width: 100%;
				// height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				justify-content: space-between;

				image {
					width: 100%;
				}
			}
		}
	}

	.img-list {
		margin-right: 40px;
	}

	.distribution-posters swiper {
		width: 100%;
		height: 1000rpx;
		position: relative;
		margin-top: 40rpx;
	}

	.distribution-posters .slide-image {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		border-radius: 15rpx;
	}

	.distribution-posters /deep/.active {
		transform: none;
		transition: all 0.2s ease-in 0s;
	}

	.distribution-posters /deep/ .quiet {
		transform: scale(0.8333333);
		transition: all 0.2s ease-in 0s;
	}

	.distribution-posters .keep {
		font-size: 30rpx;
		color: #fff;
		width: 600rpx;
		height: 80rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 80rpx;
		margin: 38rpx auto;
		background-color: var(--view-theme);
	}

	.distribution-posters .preserve {
		color: #fff;
		text-align: center;
		margin-top: 38rpx;
	}

	.distribution-posters .preserve .line {
		width: 100rpx;
		height: 1px;
		background-color: #fff;
	}

	.distribution-posters .preserve .tip {
		margin: 0 30rpx;
	}
</style>
