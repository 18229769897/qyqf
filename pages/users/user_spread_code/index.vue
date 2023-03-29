<template>
	<view class="page-box">
		<headBar2 isFixed="" title="邀请好友"></headBar2>
		<view class="fixed-mask"></view>
		<view style="position: fixed;opacity: 0;z-index: 0;" v-if="flag">
			<template v-for="(item,index) in canvasImages">
				<lyz-canvas :id="`canvas${index+1}`" :board="item"></lyz-canvas>
			</template>
		</view>
		<view style="z-index: 100;position: relative;">
			<view class="swiper-box">
				<template v-for="item in list">
					<view class="swiper-item flex-center">
						<image :src="item" mode=""></image>
					</view>
				</template>
			</view>
			<view class="share-box flex align-center justify-between">
				<text class="text-green2">我的邀请码</text>
				<view class="flex align-center">
					<text>{{userInfo.phone}}</text>
					<view class="btn-red copy-box round" @click="copy(userInfo.phone)">复制</view>
				</view>
			</view>
			<!-- <view class="btn-red" style="width: 600rpx; margin-top: 50rpx;" @click="download2">下载分享海报</view> -->
		</view>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	import { setClipboardData } from "@/utils/util2.js"
	import { getQrApi } from "@/api/user.js";
	export default {
		computed: {
			...mapGetters(["userInfo"])
		},
		data() {
			return {
				index: 0,
				src: "",
				flag: false,
				list: [],
				canvasImages: [],
			}
		},
		onLoad() {
			this.init();
		},
		methods: {
			async download2() {
				try {
					let [, res] = await uni.saveImageToPhotosAlbum({
						filePath: this.list[this.index]
					})
					this.$msg.succ("下载成功");
				} catch (e) {
					this.$msg.fail(e);
					console.log(e);
				}
			},
			async init() {
				uni.showLoading({
					title: "正在生成海报..."
				})
				try {
					let { data: { code_url } } = await getQrApi();
					this.canvasImages = [{
						"width": "577rpx",
						"height": "948rpx",
						"background": "transparent",
						"views": [{
								"type": "image",
								"url": require("./bg.png"),
								"css": {
									"background": "transparent",
									"width": "577rpx",
									"height": "948rpx",
									"top": "0rpx",
									"left": "0rpx",
									"rotate": "0",
									"radius": "",
									"borderWidth": "",
									"borderColor": "#000000",
									"shadow": "",
									"mode": "scaleToFill"
								}
							},
							{
								"type": "image",
								"url": code_url,
								"css": {
									"width": "170rpx",
									"height": "170rpx",
									"top": "750rpx",
									"left": "50rpx",
									"rotate": "0",
									"radius": "",
									"borderWidth": "",
									"borderColor": "#000000",
									"shadow": "",
									"mode": "scaleToFill"
								}
							},
						]
					}]
					this.flag = true;
					setTimeout(async () => {
						try {
							let [, res] = await uni.canvasToTempFilePath({
								canvasId: 'canvas1',
							})
							this.list = [res.tempFilePath];
							console.log(this.list);
							uni.hideLoading();
						} catch (e) {
							return this.$msg.fail(e);
							uni.hideLoading()
						}
					}, 2000)
				} catch (e) {
					uni.hideLoading()
					console.log(e);
					return this.$msg.fail(e);
				}
			},
			copy(val) {
				setClipboardData(val).then(() => {
					this.$msg.succ("复制成功");
				})
			},
			change(e) {
				this.index = e.detail.current;
			},
		}
	}
</script>

<style>
	page {
		min-height: 100vh;
	}

	.page-box {
		min-height: 100vh;
	}

	.swiper-box {
		width: 600rpx;
		height: 948rpx;
		margin-left: auto;
		margin-right: auto;
		margin-top: 50rpx;
	}

	.swiper-item {
		width: 577rpx;
	}

	.swiper-box image {
		width: 577rpx;
		height: 948rpx;
	}

	.share-box {
		border-radius: 10rpx;
		height: 80rpx;
		width: 580rpx;
		margin-top: 50rpx;
		margin-left: 75rpx;
		background-color: #f7fdf3;
		padding: 0 24rpx;
	}

	.copy-box {
		width: 120rpx;
		height: 55rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 54rpx;
		margin-left: 10rpx;
	}

	.download-btn {
		width: 580rpx;
		margin-top: 50rpx;
		margin-left: 75rpx;
		position: relative;
		z-index: 100;
	}
</style>
