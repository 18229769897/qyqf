<template>
	<view class="page-box">
		<view style="padding: 20rpx 0; line-height: 1.7; font-size: 28rpx;">
			<u-parse :html="data.case_describe"></u-parse>
		</view>
		<view style="padding: 24rpx 0;">
			<tui-progress :duration="5" :percentWidth="120" activeColor="#07c160"
				:percent="(parseFloat(data.case_donated_score/data.case_total_score*100)).toFixed(2)" show-info></tui-progress>
			<view class="fx j-between" style="margin-top: 20rpx;font-size: 25rpx;margin-bottom: 30rpx;">
				<text>总需捐赠：{{data.case_total_score}}爱心积分</text>
				<text>已捐赠：{{data.case_donated_score}}爱心积分</text>
			</view>
		</view>
		<view class="list fx fx-warp">
			<template v-for="(item,index) in picture_data">
				<image @click="openPer(index)" :src="item" class="img" mode="aspectFill"></image>
			</template>
		</view>
		<view class="footer">
			<template v-if="userInfo.uid!=data.user.uid">
				<u-button shape="circle" type="error" @click="donate" v-if="data.status==1">立即捐赠</u-button>
				<u-button shape="circle" type="error" v-if="data.status==3">捐赠已结束</u-button>
			</template>

			<template v-else>
				<u-button shape="circle" type="error" disabled v-if="data.status==1">
					结算
				</u-button>
				<template v-if="data.status==3">
					<u-button shape="circle" type="error" :disabled="data.status==1" v-if="data.is_withdraw==0"
						@click="toPage(`./withdrawal?id=${data.declare_id}`)">
						结算
					</u-button>
					<u-button shape="circle" type="error" :disabled="data.status==3" v-if="data.is_withdraw">
						已结算
					</u-button>
				</template>
			</template>

		</view>
		<tui-drawer mode="bottom" :visible="visible" @close="visible = false" backgroundColor="transparent" zIndex="200" maskZIndex="199">
			<view class="drawer-box">
				<view style="font-size: 28rpx;">感谢您的爱心捐赠，请在下方输入捐赠数量</view>
				<view style="margin-top: 22rpx;">
					<tui-input v-model="donateNum" type="number" clearable inputBorder padding="14rpx 20rpx" placeholder="点击输入捐赠积分的数量">
					</tui-input>
				</view>
				<u-button style="margin-top: 40rpx;" shape="circle" type="error" @click="confirmDonate">确认捐赠</u-button>
			</view>
		</tui-drawer>
		<!-- <pay :show.sync="payShow" :money="donateNum" unit="爱心积分" @finish="$emit('finish',$event)" @close="$off(`finish`)"></pay> -->
		<pay2 :show.sync="payShow" @finish="$emit(`finish`,$event)" @close="$off(`finish`)" ref="pay2"></pay2>
	</view>
</template>

<script>
	import { crowdDetailApi, donateApi } from "@/api/user.js"
	import { isInteger } from "@/utils/validate.js"
	import { mapGetters } from "vuex"
	export default {
		data() {
			return {
				visible: false,
				payShow: false,
				picture_data: [],
				id: "",
				data: {
					user: {}
				},
				donateNum: ""
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.getDetail();
		},
		computed: {
			...mapGetters(["userInfo"]),
		},
		methods: {
			openPer(index) {
				uni.previewImage({
					urls: this.picture_data,
					current: index
				});
			},
			confirmDonate() {
				if (!this.donateNum) {
					return this.$msg.fail("请输入捐赠爱心积分");
				}
				if (Number(this.donateNum) != Math.floor(this.donateNum)) {
					return this.$msg.fail("请输入整数");
				}
				if (Number(this.donateNum) > Number(this.userInfo.love_points)) return this.$msg.fail("爱心积分余额不足");
				this.payShow = true;

				// 前往this.donate()
			},
			/**
			 * 立即捐赠
			 */
			donate() {
				this.visible = true;
				this.$on("finish", async (pwd) => {
					let params = {
						pwd,
						score: this.donateNum
					}
					try {
						let { message } = await donateApi(this.id, params);
						this.getDetail();
						this.$msg.succ(message, () => {
							this.visible = false;
							uni.navigateTo({
								url: "./jz_record"
							})
						})
					} catch (e) {
						this.$msg.fail(e.message || e);
					} finally {
						this.$refs.pay2.offLock();
						setTimeout(() => {
							this.payShow = false;
						}, 800)
					}
				})
			},
			async getDetail() {
				let { data } = await crowdDetailApi(this.id);
				this.data = data;
				this.picture_data = data.case_picture_data;
			},
			commit() {

			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
		padding-bottom: 100rpx;
	}

	.page-box {
		padding: 24rpx;
	}

	.img {
		width: calc((100% - 14rpx * 2) / 3);
		height: 190rpx;
		margin-left: 14rpx;
		margin-bottom: 14rpx;
		border-radius: 15rpx;
	}

	.list .img:nth-child(3n + 1) {
		margin-left: 0;
	}

	.footer {
		position: fixed;
		z-index: 10;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #F8F8F8;
		padding: 24rpx 60rpx;
	}

	.drawer-box {
		height: 360rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx;
	}
</style>
