<template>
	<view>
		<u-keyboard default="" ref="uKeyboard" :mask="true" v-model="show" :mask-close-able="false" :dot-enabled="false"
		 :safe-area-inset-bottom="true" :tooltip="false" @change="onChange" @backspace="onBackspace">
			<view>
				<view class="u-text-center u-padding-20 money">
					<text>{{this.money}}</text>
					<text class="u-font-20 u-padding-left-10">{{unit}}</text>
					<view class="u-padding-10 close" data-flag="false" @tap="showPop">
						<u-icon name="close" color="#333333" size="28"></u-icon>
					</view>
				</view>
				<view class="u-flex u-row-center">
					<u-message-input mode="box" :maxlength="6" :dot-fill="true" v-model="value" :disabled-keyboard="true"></u-message-input>
				</view>
			</view>
		</u-keyboard>
	</view>
</template>

<script>
	export default {
		props: {
			// 显示单位
			unit:{
				type:String,
				default:"元"
			},
			money: {
				type: [Number, String],
				default: "0.00"
			},
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				value: '',
				lock: false,
			}
		},
		methods: {
			onChange(val) {
				if (this.value.length < 6) {
					this.value += val;
				}
				if (this.value.length == 6 && !this.lock) {
					// 密码输入完成
					this.lock = true;
					this.$emit('finish', this.value);
				}
			},
			onBackspace(e) {
				if (this.value.length > 0) {
					this.value = this.value.substring(0, this.value.length - 1);
					this.lock = false;
				}
			},
			showPop() {
				this.$emit("update:show", false);
			},
		},
		watch: {
			show(val) {
				if (val == false) {
					this.$emit("close");
					this.value = "";
				}
				else{
					this.lock = false;
				}
			}
		}
	}
</script>

<style lang="scss">
	.money {
		font-size: 80rpx;
		color: $u-type-warning;
		position: relative;

		.close {
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			line-height: 28rpx;
			font-size: 28rpx;
		}
	}

	.tips {
		color: $u-tips-color;
	}
</style>
