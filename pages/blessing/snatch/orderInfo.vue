<template>
	<view>
		<view class="allAddress" @click="onAddress">
			<view class='address acea-row row-between-wrapper'>
				<view class='addressCon' v-if="addressInfo.real_name">
					<view class="fx a-end" style="font-size: 32rpx; font-weight: 600;">
						<view>{{userInfo.real_name}}</view>
						<view style="margin-left: 40rpx;">{{addressInfo.phone}}</view>
					</view>
					<view style="margin-top: 20rpx;">
						<text class='default font-color' v-if="addressInfo.is_default">[默认]</text>
						<text style="color: #AAAAAA;margin-left: 8rpx;">
							{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{addressInfo.detail}}
						</text>
					</view>
				</view>
				<view class='addressCon' v-else>
					<view class='setaddress'>设置收货地址</view>
				</view>
				<view class='iconfont icon-jiantou'></view>
			</view>
			<view class='line'>
				<image src='/static/images/line.jpg'></image>
			</view>
		</view>

		<view class="storeinfo-wrapper">
			<view class="store-item">
				<view class="store-title">
					<view class="txt">{{this.type==1?"夺宝":"抽奖"}}订单</view>
				</view>
				<view class="product-item">
					<view class="img-box">
						<image :src="orderData.period.product_img"></image>
					</view>
					<view class="content">
						<view class="name line1">{{orderData.period.product_name}}</view>
						<view style="margin-top: 10rpx;color:#0f734f;">
							￥0 <text style="color: #AAAAAA;text-decoration: line-through;">￥{{orderData.price}}</text>
						</view>
					</view>
				</view>
				<view class="fx j-between a-center" style="padding: 0 30rpx;margin-top: 35rpx;">
					<view>快递费用</view>
					<view class="text">免运费</view>
				</view>
				<view class="fx j-between a-center" style="padding:0 30rpx;margin-top: 32rpx;">
					<view>获取方式</view>
					<view class="text">{{this.type==1?"积分夺宝":"抽奖"}}</view>
				</view>
				<view class="fx a-center" style="padding:0 30rpx;margin-top: 32rpx;">
					<view>买家留言：</view>
					<input type="text" v-model="mark" style="color: #333;font-size: 30rpx;" placeholder="点击输入留言">
				</view>
				<view class="fx a-center fx-end" style="padding:32rpx 30rpx;">
					<view>共1件 小计 <text style="color:#0f734f;">￥0.00</text> </view>
				</view>
			</view>
		</view>
		<view class='footer acea-row row-between-wrapper'>
			<view>合计:0</view>
			<view class='settlement' v-if="addressId" style='z-index:100' @click="subOrder">提交订单</view>
			<view class='settlement disabled' v-else style='z-index:100'>请选择地址</view>
		</view>
		<addressWindow ref="addressWindow" :address='address' :pagesUrl="pagesUrl" @OnChangeAddress="OnChangeAddress" @changeClose="changeClose"></addressWindow>
	</view>
</template>


<script>
	import addressWindow from '@/components/addressWindow';
	import { snatchOrderApi, lotteryOrderApi, commitSnatchApi, commitlotteryApi } from '@/api/snatch.js'
	import {
		getAddressDefault,
		getAddressDetail,
		getAddressList,
		getUserInfo
	} from '@/api/user.js';
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				pagesUrl: "",
				textareaStatus: "",
				addressInfo: {}, //地址信息
				address: {
					address: false
				}, //地址组件
				addressId: "",
				record_id: "",
				type: "",
				orderData: {
					period: {}
				},
				mark: "" // 买家留言
			}
		},
		components: {
			addressWindow
		},
		onLoad(options) {
			this.record_id = options.record_id;
			this.type = options.type;
			this.getData();
			this.getaddressInfo();
			this.$nextTick(() => {
				this.$refs.addressWindow.getAddressList();
			})
		},
		computed: {
			...mapGetters(["userInfo"]),
		},
		methods: {
			async getData() {
				if (this.type == 1) {
					var { data } = await snatchOrderApi(this.record_id);
				} else {
					var { data } = await lotteryOrderApi(this.record_id);
				}
				this.orderData = data;
			},
			onAddress: function() {
				this.textareaStatus = false;
				this.address.address = true;
				this.pagesUrl = '/pages/users/user_address_list/index';
			},
			changeClose: function() {
				this.$set(this.address, 'address', false);
			},
			OnChangeAddress: function(e) {
				this.textareaStatus = true;
				this.addressId = e;
				this.address.address = false;
				this.getaddressInfo();
				// this.computedPrice();
			},
			getaddressInfo() {
				if (this.addressId) {
					getAddressDetail(this.addressId).then(res => {
						res.data.is_default = parseInt(res.data.is_default);
						this.addressInfo = res.data || {};
						this.addressId = res.data.address_id || 0;
						this.address.addressId = res.data.address_id || 0;
					})
				} else {
					getAddressList().then(res => {
						this.addressInfo = res.data.list.length > 0 ? res.data.list[0] : {};
						this.addressId = res.data.list.length > 0 ? res.data.list[0].address_id : 0;
						this.address.addressId = res.data.list.length > 0 ? res.data.list[0].address_id : 0;
					})
				}
			},

			async subOrder() {
				let params = {
					address_id: this.addressId,
					mark: this.mark
				}
				if (this.type == 1) {
					var res = await commitSnatchApi(this.record_id, params);
				} else {
					var res = await commitlotteryApi(this.record_id, params);
				}
				if (res.status == 200) {
					this.$msg.succ(res.message, () => {
						if (this.type == 1) {
							uni.redirectTo({
								url: "/pages/blessing/order/snatchOrder"
							})
						} else if (this.type == 2) {
							uni.redirectTo({
								url: "/pages/blessing/order/lotteryOrder"
							})
						}
					});
				}
			}
		},
	}
</script>

<style scoped lang="scss">
	@import url("/static/css/common.css");

	.line {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 3rpx;
	}

	.storeinfo-wrapper {

		.store-item {
			margin-top: 12rpx;
			background-color: #fff;

			.store-title {
				display: flex;
				align-items: center;
				padding: 28rpx 30rpx;

				.icon-shangjiadingdan {
					font-size: 32rpx;
				}

				.icon-xiangyou {
					font-size: 26rpx;
					color: #999;
				}

				.txt {
					margin: 0 8rpx;
				}
			}

			.product-item {
				display: flex;
				padding: 25rpx 30rpx;
				border-top: 1px solid #F0F0F0;

				.img-box {
					width: 130rpx;
					height: 130rpx;

					image {
						width: 130rpx;
						height: 130rpx;
						border-radius: 16rpx;
					}
				}

				.content {
					position: relative;
					width: 550rpx;
					margin-left: 30rpx;
					font-size: 28rpx;
					color: #282828;

					.label {
						margin-top: 10rpx;
						color: #868686;
						font-size: 20rpx;
					}

					.price {
						margin-top: 20rpx;
						color: $theme-color;

						text {
							margin-left: 10rpx;
							color: #999;
						}
					}

					.err-txt {
						display: flex;
						align-items: center;
						margin-top: 18rpx;
						color: $theme-color;

						.iconfont {
							margin-right: 10rpx;
						}
					}

					.step {
						position: absolute;
						right: 0;
						top: 100rpx;
						display: flex;
						align-items: center;

						.min {
							width: 50rpx;
							height: 40rpx;
							background-image: url('~@/static/images/min.png');
							background-size: 17rpx 17rpx;
							background-position: center;
							background-repeat: no-repeat;
						}

						.num-box {
							width: 68rpx;
							height: 40rpx;
							line-height: 40rpx;
							text-align: center;
							background: #F2F2F2;
							font-size: 23rpx;
						}

						.add {
							width: 50rpx;
							height: 40rpx;
							background-image: url('~@/static/images/add.png');
							background-size: 17rpx 17rpx;
							background-position: center;
							background-repeat: no-repeat;
						}
					}
				}
			}
		}
	}

	.line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.allAddress {
		width: 100%;
		background-color: #FFFFFF;
		padding: 0 24rpx;
	}

	.allAddress .nav {
		width: 710rpx;
		margin: 0 auto;
	}

	.allAddress .nav .item {
		width: 355rpx;
	}

	.allAddress .nav .item.on {
		position: relative;
		width: 250rpx;
	}

	.allAddress .nav .item.on::before {
		position: absolute;
		bottom: 0;
		content: "快递配送";
		font-size: 28rpx;
		display: block;
		height: 0;
		width: 336rpx;
		border-width: 0 20rpx 80rpx 0;
		border-style: none solid solid;
		border-color: transparent transparent #fff;
		z-index: 2;
		border-radius: 7rpx 30rpx 0 0;
		text-align: center;
		line-height: 80rpx;
	}

	.allAddress .nav .item:nth-of-type(2).on::before {
		content: "线下消费";
		border-width: 0 0 80rpx 20rpx;
		border-radius: 30rpx 7rpx 0 0;
	}

	.allAddress .nav .item.on2 {
		position: relative;
	}

	.allAddress .nav .item.on2::before {
		position: absolute;
		bottom: 0;
		content: "线下消费";
		font-size: 28rpx;
		display: block;
		height: 0;
		width: 400rpx;
		border-width: 0 0 60rpx 60rpx;
		border-style: none solid solid;
		border-color: transparent transparent #f7c1bd;
		border-radius: 40rpx 6rpx 0 0;
		text-align: center;
		line-height: 60rpx;
	}

	.allAddress .nav .item:nth-of-type(1).on2::before {
		content: "快递配送";
		border-width: 0 60rpx 60rpx 0;
		border-radius: 6rpx 40rpx 0 0;
	}

	.allAddress .address {
		height: 150rpx;
		margin: 0 auto;
	}

	.allAddress .line {
		margin: 0 auto;
	}

	.footer {
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.footer .settlement {
		font-size: 30rpx;
		color: #fff;
		width: 240rpx;
		height: 70rpx;
		background-color: #0f734f;
		border-radius: 50rpx;
		text-align: center;
		line-height: 70rpx;
	}

	.footer .settlement.disabled {
		background-color: #cccccc;
	}

	.footer .transparent {
		opacity: 0
	}

	.text {
		color: #777777;
	}
</style>
