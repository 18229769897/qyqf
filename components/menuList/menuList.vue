<template>
	<view>
		<view class="fixed-mask2" v-show="show" @click.stop="close"></view>
		<view class="menu-box" :style="style()" v-if="show">
			<view class="menu-list">
				<template v-for="(item, index) in list">
					<view class="menu-item" @click="handlerClick(item, index)">
						<slot :item="item" />
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: Object
			},
			show: {
				type: Boolean,
				default: false
			},
			list: {
				type: Array
			},
			offsetX: {
				type: String,
				default: "0rpx"
			},
			offsetY: {
				type: String,
				default: "20rpx",
			},
		},
		model: {
			prop: "value",
			event: "update"
		},
		data() {
			return {};
		},
		methods: {
			style() {
				return {
					transform: `translate3d(${this.offsetX},${this.offsetY},0)`
				};
			},
			close() {
				this.$emit('update:show', false);
			},
			handlerClick(item, index) {
				this.$emit("update", { index, ...item });
				this.$emit("change");
				setTimeout(() => {
					this.$emit("update:show", false);
				}, 200);
			}
		}
	};
</script>

<style scoped>
	.menu-box {
		position: absolute;
		left: 0;
		top: 100%;
		z-index: 10000;
		box-shadow: 0px 0px 10px rgb(20, 20, 20, 0.2);
		color: #333;
		background-color: #fff;
		border-radius: 8rpx;
	}

	.menu-list {
		padding: 10px;

	}

	.menu-list .menu-item {
		line-height: 30px;
		text-align: center;
		cursor: pointer;
		white-space: nowrap;
	}

	.menu-list .menu-item:nth-child(1) {
		border-radius: 8rpx 8rpx 0 0;
	}

	.menu-list .menu-item:nth-last-child() {
		border-radius: 0 0 8rpx 8rpx;
	}

	.menu-box::after {
		position: absolute;
		top: -8px;
		left: 50%;
		transform: translate3d(-50%, 0, 0);
		content: "";
		width: 0;
		height: 0;
		border-width: 0 9px 10px;
		border-style: solid;
		border-color: transparent transparent white;
	}

	.fixed-mask2 {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
	}
</style>
