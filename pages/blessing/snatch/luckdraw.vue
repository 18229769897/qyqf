<template>
	<view class="clear">
		<u-navbar title="积分抽奖" :border-bottom="false" :background="background" title-color="#FFFFFF" back-icon-color="#FFFFFF">
			<template #right>
				<view class="right_bar fx a-center j-between">
					<view @click="show = true">规则</view>
					<view class="verLine"></view>
					<view @click="toPage(`/pages/blessing/snatch/drawRecord`)">记录</view>
				</view>
			</template>
		</u-navbar>
		<image src="@/static/images/dbtitle.png" class="image"></image>
		<view class="tips">夺宝区累计消费500积分可参与一次免费抽奖</view>
		<view class="container">
			<view class="tui-container-in">
				<template v-for="(item,index) in list">
					<view class="tui-content-out fx fx-col a-center" :class="['tui-award-'+(index+1), {'tui-awardSelect':index==indexSelect}]" :key="index">
						<image class="tui-award-image" :src="item.img"></image>
						<view style="color: #0f734f; font-size: 26rpx;">{{item.name}}</view>
					</view>
				</template>
				<view class="tui-btn-start" :class="[isRunning?'tui-ative':'']" @tap="startDrawing">立即抽奖</view>
			</view>
		</view>
		<view class="btn">
			我的抽奖机会: <text style="font-size: 36rpx;">{{number_of_draw}}</text>次
		</view>
		<u-modal v-model="show" title="抽奖规则" :title-style="{color:'#336699'}" :confirm-style="{color:'#FF3C30','font-size':'28rpx'}" confirm-text="关闭" :mask-close-able="true">
			<view class="slot-content" style="padding:24rpx;line-height: 1.6;">
				<jyf-parser :html="html" ref="article"></jyf-parser>
			</view>
		</u-modal>
		<tui-modal :show="modal" custom backgroundColor="transparent">
			<view class="fx fx-col a-center">
				<image src="@/static/images/zj_text.png" style="width: 272rpx;height: 75rpx;"></image>
				<view class="zj_pudduct fx fx-col a-center" style="padding-top: 15rpx;">
					<view style="color: #FEEEA0;">恭喜获得{{zj_name}}</view>
					<image :src="img" style="width: 160rpx;height:160rpx;opacity: 0.85;margin-top: 20rpx;"></image>
				</view>
				<view class="zj_btn" @click="modal=false;isRunning = false">开心收下</view>
			</view>
		</tui-modal>
	</view>
</template>

<script>
	import { getDrawListApi, getLuckyDrawApi, myParamsApi } from "@/api/snatch.js"
	export default {
		data() {
			return {
				background: {
					backgroundColor: "transparent"
				},
				show: false,
				modal: false,
				html: "",
				img: "",
				list: [], //奖品数组
				indexSelect: 0, //被选中的奖品index
				isRunning: false, //是否正在抽奖
				index: "", // 中奖商品索引
				number_of_draw: "",
				zj_name: "" // 中奖商品名称
			}
		},
		onShow() {
			this.getDrawList();
			this.getMyParams();
		},
		methods: {
			// 获取中奖商品
			async getLuckyDraw() {
				let { data: { product_id } } = await getLuckyDrawApi();
				this.index = this.list.findIndex(item => item.product_id == product_id);
				// 重新统计抽奖次数
				this.getMyParams();
			},

			// 获取我的参数
			async getMyParams() {
				let { data: { grand_total, number_of_draw } } = await myParamsApi();
				this.number_of_draw = number_of_draw;
			},
			//获取随机数
			getRandom: function(u) {
				let rnd = Math.random() > 0.5 ? "2" : "1";
				u = u || 3;
				for (var i = 0; i < u; i++) {
					rnd += Math.floor(Math.random() * 10);
				}
				return Number(rnd);
			},
			//开始抽奖
			startDrawing() {
				if (this.isRunning) return
				if (this.number_of_draw == 0) {
					return this.$msg.fail("剩余抽奖次数不足");
				}
				this.getLuckyDraw();
				this.isRunning = true;
				let indexSelect = 0;
				let i = 0;
				let randomNum = this.getRandom(3);
				let timer = setInterval(() => {
					++indexSelect;
					indexSelect = indexSelect % 8;
					this.indexSelect = indexSelect;
					i += 30;
					if (i > randomNum && indexSelect == this.index) {
						//去除循环
						clearInterval(timer)
						timer = null;
						this.img = this.list[this.index].img;
						this.zj_name = this.list[this.index].name;
						setTimeout(() => {
							this.modal = true;
						}, 600);
					}
				}, (70 + i))
			},

			// 获取商品列表
			async getDrawList() {
				let { data: { list } } = await getDrawListApi();
				this.list = list;
			},
		}
	}
</script>

<style>
	@import url("/static/css/common.css");

	page {
		background-image: url(@/static/images/dbbg.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		height: 100vh;
	}

	.container {
		height: 600rpx;
		width: 650rpx;
		background-color: #FFE5B8;
		margin: 0 auto;
		border-radius: 40rpx;
		position: relative;
		margin-top: 48rpx;
	}

	.image {
		width: 585rpx;
		height: 113rpx;
		display: block;
		margin: 0 auto;
		margin-top: 56rpx;
	}

	.tips {
		width: 658rpx;
		height: 64rpx;
		background: #FF8D5B;
		border-radius: 40rpx;
		margin: 0 auto;
		text-align: center;
		line-height: 64rpx;
		color: #FFFFFF;
		margin-top: 32rpx;
	}

	.tui-container-in {
		width: 580rpx;
		height: 530rpx;
		background-color: #FFBC78;
		border-radius: 40rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
	}

	.tui-content-out {
		padding-top: 12rpx;
		position: absolute;
		height: 150rpx;
		width: 168rpx;
		background-color: #FFFFFF;
		border-radius: 15rpx;
		box-shadow: 0 4px 0 #F3F2F0;
	}

	/* 580 530  */

	.tui-award-1 {
		left: 24rpx;
		top: 24rpx;
	}

	.tui-award-2 {
		left: 206rpx;
		top: 24rpx;
	}

	.tui-award-3 {
		left: 388rpx;
		top: 24rpx;
	}

	.tui-award-4 {
		left: 388rpx;
		top: 188rpx;
	}

	.tui-award-5 {
		left: 388rpx;
		top: 352rpx;
	}

	.tui-award-6 {
		left: 206rpx;
		top: 352rpx;
	}

	.tui-award-7 {
		left: 24rpx;
		top: 352rpx;
	}

	.tui-award-8 {
		left: 24rpx;
		top: 188rpx;
	}

	/**居中 加粗*/

	.tui-btn-start {
		position: absolute;
		top: 188rpx;
		left: 206rpx;
		border-radius: 15rpx;
		height: 150rpx;
		width: 168rpx;
		background: linear-gradient(180deg, #FC6243 0%, #FF5360 100%);
		box-shadow: 0 4px 0 #F1393F;
		color: #FFFFFF;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 150rpx;
	}

	.tui-ative {
		opacity: 0.6 !important;
	}

	.tui-award-image {
		width: 100rpx;
		height: 100rpx;
	}

	.tui-awardSelect {
		background-color: rgba(101, 141, 255, 0.5) !important;
		box-shadow: 0 4px 0 rgba(101, 141, 255, 0.5) !important;
	}

	.btn {
		width: 480rpx;
		margin: 0 auto;
		margin-top: 60rpx;
		height: 100rpx;
		background: linear-gradient(180deg, #FFF3D9 0%, #FFC972 100%);
		box-shadow: 0rpx 3rpx 6rpx rgba(219, 136, 73, 0.6);
		border-radius: 50rpx;
		color: #FB2106;
		text-align: center;
		line-height: 100rpx;
		font-weight: 600;
	}

	.clear {
		padding-top: 1rpx;
		box-sizing: border-box;
	}

	.right_bar {
		color: #FFFFFF;
		width: 160rpx;
		height: 46rpx;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 23rpx 0rpx 0rpx 23rpx;
		padding: 0 18rpx;
		font-size: 24rpx;
	}

	.verLine {
		width: 1rpx;
		height: 20rpx;
		background-color: #FFFFFF;
	}

	.zj_btn {
		width: 240rpx;
		height: 72rpx;
		margin: 0 auto;
		margin-top: 60rpx;
		background: linear-gradient(180deg, #FFF3D9 0%, #FFC972 100%);
		box-shadow: 0rpx 3rpx 6rpx rgba(219, 136, 73, 0.6);
		border-radius: 72rpx;
		color: #FB2106;
		text-align: center;
		line-height: 72rpx;
		font-weight: 600;
	}

	.zj_pudduct {
		width: 296rpx;
		height: 282rpx;
		margin-top: 20rpx;
		background-image: url(@/static/images/light.png);
		background-size: cover;
	}
</style>
