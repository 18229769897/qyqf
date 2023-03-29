<template>
	<view style="padding-bottom: 120rpx;" :class="{accomplish:now_period.schedule==100}">
		<view class="head-wrapper" :style="'top:'+statusBarHeight">
			<view class="head-menu">
				<view class='iconfont icon-xiangzuo' @click="returns"></view>
				<view class="iconfont icon-shouye4" @click="goHome"></view>
			</view>
		</view>
		<view class="head">
			<view class="point">{{current}} <text style="padding: 0 1px;">/</text> {{sliderCount}}</view>
			<swiper class="swiper" autoplay circular @change="swiperChange">
				<template v-for="item in slider_img">
					<swiper-item>
						<image :src="item" style="width: 750rpx;height: 750rpx;"></image>
					</swiper-item>
				</template>
			</swiper>
		</view>
		<view class="main">
			<view style="color: #000000;font-size: 36rpx;padding: 24rpx 0;">{{now_period.product_name}}</view>
			<view class="issue">
				<view class="fx j-between" style="margin-top: 30rpx;">
					<view>期号：{{now_period.number}}</view>
					<view style="color: #AAAAAA;">开奖进度{{now_period.schedule}}%</view>
				</view>
				<view class="schedule"
					:style="{background: `linear-gradient(90deg, #0f734f ${now_period.schedule}%, #E5E5E5 0)`}"></view>
				<view class="fx j-between" style="margin-top: 24rpx;color: #AAAAAA;">
					<view>夺宝码总量：{{now_period.loot_code_num}}</view>
					<view>剩余：<text style="color: #0f734f;">{{now_period.surplus_loot_code_num}}</text></view>
				</view>
			</view>
		</view>
		<view class="my_dbm fx j-between a-center">
			<text>我的夺宝码</text>
			<text style="color: #777777;">{{my_code || "您未购买本期夺宝码"}}</text>
			<view class="fx" style="font-size: 24rpx;color: #AAAAAA;">
				<text @click="toPage(`./code?pid=${now_period.product_id}`)">更多号码</text>
				<uni-icons type="forward" size="16" color="#AAAAAA" style="line-height: 1;"></uni-icons>
			</view>
		</view>
		<view style="margin-top: 24rpx;">
			<view class="tabs">
				<tui-tab :tabs="tabs" @change="change" :current="currentIndex" :size="30" bold color="#AAAAAA"
					selectedColor="#0f734f" sliderBgColor="#0f734f"></tui-tab>
			</view>
			<view class="container">
				<!-- 往期用户 -->
				<template v-if="tabIndex==0">
					<template v-for="item in previous">
						<view class="item fx">
							<image src="@/static/images/f.png" class="circle" style="width: 80rpx;height: 80rpx;"></image>
							<view class="fx fx-col j-between" style="padding: 4rpx 0;margin-left: 10rpx;">
								<view>{{item.number}}期</view>
								<view style="color: #AAAAAA;font-size: 25rpx;">获奖用户: {{item.phone}}</view>
							</view>
							<view class="fx fx-col a-end ml-auto">
								<view>中奖号码: {{item.code}}</view>
								<view style="color: #AAAAAA;font-size: 24rpx; margin-top: 8rpx;">中奖时间:
									{{item.opening_time}}</view>
							</view>
						</view>
					</template>
					<foot :text="loadText" :state="loadState"></foot>
					<view v-if="noData">
						<emptyPage title="暂无数据~"></emptyPage>
					</view>
				</template>
				<template v-if="tabIndex==1">
					<!-- 本期参与 -->
					<template v-for="item in list">
						<view class="item fx">
							<image src="@/static/images/f.png" class="circle" style="width: 80rpx;height: 80rpx;"></image>
							<view class="fx fx-col j-between" style="padding: 4rpx 0;margin-left: 10rpx;">
								<view>{{item.user.nickname}}</view>
								<view style="color: #AAAAAA;font-size: 25rpx;">{{item.create_time}}</view>
							</view>
							<view class="fx fx-col a-end ml-auto">
								<view>夺宝码: {{item.code}}</view>
							</view>
						</view>
					</template>
					<foot :text="loadText" :state="loadState"></foot>
					<view v-if="noData">
						<emptyPage title="暂无数据~"></emptyPage>
					</view>
				</template>
				<template v-if="tabIndex==2">
					<jyf-parser :html="content" ref="article"></jyf-parser>
				</template>
			</view>
		</view>

		<view class="fixed fx fx-center" v-if="now_period.schedule<100">
			<view class="btn" @click="visible = true">参与夺宝</view>
		</view>

		<tui-drawer mode="bottom" :visible="visible" @close="visible = false" maskZIndex="99" zIndex="100">
			<view style="height: height: 594rpx;">
				<view class="d-container">
					<view style="font-size: 30rpx; padding: 25rpx 0;color: #333333;">兑换夺宝码</view>
					<view class="fx db_box">
						<image :src="slider_img[0]" style="width: 72rpx;height: 72rpx;"></image>
						<view style="margin-left: 16rpx;">
							<view style="color: #0f734f;">￥{{now_period.integral}}=1夺宝码</view>
							<view style="color: #AAAAAA;">剩余{{now_period.surplus_loot_code_num}}个夺宝码</view>
						</view>
					</view>
					<view class="fx j-between" style="margin-top: 32rpx;">
						<text>兑换夺宝码数量</text>
						<view>
							<u-number-box :min="1" v-model="num" @change="valChange"></u-number-box>
						</view>
					</view>
					<!-- <view class="fx j-between" style="margin-top: 50rpx;">
						<view v-for="(item,i) in list2" :key="i" class="num_item" :class="{active:num==item}"
							@click="pickValue(i)">{{item}}</view>
					</view> -->
				</view>
			</view>
			<view class="convert fx j-between a-center">
				<view>
					<view>
						合计: <text style="color:#0f734f;">￥{{Number(num)*Number(now_period.integral)}}</text>
					</view>
				</view>
				<view class="convert_btn" @click="showModal">兑换</view>
			</view>
		</tui-drawer>

		<u-modal v-model="show" title="夺宝规则" :title-style="{color:'#336699'}"
			:confirm-style="{color:'#FF3C30','font-size':'28rpx'}" confirm-text="关闭" :mask-close-able="true">
			<view class="slot-content" style="padding:24rpx;line-height: 1.6;">
				<jyf-parser :html="html" ref="article"></jyf-parser>
			</view>
		</u-modal>
		<pay unit="￥" :show.sync="payShow" :money="now_period.integral*num" @finish="finish"></pay>

		<tui-modal :show="modal" custom padding="40rpx 28rpx" @cancel="modal = false">
			<view class="fx fx-col a-center w100">
				<view style="font-size: 30rpx;font-weight: 600;">请选择支付方式</view>
				<view style="margin: 30rpx 0;" class="w100">
					<payType3 ref="pay" :list="['now_money']" :payType.sync="payType"></payType3>
				</view>
				<view class="btn2" @click="confirm">确定</view>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	import { buyApi, getSnatchUserListApi, getSnatchHistoryUserApi, getSnatchInfoApi } from '@/api/snatch.js'
	import paging from '@/mixins/paging.js'
	export default {
		data() {
			return {
				list: [],
				previous: [],
				show: false,
				payShow: false,
				payType: "now_money",
				modal: false,
				num: 1, // 购买夺宝码数量
				currentIndex: 0, // 当前选中tab 索引
				visible: false,
				html: "",
				list2: [50, 100, 200, 500],
				index: -1,
				current: 1,
				tabIndex: 0,
				totalPrice: "500",
				sliderCount: 0,
				tabs: ['往期揭晓', '本期参与', '商品详情'],
				period_id: "", // 期号
				my_code: "",
				content: "",
				now_period: "", // 商品详情
				slider_img: [],
				skeletonShow: true,
				statusBarHeight: ""
			}
		},
		mixins: [paging],
		onLoad(options) {
			this.period_id = options.period_id;
			this.product_id = options.product_id;
			this.getSnatchHistoryUser();
			this.getSnatchInfo();
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		},
		methods: {
			// 获取往期用户列表
			async getSnatchHistoryUser(options = {}) {
				let opt = {
					first: true,
					...options,
				}
				let params = {
					page: this.page,
					limit: this.limit
				}
				let { data: { count, list } } = await getSnatchHistoryUserApi(this.product_id, params);
				if (opt.first) {
					this.previous = list;
					this.noData = count == 0;
					this.count = count;
				} else {
					this.list = this.list.concat(list);
				}
			},

			/**
			 * 
			 */
			async showModal() {
				if (!this.num) {
					return this.$msg.fail("请输入兑换夺宝码数量");
				}

				this.modal = true
			},


			// 获取本期参与用户
			async getSnatchUserList(options = {}) {
				let opt = {
					first: true,
					...options,
				}
				let params = {
					page: this.page,
					limit: this.limit
				}
				let { data: { count, list } } = await getSnatchUserListApi(this.product_id, params)
				if (opt.first) {
					this.list = list;
					this.noData = count == 0;
					this.count = count;
				} else {
					this.list = this.list.concat(list);
				}
			},

			// 获取商品详情
			async getSnatchInfo() {
				let { data: { content, slider_img, my_code, now_period } } = await getSnatchInfoApi(this.product_id);
				this.content = content;
				// #ifdef APP-PLUS
				this.content = content.replace(/src="\/\//ig, "src=\"http://");
				// #endif

				this.sliderCount = slider_img.length;
				this.slider_img = slider_img;
				this.my_code = my_code;
				this.now_period = now_period;
			},
			valChange() {
				// this.index = -1;
			},
			swiperChange(e) {
				this.current = e.detail.current + 1;
			},
			pickValue(i) {
				this.index = i;
				this.num = this.list2[i]
			},
			confirm() {
				if (!this.payType) {
					return this.$msg.fail("请选择支付方式");
				}
				this.modal = false;
				this.payShow = true;
			},

			// 夺宝
			async finish(pwd) {
				let params = {
					num: this.num,
					period_id: this.period_id,
					pwd,
					pay_type: this.payType,
				}
				uni.showLoading()
				try {
					let { status, data } = await buyApi(params);
					if (status == 200) {
						this.$msg.succ("购买夺宝码成功");
						if (this.payType == "brokerage_price") {
							this.$refs.pay.updateBrokerage();
						} else {
							this.updateUser();
						}
						this.getSnatchInfo();
						this.currentIndex = 1;
						this.tabIndex = 1;
						this.page = 1;
						this.getSnatchUserList();
						setTimeout(() => {
							uni.navigateTo({
								url: `./succ?params=${this.setParams(data)}`
							})
						}, 1000)
					}
				} catch (e) {
					//TODO handle the exception
				} finally {
					uni.hideLoading();
					this.visible = false;
					setTimeout(() => {
						this.payShow = false;
					}, 800);
				}
			},
			// 切换tab栏
			change({ index }) {
				this.page = 0;
				this.loadState = 0;
				this.tabIndex = index;
				switch (index) {
					case 0:
						this.getSnatchHistoryUser();
						break;
					case 1:
						this.getSnatchUserList();
						break;
					default:
						break;
				}
			},
			// 后退
			returns: function() {
				uni.navigateBack()
			},
			// 首页
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
		},
		onNavigationBarButtonTap() {
			this.show = true;
		},
		onReachBottom() {
			let len = this.tabIndex == 0 ? this.previous.length : this.list.length;
			if (len == 0) {
				return
			}
			if (len >= this.count && len != 0) {
				this.loadState = 2;
				return
			}
			this.loadState = 1;
			this.page++;
			if (this.tabIndex == 0) {
				this.getSnatchHistoryUser({ first: false });
			} else {
				this.getSnatchUserList({ first: false });
			}
		}
	}
</script>

<style lang="scss">
	.head-wrapper {
		z-index: 999;
		display: flex;
		align-items: center;
		position: absolute;
		left: 30rpx;
		top: 20px;
		height: 114rpx;
	}

	.head-menu {
		display: flex;
		align-items: center;
		height: 54rpx;
		width: 140rpx;
		background: rgba(0, 0, 0, .25);
		border-radius: 27rpx;

		.iconfont {
			flex: 1;
			text-align: center;
			color: #fff;
			box-sizing: border-box;

			&.icon-xiangzuo {
				border-right: 1px solid #fff;
			}
		}
	}

	page {
		background-color: #FFFFFF;
	}

	.head {
		position: relative;
	}

	.point {
		position: absolute;
		color: #FFFFFF;
		width: 92rpx;
		height: 46rpx;
		text-align: center;
		line-height: 46rpx;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 46rpx;
		bottom: 25rpx;
		right: 25rpx;
		z-index: 10;
	}

	.swiper {
		height: 614rpx;
		background-color: #FFFFFF;
	}

	.main {
		padding: 0 30rpx;
	}

	.explain {
		width: 686rpx;
		height: 120rpx;
		background: #F3F3F3;
		padding-left: 24rpx;
		border-radius: 8rpx;
		color: #AAAAAA;
	}

	.schedule {
		height: 10rpx;
		border-radius: 10rpx;
		margin-top: 25rpx;
	}

	.my_dbm {
		margin-top: 30rpx;
		height: 120rpx;
		box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
		padding: 0 30rpx;
		position: relative;
	}

	.item {
		padding: 25rpx 30rpx;
		border-bottom: 1px solid #E8E8E8;
	}

	.container .item:last-child {
		border: none;
	}

	.container {
		margin-top: 20rpx;
	}

	.fixed {
		position: fixed;
		z-index: 2;
		height: 120rpx;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #FFFFFF;
		border-top: 1rpx solid #F5F5F5;
	}

	.btn {
		width: 686rpx;
		height: 80rpx;
		background-color: #0f734f;
		color: #FFFFFF;
		text-align: center;
		line-height: 80rpx;
		border-radius: 80rpx;
	}

	.btn2 {
		width: 100%;
		height: 80rpx;
		background-color: #0f734f;
		color: #FFFFFF;
		text-align: center;
		line-height: 80rpx;
		border-radius: 80rpx;
		margin-top: 40rpx;
	}

	.d-container {
		padding: 0 30rpx;
	}

	.db_box {
		padding: 30rpx 0;
		border-bottom: 1px solid #E8E8E8;
	}

	.num_item {
		width: 160rpx;
		height: 56rpx;
		background: #E5E5E5;
		border-radius: 4rpx;
		line-height: 56rpx;
		text-align: center;
	}

	.num_item.active {
		background-color: #0f734f;
		color: #FFFFFF;
	}

	.convert_btn {
		width: 240rpx;
		height: 80rpx;
		background: #0f734f;
		color: #FFFFFF;
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
	}

	.convert {
		padding: 0 30rpx;
		height: 120rpx;
		margin-top: 60rpx;
		background: #FFFFFF;
		box-shadow: 0px -1rpx 0rpx #E5E5E5;
	}

	.accomplish {
		padding-bottom: 0 !important;
	}

	/deep/ .empty-box {
		margin-top: 0;
	}
</style>
