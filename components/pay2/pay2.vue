<template>
	<view>
		<tui-keyboard :show="show" @close="closeKeyboard" @click="keyboardClick">
			<view class="tui-digital-box">
				<view class="tui-keyboard-tips">请输入支付密码</view>
				<view class="money-text" v-if="money">{{money}} {{unit}}</view>
				<tui-keyboard-input :inputvalue="pwdArr"></tui-keyboard-input>
			</view>
		</tui-keyboard>
	</view>
</template>

<script>
	let numIndexs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10];
	export default {
		name: "pay2",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			money: {
				type: [Number,String],
				default: 0
			},
			unit:{
				type:String,
				default:"￥"
			}
		},
		data() {
			return {
				lock: false,
				numberArr: [],
				pwdArr: ["", "", "", "", "", ""],
			}
		},
		methods: {
			closeKeyboard: function() {
				this.$emit("update:show", false);
				this.$emit("close");
			},
			/**
			 * 键盘输入事件
			 */
			keyboardClick: function(e) {
				if (this.lock) {
					return
				}
				let numberArr = this.numberArr;
				let pwdArr = this.pwdArr;
				let index = e.index;
				if (numberArr.length === pwdArr.length && numIndexs.indexOf(index) > -1) {
					return;
				}
				if (index == 9) { //取消键
					this.closeKeyboard();
					return;
				} else if (index == 11) { //退格键
					let len = numberArr.length;
					if (len) {
						pwdArr.splice(len - 1, 1, "");
					} else {
						pwdArr = ["", "", "", "", "", ""];
					}
					numberArr.pop()
				} else if (index == 10) {
					numberArr.push(0);
					pwdArr.splice(numberArr.length - 1, 1, "●");
				} else {
					numberArr.push(index + 1);
					pwdArr.splice(numberArr.length - 1, 1, "●");
				}
				this.numberArr = numberArr;
				this.pwdArr = pwdArr;
				if (this.numberArr.length === this.pwdArr.length && !this.lock) {
					this.lock = true;
					this.$emit('finish', this.numberArr.join(''));
				}
			},
			offLock() {
				this.lock = false;
			}
		},
		watch: {
			show(val) {
				if (val == false) {
					this.$emit("close");
					this.numberArr = [];
					setTimeout(() => {
						this.pwdArr = ["", "", "", "", "", ""]
					}, 500)
				}
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx 0 120rpx 0;
		box-sizing: border-box;
	}

	.header {
		padding: 80rpx 90rpx 60rpx 90rpx;
		box-sizing: border-box;
	}

	.title {
		font-size: 34rpx;
		color: #333;
		font-weight: 500;
	}

	.sub-title {
		font-size: 24rpx;
		color: #7a7a7a;
		padding-top: 18rpx;
	}

	.tui-btn-box {
		padding: 10rpx 40rpx;
		box-sizing: border-box;
	}

	.tui-keyboard-tips {
		width: 100%;
		height: 120rpx;
		text-align: center;
		box-sizing: border-box;
		padding-top: 56rpx;
		line-height: 1;
		font-size: 32rpx;
		background: #fff;
		position: relative;
		color: #333;
		border: 0;
	}

	.tui-digital-box {
		background: #fff;
		padding-bottom: 50rpx;
		border: 0;
	}

	.money-text {
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		color: #E1251B;
	}
</style>
