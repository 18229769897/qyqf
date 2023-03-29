<template>
	<view :style="viewColor">
		<form @submit="submitSub" report-submit='true'>
			<view class="payment-top acea-row row-column row-center-wrapper">
				<span class="name">我的余额</span>
				<view class="pic">
					￥<span class="pic-font">{{ userinfo.now_money || 0 }}</span>
				</view>
			</view>

			<view class="payment">
				<view class="nav acea-row row-around row-middle">
					<view class="item" :class="active==index?'on':''" v-for="(item,index) in navRecharge" :key="index" @click="navRecharges(index)">{{item}}</view>
				</view>

				<view class='tip picList' v-if='!active'>
					<template v-if="!noPayType">
						<view class="pic-box pic-box-color acea-row row-center-wrapper row-column" :class="activePic == index ? 'pic-box-color-active' : ''"
							v-for="(item, index) in picList" :key="index" @click="picCharge(index, item)">
							<view class="pic-number-pic">
								{{ item.data.price }}<span class="pic-number"> 元</span>
							</view>
						</view>
						<view class="pic-box pic-box-color acea-row row-center-wrapper" :class="rechar_id == 0 ? 'pic-box-color-active' : ''" @click="picCharge(picList.length)">
							<input type="number" placeholder="其他" v-model="money" class="pic-box-money pic-number-pic" :class="rechar_id == 0 ? 'pic-box-color-active' : ''" />
						</view>
						<view class="tips-box">
							<view class="tips mt-30">注意事项：</view>
							<view class="tips-samll" v-for="item in rechargeAttention" :key="item">
								{{ item }}
							</view>
						</view>

						<view class="mt-3 w100">
							<view>选择支付方式</view>
							<payType2 :payType.sync="payType" :list="payList" />
						</view>
						<button class='but' formType="submit">立即充值</button>
					</template>

					<template v-if="noPayType">
						<view class="box fz_30">
							<view class="">尊敬的会员：</view>
							<text style="padding-left: 2em;">
								您好！感谢您长期以来对于焕际优选的大力支持，基于焕际优选2.0正式上线，近期公司在对接第三方支付公司对于进出账优化管理，保障用户充值、提现更加快捷。为了不影响广大会员的消费体验，因此在对接支付通道期间暂时关闭微信充值功能，会员可以通过微信支付宝扫描二维码并且备注个人账户信息方式进行充值，转账完成后半小时内将会充值到账。
							</text>
							<view class="py-1 fx a-center">
								<view>人工客服：4001008109</view>
								<copy text="4001008109"></copy>
							</view>
							<view>
								操作流程：点击下载二维码图片至微信或支付宝扫一扫进行支付
							</view>
							<view class="fx j-center mt-1">
								<view class="image-box" @click="download">
									<image src="@/static/images/skm.jpg" style="width: 100%;" mode="widthFix"></image>
								</view>
							</view>
						</view>
					</template>
				</view>
				<view class="tip" v-else>
					<view class='input'><text>￥</text><input placeholder="0.00" type='number' placeholder-class='placeholder' :value="number" name="number"></input></view>
					<view class="tips-title">
						<view style="font-weight: bold; font-size: 26rpx;">提示：</view>
						<view style="margin-top: 10rpx;">当前补贴为 <text class='t-color'>￥{{userinfo.brokerage_price || 0}}</text></view>
					</view>
					<view class="tips-box">
						<view class="tips mt-30">注意事项：</view>
						<view class="tips-samll" v-for="item in rechargeAttention" :key="item">
							{{ item }}
						</view>
					</view>
					<button class='but' formType="submit">立即转入</button>
				</view>

			</view>
		</form>
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
	</view>
</template>

<script>
	import { downLoadImage, objStringify } from "@/utils/util2.js"
	import { getconfig } from "@/api/public.js";
	import {
		spreadInfo,
		rechargeRoutine,
		rechargeWechat,
		getRechargeApi,
		rechargeBrokerage
	} from '@/api/user.js';
	import {
		mapGetters
	} from "vuex";
	import authorize from '@/components/Authorize';
	export default {
		components: {
			authorize
		},
		data() {
			let that = this;
			return {

				now_money: 0,
				payType: "sidepay",
				navRecharge: ['账户充值', '补贴转入'],
				active: 0,
				number: '',
				userinfo: {},
				placeholder: "0.00",
				from: '',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				picList: [],
				activePic: 0,
				money: "",
				numberPic: '',
				rechar_id: 0,
				rechargeAttention: [],
				payList: [],
				noPayType: true
			};
		},
		computed: mapGetters(['isLogin', 'viewColor']),

		onShow() {
			this.getUserInfo();
		},

		async onLoad(options) {

			// #ifdef H5
			this.from = this.$wechat.isWeixin() ? "weixin" : "h5"
			// #endif
			if (this.isLogin) {
				this.getRecharge();
			} else {
				this.isAuto = true;
				this.isShowAuth = true
			}
			this.setPayType();
		},
		methods: {
			async setPayType() {
				let { data } = await getconfig();
				if (Number(data.alipay_open)) {
					this.payList = [...this.payList, "alipay"];
				}
				this.payList = ["sidepay"]
				this.noPayType = this.payList.length == 0;
			},
			
			

			/**
			 * 选择金额
			 */
			picCharge(idx, item) {
				this.activePic = idx;
				if (item === undefined) {
					this.rechar_id = 0;
					this.numberPic = "";
				} else {
					this.money = "";
					this.rechar_id = item.id;
					this.numberPic = item.data.price;
				}
			},

			/**
			 * 充值额度选择
			 */
			getRecharge() {
				getRechargeApi()
					.then(res => {
						this.picList = res.data.recharge_quota;
						if (this.picList[0]) {
							this.rechar_id = this.picList[0].id;
							this.numberPic = this.picList[0].data.price;
						}
						this.rechargeAttention = res.data.recharge_attention || [];
					})
					.catch(res => {
						this.$dialog.toast({
							mes: res
						});
					});
			},

			download() {
				downLoadImage("/static/images/skm.jpg");
			},
			onLoadFun: function() {
				this.isShowAuth = false;
				this.getUserInfo();
				this.getRecharge();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			navRecharges: function(index) {
				this.active = index;
			},
			/**
			 * 获取用户信息
			 */
			getUserInfo: function() {
				let that = this;
				spreadInfo().then(res => {
					that.$set(that, 'userinfo', res.data);
				})
			},
			/*
			 * 用户充值
			 */
			async submitSub(e) {
				let that = this
				let value = e.detail.value.number;
				// 转入余额
				if (that.active) {
					if (parseFloat(value) < 0 || parseFloat(value) == NaN || value == undefined || value == "") {
						return that.$util.Tips({
							title: '请输入金额'
						});
					}
					uni.showModal({
						title: '转入余额',
						content: '转入余额后无法再次转出，确认是否转入余额',
						success(res) {
							if (res.confirm) {
								rechargeBrokerage({
									brokerage: parseFloat(value),
								}).then(res => {
									return that.$util.Tips({
										title: '转入成功',
										icon: 'success'
									}, {
										tab: 5,
										url: '/pages/users/user_money/index'
									});
								}).catch(err => {
									return that.$util.Tips({
										title: err
									})
								});
							} else if (res.cancel) {
								return that.$util.Tips({
									title: '已取消'
								});
							}
						},
					})

				} else {
					if (this.rechar_id == 0) {
						if (parseFloat(that.money) === 0) {
							return that.$util.Tips({
								title: '充值金额金额不能为0！'
							});
						}
						if (!that.money) {
							return that.$util.Tips({
								title: '请填写充值金额！'
							});
						}
						if (!Number(that.money)) {
							return that.$util.Tips({
								title: '请填写正确的金额！'
							});
						}
					}

					// uni.showLoading({
					// 	title: '正在支付',
					// 	mask: true
					// })
					// #ifdef MP
					// let money = parseFloat(this.money);
					rechargeWechat({
						price: that.rechar_id == 0 ? that.money : that.numberPic,
						type: 'routine',
						recharge_id: this.rechar_id
					}).then(res => {
						uni.hideLoading();
						let jsConfig = res.data.config;
						uni.requestPayment({
							timeStamp: jsConfig.timestamp,
							nonceStr: jsConfig.nonceStr,
							package: jsConfig.package,
							signType: jsConfig.signType,
							paySign: jsConfig.paySign,
							success: function(res) {
								that.$set(that, 'userinfo.now_money', that.$util.$h.Add(value, that.userinfo
									.now_money));
								return that.$util.Tips({
									title: '支付成功',
									icon: 'success'
								}, {
									tab: 5,
									url: '/pages/users/user_money/index'
								});
							},
							fail: function() {
								return that.$util.Tips({
									title: '支付失败'
								});
							},
							complete: function(res) {
								if (res.errMsg == 'requestPayment:cancel') return that.$util.Tips({
									title: '取消支付'
								});
							}
						})
					}).catch(err => {
						uni.hideLoading();
						return that.$util.Tips({
							title: err
						})
					});
					// #endif

					// #ifdef MP
					rechargeWechat({
						price: that.rechar_id == 0 ? that.money : that.numberPic,
						type: that.from,
						recharge_id: that.rechar_id
					}).then(res => {
						if (res.data.type == 'h5') {
							let url = res.data.config.mweb_url;
							var customUserAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2';
							//修改后的userAgent            
							Object.defineProperty(navigator, 'userAgent', {
								value: customUserAgent,
								writable: false
							});
							location.href = url;
						} else {
							const jsConfig = res.data.config;
							jsConfig.timeStamp = jsConfig.timestamp;
							that.$wechat.pay(jsConfig).then(res => {
								that.$set(that, 'userinfo.now_money', that.$util.$h.Add(value, that.userinfo.now_money));
								return that.$util.Tips({
									title: '支付成功',
									icon: 'success'
								}, {
									tab: 5,
									url: '/pages/users/user_money/index'
								});
							}).catch(res => {
								if (res.errMsg == 'chooseWXPay:cancel') return that.$util.Tips({
									title: '取消支付'
								}, {
									tab: 5,
									url: goPages + '?status=0'
								});
							})
						}
					}).catch(error => {
						return that.$util.Tips({
							title: error
						});
					}).finally(() => {
						uni.hideLoading()
					})
					// #endif

					// #ifdef APP-PLUS || H5
					// rechargeWechat({
					// 	price: that.rechar_id == 0 ? Number(that.money) : Number(that.numberPic),
					// 	recharge_id: that.rechar_id,
					// 	type: this.payType
					// }).then(async (res) => {
					// 	console.log(res.data.config);
					// 	try {
					// 		await this.appPay(res.data.config, this.payType);
					// 		that.getUserInfo();
					// 		that.$store.dispatch("USERINFO")
					// 		that.$msg.succ('支付成功');
					// 	} catch (e) {
					// 		console.log(e);
					// 	}
					// }).catch(err => {
					// 	console.log(err);
					// }).finally(() => {
					// 	uni.hideLoading();
					// })

					let { data } = await rechargeWechat({
						price: that.rechar_id == 0 ? Number(that.money) : Number(that.numberPic),
						recharge_id: that.rechar_id,
						type: this.payType
					})
					plus.runtime.openURL(data.config.url);
					// #endif
				}
			}
		},

	}
</script>


<style>
	page {
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>
	.payment {
		position: relative;
		top: -60rpx;
		width: 100%;
		background-color: #fff;
		border-radius: 10rpx;
		padding-top: 25rpx;
		border-top-right-radius: 39rpx;
		border-top-left-radius: 39rpx;
	}

	.payment .nav {
		height: 75rpx;
		line-height: 75rpx;
		padding: 0 100rpx;
	}

	.payment .nav .item {
		font-size: 30rpx;
		color: #333;
	}

	.payment .nav .item.on {
		font-weight: bold;
		border-bottom: 4rpx solid var(--view-theme);
	}

	.t-color {
		color: var(--view-theme);
	}

	.payment .input {
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px dashed #dddddd;
		margin: 60rpx auto 0 auto;
		padding-bottom: 20rpx;
		font-size: 56rpx;
		color: #333333;
		flex-wrap: nowrap;

	}

	.payment .input text {
		padding-left: 106rpx;
	}

	.payment .input input {
		padding-right: 106rpx;
		width: 300rpx;
		height: 94rpx;
		text-align: center;
		font-size: 70rpx;
	}

	.payment .placeholder {
		color: #d0d0d0;
		height: 100%;
		line-height: 94rpx;
	}

	.payment .tip {
		font-size: 26rpx;
		color: #888888;
		padding: 0 30rpx;
		margin-top: 25rpx;
	}

	.payment .but {
		color: #fff;
		font-size: 30rpx;
		width: 700rpx;
		height: 86rpx;
		border-radius: 50rpx;
		margin: 100rpx auto 0 auto;
		line-height: 86rpx;
		background-color: var(--view-theme);
	}

	.payment-top {
		width: 100%;
		height: 350rpx;
		background-color: var(--view-theme);

		.name {
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.8);
			margin-top: -38rpx;
			margin-bottom: 30rpx;
		}

		.pic {
			font-size: 32rpx;
			color: #fff;
		}

		.pic-font {
			font-size: 78rpx;
			color: #fff;
		}
	}

	.picList {
		display: flex;
		flex-wrap: wrap;
		margin: 30rpx 0;

		.pic-box {
			width: 32%;
			height: auto;
			border-radius: 20rpx;
			margin-top: 21rpx;
			padding: 20rpx 0;
			margin-right: 12rpx;

			&:nth-child(3n) {
				margin-right: 0;
			}
		}

		.pic-box-color {
			background-color: #f4f4f4;
			color: #656565;
		}

		.pic-number {
			font-size: 22rpx;
		}

		.pic-number-pic {
			font-size: 38rpx;
			margin-right: 10rpx;
			text-align: center;
		}

		.pic-box-color-active {
			background-color: var(--view-theme);
			color: #fff;
		}
	}

	.tips-box {
		.tips {
			font-size: 28rpx;
			color: #333333;
			font-weight: 800;
			margin-bottom: 14rpx;
			margin-top: 20rpx;
		}

		.tips-samll {
			font-size: 24rpx;
			color: #333333;
			margin-bottom: 14rpx;
		}

		.tip-box {
			margin-top: 30rpx;
		}
	}

	.tips-title {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #333;
	}

	.h5-mian {
		font-size: 34rpx;
		line-height: 2.5;
		padding: 30rpx;
	}

	.box {
		color: #333333;
		line-height: 1.6;
	}

	.image-box {
		width: 400rpx;
		position: relative;
	}

	.image-box::after {
		content: "点击下载二维码";
		color: #f5f5f5;
		position: absolute;
		z-index: 10;
		left: 0;
		right: 0;
		bottom: 0;
		font-size: 27rpx;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
