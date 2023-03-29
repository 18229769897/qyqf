<template>
	<view v-if="!successful" :style="viewColor">
		<form report-submit='true'>
			<view class='merchantsSettled'>
				<image mode="widthFix" class="merchantBg" src="../static/images/merchantBg.jpg"></image>
				<view class='list'>
					<view class="item">
						<view class="acea-row row-middle">
							<!-- <i class="icon iconfont icon-qiye"></i> -->
							<input type="text" maxlength="30" placeholder="请输入商户名称" v-model="merchantData.enterprise_name"
								@change="validateBtn" placeholder-class='placeholder' />
						</view>
					</view>
					<view class="item">
						<view class="acea-row row-middle">
							<!-- <i class="icon iconfont icon-yonghu3"></i> -->
							<input type="text" placeholder="请输入公司法人姓名" v-model="merchantData.user_name" @change="validateBtn"
								placeholder-class='placeholder' />
						</view>
					</view>
					<view class="item">
						<view class="acea-row row-middle">
							<!-- <i class="icon iconfont icon-yonghu3"></i> -->
							<input type="text" placeholder="请输入详细经营地址" v-model="address" @change="validateBtn"
								placeholder-class='placeholder' />
						</view>
					</view>
					<view class="item">
						<view class="acea-row row-middle">
							<!-- <i class="icon iconfont icon-yonghu3"></i> -->
							<input type="text" placeholder="请输入银行名称" v-model="bank_name" @change="validateBtn"
								placeholder-class='placeholder' />
						</view>
					</view>
					<view class="item">
						<view class="acea-row row-middle">
							<!-- <i class="icon iconfont icon-qiye"></i> -->
							<input type="text" maxlength="30" placeholder="请输入对公用户账户名" v-model="company" placeholder-class='placeholder' />
						</view>
					</view>
					<view class="item">
						<view class="acea-row row-middle">
							<!-- <i class="icon iconfont icon-yonghu3"></i> -->
							<input type="text" placeholder="请输入对公银行账号" v-model="bank_account" @change="validateBtn"
								placeholder-class='placeholder' />
						</view>
					</view>
					<view class="item">
						<view class="acea-row row-middle">
							<!-- <i class="icon iconfont icon-shoujihao"></i> -->
							<input type="text" placeholder="请输入法人手机号" v-model="merchantData.phone" @change="validateBtn"
								placeholder-class='placeholder' />
						</view>
					</view>
					<view class="item rel">
						<view class="acea-row row-middle">
							<!-- <i class="icon iconfont icon-yanzhengma"></i> -->
							<input type="text" placeholder="填写验证码" v-model="merchantData.yanzhengma" @change="validateBtn" class="codeIput"
								placeholder-class='placeholder' />
							<button class="code" :disabled="disabled" :class="disabled === true ? 'on' : ''" @click="code">
								{{ text }}
							</button>

						</view>
					</view>
					<view class="item" v-if="isShowCode">
						<view class="acea-row row-middle">
							<i class="icon iconfont icon-yanzhengma"></i>
							<input type="text" placeholder="请输入验证码" class="codeIput" v-model="codeVal" @change="validateBtn"
								placeholder-class='placeholder' />
							<view class="imageCode" @click="again"><img :src="codeUrl" /></view>
						</view>
					</view>
					<view class="item">
						<view class="uni-list">
							<view class="uni-list-cell">
								<view class="uni-list-cell-db">
									<input placeholder="请填写简介" type="text" readonly disabled>
									<textarea auto-height style="padding: 24rpx;font-size: 26rpx;" v-model="describe"></textarea>
								</view>
							</view>
						</view>
					</view>
					<view class="item no-border">
						<view class='acea-row row-middle'>
							<text class="item-title">请上传营业执照、商品展示图片、销售好评反馈图片</text>
							<text class="item-desc">(图片最多可上传10张,图片格式支持JPG、PNG、JPEG)</text>
							<view class="fx">
								<view class='pictrue' v-for="(item,index) in pics" :key="index" :data-index="index"
									@click="getPhotoClickIdx">
									<image :src='item'></image>
									<text class='iconfont icon-guanbi1' @click.stop='DelPic(index)'></text>
								</view>
								<view class='pictrue acea-row row-center-wrapper row-column' @click='uploadpic' v-if="pics.length < 10">
									<text class='iconfont icon-icon25201'></text>
									<view>上传图片</view>
								</view>
							</view>
						</view>
					</view>

					<view class="item no-border">
						<text class="item-title">请上传门头及店内照片4-6张</text>
						<view style="margin-top: 10rpx;" class="fx a-center">
							<u-upload custom-btn :multiple="true" max-count="6" @on-remove="onRemove" :auto-upload="false"
								@on-choose-complete="onChange" :action="action" ref="upload" name="field" width="130" height="130">
								<view class='pictrue acea-row row-center-wrapper row-column' style="margin:0" slot="addBtn">
									<text class='iconfont icon-icon25201'></text>
									<view>上传图片</view>
								</view>
							</u-upload>
						</view>
					</view>
					<view style="padding: 40rpx 0 20rpx 42rpx">
						<protocol ref="protocol1">
							<view @click.stop="toPage(`/pages/news_details/index?id=157`)">《焕际优选商户服务协议》</view>
						</protocol>
					</view>
					<button class='submitBtn on' @click="formSubmit">提交申请</button>
					<view class="settleAgre2" @click="toPage(`/pages/store/applicationRecord/index`)">申请记录</view>
				</view>
			</view>
		</form>
		<view class='loadingicon acea-row row-center-wrapper' v-if="loading">
			<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>
		</view>
		<!-- #ifdef MP -->
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
		<!-- #endif -->
	</view>
	<view class="settledSuccessMain" v-else>
		<view class="settledSuccessful">
			<view class="title">恭喜，您的资料提交成功！</view>
			<view class="info">预计15个工作日内审核完毕，平台客服会及时与您联系！</view>
			<view class="goHome" hover-class="none" @click="goHome">
				返回首页
			</view>
		</view>
	</view>
</template>
<script>
	import { toLogin } from '@/libs/login.js';
	import { uploadFile } from "@/utils/util2.js"
	import { create, verify, merClassifly } from '@/api/store.js';
	import { getCaptcha, } from "@/api/user";
	import { mapGetters } from "vuex";
	import { getArticleDetails } from '@/api/api.js';
	import parser from "@/components/jyf-parser/jyf-parser";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import { HTTP_REQUEST_URL } from "@/config/app.js"
	const app = getApp();
	export default {
		components: {
			"jyf-parser": parser,
			// #ifdef MP
			authorize,
			// #endif
		},
		data() {
			return {
				action: `${HTTP_REQUEST_URL}/api/upload/image/field`,
				photos: "",
				cartId: '', //购物车id
				pinkId: 0, //拼团id
				couponId: 0, //优惠券id
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				text: "获取验证码",
				codeUrl: "",
				disabled: false,
				isAgree: false,
				showProtocol: false,
				isShowCode: false,
				loading: false,
				company: "",
				address: "",
				bank_account: "",
				bank_name: "",
				merchantData: {
					enterprise_name: "",
					user_name: "",
					phone: "",
					classification: ''
				},
				validate: false,
				successful: false,
				keyCode: "",
				codeVal: "",
				protocol: "<h2>233333</h2>",
				describe: "",
				timer: "",
				index: 0,
				mer_classification: "",
				array: [{
					category_name: '',
					merchant_category_id: ''
				}],
				pics: [],
				tagStyle: {
					img: 'width:100%;'
				},
				photos: "",
				photos_list: [],
			};
		},
		beforeDestroy() {
			clearTimeout(this.timer)
		},
		computed: mapGetters(['isLogin', 'viewColor']),
		onLoad(options) {
			if (this.isLogin) {
				this.getClassfication();
			} else {
				// #ifdef H5 || APP-PLUS
				toLogin();
				// #endif 
				// #ifdef MP
				this.isAuto = true;
				this.$set(this, 'isShowAuth', true)
				// #endif
			}
		},
		methods: {
			onChange(e) {
				this.photos_list = e.map(item => item.url)
			},
			onRemove(index) {
				this.photos_list.splice(index, 1)
			},
			bindPickerChange: function(e) {
				this.index = e.target.value
				let idx = e.target.value
				this.merchantData.classification = this.array[idx]['merchant_category_id']
				this.mer_classification = this.array[idx]['category_name']
			},
			// 获取商户分类
			getClassfication: function() {
				merClassifly()
					.then(res => {
						this.array = res.data
					})
					.catch(res => {
						this.$util.Tips({
							title: res
						});
					});
			},
			// 图片预览
			// 获得相册 idx
			getPhotoClickIdx(e) {
				let _this = this;
				let idx = e.currentTarget.dataset.index;
				_this.imgPreview(_this.pics, idx);
			},
			// 图片预览
			imgPreview: function(list, idx) {
				// list：图片 url 数组
				if (list && list.length > 0) {
					uni.previewImage({
						current: list[idx], //  传 Number H5端出现不兼容 
						urls: list
					});
				}
			},
			// 授权回调
			onLoadFun: function() {
				this.isShowAuth = false;
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			toggleTab(str) {
				this.$refs[str].show();
			},
			// 首页
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			again() {
				this.getcaptcha()
			},
			/**
			 * 上传文件
			 * 
			 */
			uploadpic: function() {
				let that = this;
				that.$util.uploadImageOne('upload/image', function(res) {
					that.pics.push(res.data.path);
					that.$set(that, 'pics', that.pics);
				});
			},
			/**
			 * 删除图片
			 * 
			 */
			DelPic: function(index) {
				let that = this,
					pic = this.pics[index];
				that.pics.splice(index, 1);
				that.$set(that, 'pics', that.pics);
			},
			getCode() {
				let that = this
				getCodeApi()
					.then(res => {
						that.keyCode = res.data.key;
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						});
					});
			},
			async code() {
				let that = this;
				if (!that.merchantData.phone) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.merchantData.phone)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				await verify({
						phone: that.merchantData.phone,
						key: that.codeKey,
						code: that.codeVal,
						type: 'intention'
					})
					.then(res => {
						this.$msg.succ("发送成功");
						that.sendCode();
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						});
						if (res.status == 402) {
							that.getcaptcha();
						}
					});
			},
			getcaptcha() {
				let that = this
				getCaptcha().then(data => {
					that.codeUrl = data.data.captcha; //图片路径
					that.codeVal = data.data.code; //图片验证码
					that.codeKey = data.data.key //图片验证码key
				})
				that.isShowCode = true;
			},
			sendCode() {
				if (this.disabled) return;
				this.disabled = true;
				let n = 60;
				this.text = "剩余 " + n + "s";
				const run = setInterval(() => {
					n = n - 1;
					if (n < 0) {
						clearInterval(run);
					}
					this.text = "剩余 " + n + "s";
					if (this.text < "剩余 " + 0 + "s") {
						this.disabled = false;
						this.text = "重新获取";
					}
				}, 1000);
			},
			onConfirm(val) {
				this.region = val.checkArr[0] + '-' + val.checkArr[1] + '-' + val.checkArr[2];
			},
			ChangeIsAgree: function(e) {
				this.isAgree = !this.isAgree;
				this.validateBtn();
			},

			async formSubmit(e) {
				if (!this.$refs.protocol1.checked) return this.$msg.fail("请勾选商户服务协议");
				if (!this.pics.length) {
					return this.$msg.fail("请上传营业执照！");
				}
				let that = this;
				if (that.validateForm() && that.validate) {
					let p = {
						url: this.action,
						filePath: this.photos_list,
						name: "field"
					}
					uni.showLoading({

					})
					try {
						let res = await uploadFile(p);
						this.photos = res.map(item => item.data.path);
						let params = {
							phone: that.merchantData.phone,
							mer_name: that.merchantData.enterprise_name,
							name: that.merchantData.user_name,
							code: that.merchantData.yanzhengma,
							address: this.address,
							bank_name: this.bank_name,
							bank_account: this.bank_account,
							photos: this.photos,
							company: this.company,
							images: that.pics, // 营业执照
							describe: that.describe
						}
						let { status } = await create(params);
						this.$msg.succ("提交成功", () => {
							this.timer = setTimeout(() => {
								that.successful = true;
								uni.pageScrollTo({
									scrollTop: 0,
									duration: 0
								})
							}, 1000)
						});
					} catch (e) {
						return this.$msg.fail(e || e.message);
					} finally {
						uni.hideLoading()
					}
				}
			},
			async getProtocol() {
				try {
					let { data } = await getArticleDetails(167);
					this.protocol = data.content.content;
				} catch (e) {
					console.log(e);
				}
			},
			validateBtn: function() {
				let that = this,
					value = that.merchantData;
				if (value.enterprise_name && value.user_name && value.phone && /^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.phone) && value
					.yanzhengma) {
					if (!that.isShowCode) {
						that.validate = true;
					} else {
						if (that.codeVal) {
							that.validate = true;
						} else {
							that.validate = false;
						}
					}

				}
			},
			validateForm: function() {
				let that = this,
					value = that.merchantData;

				if (!value.enterprise_name) return that.$util.Tips({
					title: '请请输入商户名称'
				});
				if (!this.company) return that.$util.Tips({
					title: '请请输入对公银行账户'
				});
				if (!this.address) return that.$util.Tips({
					title: '请请输入经营地址'
				});
				if (!this.bank_name) return that.$util.Tips({
					title: '请请输入银行名称'
				});
				if (!this.bank_account) return that.$util.Tips({
					title: '请请输入对公账户'
				});
				if (!value.user_name) return that.$util.Tips({
					title: '请输入公司法人姓名'
				});
				if (!value.phone) return that.$util.Tips({
					title: '请输入手机号'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.phone)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if (!value.yanzhengma) return that.$util.Tips({
					title: '请填写验证码'
				});

				// if (!that.isAgree) return that.$util.Tips({
				// 	title: '请勾选并同意入驻协议'
				// });
				that.validate = true;
				return true;
			}

		}
	}
</script>

<style>
	page {
		height: 100%;
		background: #ff4590;
	}
</style>

<style scoped lang="scss">
	.uni-input-placeholder {
		color: #B2B2B2;
	}

	.uni-list-cell {
		position: relative;

		.iconfont {
			font-size: 14px;
			color: #7a7a7a;
			position: absolute;
			right: 15px;
			top: 7rpx;
		}
	}

	.merchantsSettled .merchantBg {
		width: 750rpx;
		width: 100%;
	}

	.merchantsSettled .list {
		background-color: #fff;
		border-radius: 12px;
		padding: 22px 0;
		margin: 0 15px;
		position: relative;
		top: -360rpx;
		width: calc(100% - 30px);
	}

	.merchantsSettled .list .item {
		padding: 50rpx 30rpx 20rpx 8rpx;
		border-bottom: 1rpx solid #eee;
		position: relative;
		margin: 0 25px;

		&.no-border {
			border-bottom: none;
			padding-left: 0;
			padding-right: 0;
		}

		.item-title {
			color: #666666;
			font-size: 28rpx;
			display: block;
		}

		.item-desc {
			color: #B2B2B2;
			font-size: 22rpx;
			display: block;
			margin-top: 9rpx;
			line-height: 36rpx;
		}
	}

	.acea-row,
	.upload {
		display: -webkit-box;
		display: -moz-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-lines: multiple;
		-moz-box-lines: multiple;
		-o-box-lines: multiple;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	.upload {
		margin-top: 20rpx;
	}

	.acea-row.row-middle {
		-webkit-box-align: center;
		-moz-box-align: center;
		-o-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
		padding-left: 2px;
	}

	.acea-row.row-column {
		-webkit-box-orient: vertical;
		-moz-box-orient: vertical;
		-o-box-orient: vertical;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
	}

	.acea-row.row-center-wrapper {
		-webkit-box-align: center;
		-moz-box-align: center;
		-o-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
		-webkit-box-pack: center;
		-moz-box-pack: center;
		-o-box-pack: center;
		-ms-flex-pack: center;
		-webkit-justify-content: center;
		justify-content: center;
	}

	.merchantsSettled .list .item .pictrue {
		width: 130rpx;
		height: 130rpx;
		margin: 24rpx 22rpx 0 0;
		position: relative;
		font-size: 11px;
		color: #bbb;

		&:nth-child(4n) {
			margin-right: 0;
		}

		&:nth-last-child(1) {
			border: 0.5px solid #ddd;
			box-sizing: border-box;
		}


		uni-image,
		image {
			width: 100%;
			height: 100%;
			border-radius: 1px;

			img {
				-webkit-touch-callout: none;
				-webkit-user-select: none;
				-moz-user-select: none;
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				opacity: 0;
				width: 100%;
				height: 100%;
			}
		}

		.icon-guanbi1 {
			font-size: 33rpx;
			position: absolute;
			top: -10px;
			right: -10px;
		}
	}


	.merchantsSettled .list .item .imageCode {
		position: absolute;
		top: 7px;
		right: 0;
	}

	.merchantsSettled .list .item .icon {
		font-size: 40rpx;
		color: #b4b1b4;
	}

	.merchantsSettled .list .item input {
		width: 400rpx;
		font-size: 30rpx;
		margin-left: 10px;
	}

	.merchantsSettled .list .item .placeholder {
		color: #b2b2b2;
	}

	.merchantsSettled .default {
		padding: 0 30rpx;
		height: 90rpx;
		background-color: #fff;
		margin-top: 23rpx;
	}

	.merchantsSettled .default checkbox {
		margin-right: 15rpx;
	}

	.merchantsSettled .acea-row uni-image {
		width: 20px;
		height: 20px;
		display: block;
	}

	.merchantsSettled .list .item .codeIput {
		width: 125px;
	}

	.uni-input-input {
		display: block;
		height: 100%;
		background: none;
		color: inherit;
		opacity: 1;
		-webkit-text-fill-color: currentcolor;
		font: inherit;
		line-height: inherit;
		letter-spacing: inherit;
		text-align: inherit;
		text-indent: inherit;
		text-transform: inherit;
		text-shadow: inherit;
	}

	.merchantsSettled .list .item .code {
		position: absolute;
		width: 93px;
		line-height: 27px;
		border: 1px solid var(--view-priceColor);
		border-radius: 15px;
		color: var(--view-priceColor);
		text-align: center;
		bottom: 8px;
		right: 0;
		font-size: 12px;
	}

	.merchantsSettled .list .item .code.on {
		background-color: #bbb;
		color: #fff;
		border-color: #bbb;
	}

	.merchantsSettled .submitBtn {
		width: 588rpx;
		margin: 0 auto;
		height: 86rpx;
		border-radius: 25px;
		text-align: center;
		line-height: 86rpx;
		font-size: 15px;
		color: #fff;
		background: #E3E3E3;
		margin-top: 25px;
	}

	.merchantsSettled .submitBtn.on {
		background: var(--view-priceColor);
	}

	uni-checkbox-group,
	.settleAgree {
		display: inline-block;
		font-size: 24rpx;
	}

	uni-checkbox-group {
		color: #b2b2b2;
	}

	.settleAgree {
		color: var(--view-priceColor);
		position: relative;
		top: 2px;
		left: 8px;
	}

	.merchantsSettled uni-checkbox .uni-checkbox-wrapper {
		width: 30rpx;
		height: 30rpx;
		border: 2rpx solid #C3C3C3;
		border-radius: 15px;
	}

	.settlementAgreement {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 10;
	}

	.settlementAgreement .setAgCount {
		background: #fff;
		width: 656rpx;
		height: 458px;
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 12rpx;
		-webkit-border-radius: 12rpx;
		padding: 52rpx;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		overflow: hidden;

		.content {
			height: 900rpx;
			overflow-y: scroll;

			/deep/ p {
				font-size: 13px;
				line-height: 22px;
			}

			/deep/ img {
				max-width: 100%;
			}
		}
	}

	.settlementAgreement .setAgCount .icon {
		font-size: 42rpx;
		color: #b4b1b4;
		position: absolute;
		top: 15rpx;
		right: 15rpx;

	}

	.settlementAgreement .setAgCount .title {
		color: #333;
		font-size: 32rpx;
		text-align: center;
		font-weight: bold;
	}

	.settlementAgreement .setAgCount .content {
		margin-top: 32rpx;
		color: #333;
		font-size: 26rpx;
		line-height: 22px;
		text-align: justify;
		text-justify: distribute-all-lines;
		height: 756rpx;
		overflow-y: scroll;
	}

	.settledSuccessMain {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #fff;
	}

	.settledSuccessful {
		flex: 1;
		width: 100%;
		padding: 0 56px;
		height: auto;
		background: #fff;
		text-align: center;
	}

	.settledSuccessful .image {
		width: 189px;
		height: 157px;
		margin-top: 66px;
	}

	.settledSuccessful .title {
		color: #333333;
		font-size: 16px;
		font-weight: bold;
		margin-top: 35px;
	}

	.settledSuccessful .info {
		color: #A0A0A0;
		font-size: 13px;
		margin-top: 12px;
	}

	.settledSuccessful .goHome {
		margin: 60px auto 0;
		width: 248px;
		height: 43px;
		line-height: 43px;
		color: #282828;
		font-size: 15px;
		border: 1px solid #B4B4B4;
		border-radius: 60px;
	}

	/deep/ uni-checkbox .uni-checkbox-input {
		width: 15px;
		height: 15px;
		position: relative;
	}

	/deep/ uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		font-size: 14px;

	}

	.loadingicon {
		height: 100vh;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
	}

	// #ifdef MP
	checkbox-group {
		display: inline-block;
	}

	// #endif

	.item uni-input {
		margin-left: 0 !important;
	}

	.settleAgre2 {
		color: var(--view-priceColor);
		text-align: center;
		margin-top: 40rpx;
		font-size: 26rpx;
	}
</style>
