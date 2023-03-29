<template>
	<view>
		<view class="mask-box" v-if="show"></view>
		<view class="container flex flex-col" :class="{'show':show}">
			<u-icon name="close" color="#666666" size="30" class="icon" @click="close"></u-icon>
			<view class="flex justify-center fz_32" style="padding:36rpx 0;">请选择所在地区</view>
			<view class="flex addr-list">
				<view v-if="address.province" @click="index=1">{{address.province}}</view>
				<view v-if="address.city" @click="index=2">{{address.city}}</view>
				<view v-if="address.district" @click="index=3">{{address.district}}</view>
				<view v-if="address.street" @click="index=4">{{address.street}}</view>
				<view style="color: #0f734f;" v-if="!isEnd()">请选择</view>
			</view>
			<scroll-view scroll-y class="scrollView" :scroll-top="scrollTop">
				<view class="scroll-box">
					<template v-for="item in tempData">
						<view class="item" @click="handlerClick(item)" :class="{'active':activeClass(item)}">{{item}}</view>
					</template>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import addrData from "./data2.js"
	export default {
		name: "addrList",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			// 目标级别
			rank: {
				type: Number,
				default: 4
			},
			value: Object
		},
		model: {
			value: "value",
			event: "input"
		},
		data() {
			return {
				tempData: [],
				scrollTop: 0,
				address: {
					province: "", //省
					city: "", // 市
					district: "", // 区
					street: "", // 街道
				},
				index: 1
			};
		},
		mounted() {
			this.tempData = Object.keys(addrData);
		},

		methods: {
			// 判断用户是否选择到指定目标层级
			isEnd() {
				let arr = Object.values(this.address);
				return !!arr[this.rank - 1];
			},
			activeClass(item) {
				switch (this.index) {
					case 1:
						return this.address.province == item;
						break;
					case 2:
						return this.address.city == item;
						break;
					case 3:
						return this.address.district == item;
						break;
					case 4:
						return this.address.street == item;
						break;
				}
			},
			/**
			 * 根据省计算市列表
			 */
			computedCityArrays() {
				if (this.isEnd()) return;
				this.tempData = Object.keys(addrData[this.address.province]);
			},

			/**
			 * 根据市计算区列表
			 */
			computedDistrictArrays() {
				if (this.isEnd()) return;
				this.tempData = Object.keys(addrData[this.address.province][this.address.city])
			},

			/**
			 * 根据县计算街道列表
			 */
			computedStreetArray() {
				if (this.isEnd()) return;
				this.tempData = addrData[this.address.province][this.address.city][this.address.district]
			},
			close() {
				if (!this.isEnd()) {
					this.$emit("input", {
						province: "",
						city: "",
						district: "",
						street: "",
					});
				}
				this.$emit("update:show", false);
			},

			/**
			 * 点击地区列表
			 */
			handlerClick(val) {
				switch (this.index) {
					case 1:
						this.address.province = val;
						if(!this.isEnd()){
							this.index++;
						}
						
						break;
					case 2:
						this.address.city = val;
						if(!this.isEnd()){
							this.index++;
						}
						break;
					case 3:
						this.address.district = val;
						// 根据区县计算街道列表
						this.computedStreetArray();
						if(!this.isEnd()){
							this.index++;
						}
						break;
					case 4:
						this.address.street = val;
						break;
				}
				if (this.isEnd()) {
					this.$emit("input", this.address);
					setTimeout(() => {
						this.close();
					}, 300)
				}
			}
		},
		watch: {
			index(val) {
				switch (val) {
					case 1:
						this.address.city = this.address.district = this.address.street = "";
						// 获取所有省数据
						this.tempData = Object.keys(addrData);
						break;
					case 2:
						this.address.district = this.address.street = "";
						// 根据省获取市
						this.computedCityArrays();
						break;
					case 3:
						this.address.street = "";
						// 根据省、市获取区
						this.computedDistrictArrays();
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	.mask-box {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 1000;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.container {
		height: 60vh;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1001;
		background-color: #fff;
		transform: translate3d(0, 100%, 0);
		/* transform-origin: center bottom; */
		border-radius: 16rpx 16rpx 0 0;
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
	}

	.container.show {
		transform: translate3d(0, 0, 0);
	}

	.scrollView {
		padding: 0 30rpx;
	}

	.addr-list {
		padding: 30rpx;
	}

	.addr-list view+view {
		margin-left: 40rpx;
	}

	.item {
		line-height: 2.6;
		font-size: 30rpx;
	}

	.item.active {
		color: #0f734f;
	}

	.icon {
		position: absolute;
		top: 24rpx;
		right: 24rpx;
	}

	.scroll-box {
		height: calc(60vh - 210rpx);
	}
</style>
