<template>
	<view>
		<view class='cash-withdrawal'>
			<!-- <view class='nav acea-row'>
				<template v-for="(item,index) in navList">
					<view :key="index" class='item font-color' @click="swichNav(item)">
						<view class='line bg-color' :class='{on:pick_type==item.value}'></view>
						<view class='iconfont' :class='item.icon+" "+(pick_type==item.value ? "on":"")'></view>
						<view>{{item.name}}</view>
					</view>
				</template>
			</view> -->
			<view class='wrapper'>
				<template v-if="pick_type=='now_money'">
					<view class="list">
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>金额</view>
							<view class='input'><input placeholder-class='placeholder' v-model="extract_price"></input></view>
						</view>
					</view>
				</template>
				<template v-if="pick_type=='bank'">
					<view class="list">
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>银行</view>
							<view class='input' v-if="myBankList.length">
								<picker @change="bindPickerChange" :value="index" :range="myBankList" range-key="label">
									<text class='Bank'>{{myBankList[index]["label"]}}</text>
									<text class='iconfont icon-qiepian38'></text>
								</picker>
							</view>
						</view>
						<view class='item acea-row row-between-wrapper'>
							<view class='name'>金额</view>
							<view class='input'><input placeholder-class='placeholder' disabled :value="extract_price || 0"></input></view>
						</view>
					</view>
				</template>
				<view class='tip' style="line-height: 1.7;" v-if="pick_type=='bank'">
					<view>说明:</view>
					<view>捐赠区结算，10爱心积分 = ￥1.00，本次结算将消耗{{extract_price*10}}个爱心积分</view>
				</view>
				<button @click="subCash" :disabled="load" class='bnt bg-color' style="margin-top: 100rpx;"
					:class="{disabled:disable}">结算</button>
				<text style="margin-left: 35rpx;color: #e93323;font-size: 30rpx;"
					@click="toPage('/pages/users/user_spread_money/index?type=5')">结算记录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { crowdDetailApi, donatedCash, extractBank, getUserInfo, spreadInfo, getBankList } from '@/api/user.js';
	import { toLogin } from '@/libs/login.js';
	import { mapGetters } from "vuex";
	export default {
		data() {
			return {
				show: false,
				myBankList: [],
				// extract_type 3:现金钱包,0:"银行卡",1:"微信",2:"支付宝"
				navList: [],
				extract_price: 1000,
				index: 0,
				array: [], //结算银行
				minPrice: 10.00, //最低结算金额
				userInfo: [],
				isClone: false,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				loading: false,
				load: false,
				pics: [], //收款码
				extract_pic: '',
				disable: false,
				pick_type: "",
				extract_type: 3
			}
		},
		computed: {
			...mapGetters(['isLogin', "appConfig"]),
			...mapGetters({ "userData": "userInfo" })
		},
		onLoad(options) {
			this.declare_id = options.id;
			this.getDetail();
			this.pick_type = "bank";
			this.extract_type = 0;
			this.getUserInfo();
			this.getUserExtractBank();
			this.getBankList();
		},
		methods: {
			async getDetail() {
				let { data } = await crowdDetailApi(this.declare_id);
				this.data = data;
				this.extract_price = data.case_donated_score / this.appConfig.crowd_proportion;
			},
			confirm() {
				uni.navigateTo({
					url: "../../user/add_bankcard"
				})
			},

			/**
			 * 获取当前用户已绑定银行卡
			 */
			async getBankList() {
				try {
					let { data } = await getBankList();
					if (data.length) {
						this.myBankList = data.map(item => ({
							...item,
							label: `${item.bank_name}(****${item.bank_num})`
						}))
					} else {
						if (!(await this.$msg.alert("您未绑定银行卡，是否前往绑卡"))) return this.back();
						this.toPage("/pages/user/bank_card");
					}
				} catch (e) {
					//TODO handle the exception
				}
			},

			onLoadFun: function() {
				this.isShowAuth = false;
				this.getUserInfo();
			},

			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			getUserExtractBank: function() {
				extractBank().then(res => {
					let array = res.data;
					this.$set(this, 'array', array);
				});
			},

			// 获取个人用户信息
			getUserInfo() {
				spreadInfo().then(res => {
					this.userInfo = res.data;
					this.minPrice = res.data.user_extract_min;
				});
			},
			swichNav(item) {
				this.pick_type = item.value;
				this.extract_type = item.extract_type;
			},
			subCash() {
				let params = {
					extract_price: this.extract_price,
					extract_type: this.extract_type,
					declare_id: this.declare_id
				};
				let money = this.extract_price;
				if (money.length == 0) return this.$util.Tips({
					title: '请填写结算金额'
				});
				if (this.load) return;
				this.load = true;
				switch (this.pick_type) {
					case "bank": // 银行卡
						params.real_name = this.userData.real_name;
						params.bank_id = this.myBankList[this.index].id;
						if (params.bank_id.length == 0) return this.$util.Tips({
							title: '请选择银行卡'
						});
						break;
					case "weixin": // 微信
						params.extract_pic = params.extract_pic;
						if (this.wechat.length == 0) return this.$util.Tips({
							title: '请填写微信号'
						});
						if (params.extract_pic.length == 0) return this.$util.Tips({
							title: '请上传收款码'
						});
					case "alipay": // 支付宝
						params.extract_pic = this.extract_pic;
						params.alipay_code = this.alipay_code;
						let reg1 = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
						let reg2 = /^1(3|4|5|7|8|9|6)\d{9}$/;
						if (!reg1.test(params.alipay_code) && !reg2.test(params.alipay_code)) {
							return this.$util.Tips({
								title: '请填写正确的支付宝账号'
							});
						}
						if (params.alipay_code.length == 0) return this.$util.Tips({
							title: '请填写账号'
						});
						if (params.extract_pic.length == 0) return this.$util.Tips({
							title: '请上传收款码'
						});
					case "now_money": // 现金钱包
				}
				donatedCash(params).then(res => {
					this.getUserInfo();
					this.updateUser();
					setTimeout(() => {
						this.load = false;
					}, 500);
					this.$msg.succ("申请成功");
					this.extract_price = "";
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				}).finally(() => {
					this.load = false;
				})
			},
			bindPickerChange(e) {
				this.index = e.detail.value;
			},
			uploadpic() {
				this.$util.uploadImageOne('upload/image', function(res) {
					this.pics.push(res.data.path);
					this.$set(this, 'pics', this.pics);
					this.$set(this, 'extract_pic', this.pics[0])
				});
			},

			/**
			 * 删除图片
			 */
			DelPic: function(index) {
				let pic = this.pics[index];
				this.pics.splice(index, 1);
				this.$set(this, 'pics', this.pics);
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
	}

	.cash-withdrawal .nav {
		height: 130rpx;
		box-shadow: 0 10rpx 10rpx #f8f8f8;
	}

	.cash-withdrawal .nav .item {
		font-size: 26rpx;
		flex: 1;
		text-align: center;
	}

	.cash-withdrawal .nav .item~.item {
		border-left: 1px solid #f0f0f0;
	}

	.cash-withdrawal .nav .item .iconfont {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		border: 2rpx solid #0f734f;
		text-align: center;
		line-height: 37rpx;
		margin: 0 auto 6rpx auto;
		font-size: 22rpx;
		box-sizing: border-box;
	}

	.cash-withdrawal .nav .item .iconfont.on {
		background-color: #0f734f;
		color: #fff;
		border-color: #0f734f;
	}

	.cash-withdrawal .nav .item .line {
		width: 2rpx;
		height: 20rpx;
		margin: 0 auto;
		transition: height 0.3s;
	}

	.cash-withdrawal .nav .item .line.on {
		height: 39rpx;
	}

	.cash-withdrawal .wrapper .list {
		padding: 0 30rpx;
	}

	.cash-withdrawal .wrapper .list .item {
		border-bottom: 1rpx solid #eee;
		height: 107rpx;
		font-size: 30rpx;
		color: #333;

		&.uploadItem {
			border-bottom: none;
			height: auto;

			.name {
				height: 107rpx;
				;
			}
		}
	}

	.picture {
		width: 70px;
		height: 70px;
		margin: 0 0 17px 0;
		position: relative;
		font-size: 11px;
		color: #bbb;
		border: 0.5px solid #ddd;
		box-sizing: border-box;
		margin-top: 40rpx;

		uni-image,
		image {
			width: 100%;
			height: 100%;
			border-radius: 1px;
		}

		.icon-guanbi1 {
			font-size: 22px;
			position: absolute;
			top: -10px;
			right: -10px;
			color: #0f734f;
		}
	}

	.cash-withdrawal .wrapper .list .item .name {
		width: 130rpx;
	}

	.cash-withdrawal .wrapper .list .item .input {
		width: 505rpx;
	}

	.cash-withdrawal .wrapper .list .item .input .placeholder {
		color: #bbb;
	}

	.cash-withdrawal .wrapper .tip {
		font-size: 26rpx;
		color: #999;
		margin-top: 25rpx;
		margin: 30rpx;
	}

	.cash-withdrawal .wrapper .bnt {
		font-size: 32rpx;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		text-align: center;
		border-radius: 50rpx;
		line-height: 90rpx;
		margin: 64rpx auto;
	}

	.cash-withdrawal .wrapper .tip2 {
		font-size: 26rpx;
		color: #999;
		text-align: center;
		margin: 44rpx 0 20rpx 0;
	}

	.cash-withdrawal .wrapper .list .value {
		height: 135rpx;
		line-height: 135rpx;
		border-bottom: 1rpx solid #eee;
		width: 690rpx;
		margin: 0 auto;
	}

	.cash-withdrawal .wrapper .list .value input {
		font-size: 80rpx;
		color: #282828;
		height: 135rpx;
		text-align: center;
	}

	.cash-withdrawal .wrapper .list .value .placeholder2 {
		color: #bbb;
	}

	.price {
		color: $theme-color;
	}

	.Bank {
		display: block;
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
