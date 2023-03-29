<template>
	<view class="containers">
		<view style="color: #AAAAAA;">请确认是您本人操作，验证通过后不可修改</view>
		<view class="form_box">
			<u-field label-width="180" v-model="form.real_name" label="姓名" placeholder="请输入真实姓名" />
			<u-field label-width="180" v-model="type" label="证件类型" disabled placeholder="请输入真实姓名" />
			<u-field label-width="180" @click="show = true" disabled v-model="form.card_id" label="证件号" placeholder="请输入证件号码" />
		</view>
		<view class="grace-idcard-main">
			<view class="grace-idcard-text">
				上传身份证照片 ( 正面 )
			</view>
			<view class="grace-idcard-items">
				<view class="grace-idcard-uper-btn" @click="pickImg(1)">
					<view class="img">
						<image src="@/static/images/camera.png" mode="widthFix" />
					</view>
					<view class="text">选择照片</view>
				</view>
				<view class="grace-idcard-preview">
					<image :src="idcard1" mode="widthFix"></image>
				</view>
			</view>
			<view class="grace-idcard-text">
				上传身份证照片 ( 背面 )
			</view>
			<view class="grace-idcard-items">
				<view class="grace-idcard-uper-btn" @click="pickImg(2)">
					<view class="img">
						<image src="@/static/images/camera.png" mode="widthFix" />
					</view>
					<view class="text">选择照片</view>
				</view>
				<view class="grace-idcard-preview">
					<image :src="idcard2" mode="widthFix" />
				</view>
			</view>
		</view>
		<view class="check_btn" @click="checkUser">确 定</view>
		<u-keyboard mode="card" tips=" " :safe-area-inset-bottom="true" @change="valChange" @backspace="backspace" v-model="show"
			:cancelBtn="false"></u-keyboard>
	</view>
</template>

<script>
	import { authentication } from '@/api/user.js'
	import { HTTP_REQUEST_URL } from "@/config/app.js"
	import { uploadFile } from "@/utils/util2.js"
	export default {
		data() {
			return {
				show: false,
				type: "身份证",
				idcard1: "", // 身份证正面图片
				idcard2: "", // 身份证反面图片
				form: {
					real_name: "",
					card_id: "",
					idcard1: "", // 身份证正面图片
					idcard2: "" // 身份证反面图片
				}
			}
		},
		onLoad() {
			this.$Cache.clear("hjyx_idcard1");
			this.$Cache.clear("hjyx_idcard2");
		},
		onShow() {
			if (this.$Cache.has("hjyx_idcard1")) this.idcard1 = this.$Cache.get("hjyx_idcard1");
			if (this.$Cache.has("hjyx_idcard2")) this.idcard2 = this.$Cache.get("hjyx_idcard2");
		},
		methods: {
			valChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				if (this.form.card_id.length <= 17) {
					this.form.card_id += val;
				}
			},
			backspace() {
				// 删除value的最后一个字符
				if (this.form.card_id.length) {
					this.form.card_id = this.form.card_id.substr(0, this.form.card_id.length - 1);
				}
			},

			/**
			 * 提交
			 */
			async checkUser() {
				if (!this.idcard1 || !this.idcard2) return this.$msg.fail("请选择身份证图片");
				if (!this.form.real_name) return this.$msg.fail("请输入真实姓名");
				let p = {
					url: `${HTTP_REQUEST_URL}/api/upload/image/field`,
					filePath: [this.idcard1, this.idcard2],
					name: "field"
				}
				let arr = await uploadFile(p)
				arr.forEach((item, index) => {
					this.form["idcard" + (index + 1)] = item.data.path
				})
				uni.showLoading();
				try {
					let { message } = await authentication(this.form);
					this.$msg.succ(message, () => {
						uni.switchTab({
							url: "/pages/user/index"
						})
					});
				} catch (e) {
					return this.$msg.fail(e);
				} finally {
					uni.hideLoading()
					this.$Cache.clear("hjyx_idcard1");
					this.$Cache.clear("hjyx_idcard2");
				}
			},
			pickImg(index) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: res => {
						const tempFilePaths = res.tempFilePaths[0];
						uni.navigateTo({
							url: `/pages/cropper/index?src=${tempFilePaths}&name=hjyx_idcard${index}`
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF !important;
	}

	.containers {
		box-sizing: border-box;
		padding: 24rpx 36rpx 0;
	}

	.u-field {
		padding-left: 0 !important;
	}

	.form_box {
		margin-top: 30rpx;
	}

	.check_btn {
		height: 80rpx;
		font-size: 30rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 80rpx;
		margin-top: 100rpx;
		background-color: $red;
		border-radius: 8rpx;
	}

	.grace-idcard-main {
		font-size: 28rpx;
		padding: 20rpx 10rpx;
	}

	.grace-idcard-desc {
		line-height: 2em;
		background: #FFFFFF;
		padding: 20rpx;
		border-radius: 10rpx;
	}

	.grace-idcard-text {
		line-height: 2em;
		margin-top: 30rpx;
	}

	.grace-idcard-items {
		background: #FFFFFF;
		padding: 30rpx 0;
		display: flex;
		border-radius: 10rpx;
		align-items: flex-start;
	}

	.grace-idcard-uper-btn {
		width: 276rpx;
		margin-right: 60rpx;
		background: #F1F1F1;
		padding-bottom: 10rpx;
		border-radius: 10rpx;
		text-align: center;
	}

	.grace-idcard-uper-btn .img {
		width: 100rpx;
		height: 100rpx;
		margin: 0 auto;
		margin-top: 30rpx;
	}

	.grace-idcard-uper-btn .img image {
		width: 100rpx;
		height: 100rpx;
	}

	.grace-idcard-uper-btn .text {
		width: 100%;
		margin-top: 10rpx;
		text-align: center;
		line-height: 2em;
	}

	.grace-idcard-preview {
		width: 292rpx;
		height: 184rpx;
		margin: 0 30rpx;
	}

	.grace-idcard-preview image {
		width: 100%;
	}
</style>
