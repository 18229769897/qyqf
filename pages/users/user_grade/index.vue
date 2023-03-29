<template>
	<view>
		<view class="header">
			<headBar title="我的等级" noText titleColor="#000"></headBar>
			<swiper class="swiper" :current="swiperIndex" @change="swiperChange" previous-margin="55rpx" next-margin="55rpx">
				<swiper-item v-for="(item, index) in VipList" :key="index">
					<view class="swiper-item fx a-center" :class="{on: swiperIndex == index}">
						<view class="level-box" :class="{'red':isReach(item.value,userInfo.level).flag!=`未达成`}">
							{{isReach(item.value,userInfo.level).flag}}
						</view>
						<view class="fx" style="margin-top: 20rpx;">
							<view style="width: 28rpx;">
								<image v-if="isReach(item.value,userInfo.level).flag==`未达成`" src="@/static/images/lock.png"
									style="width: 100%;" mode="widthFix"></image>
							</view>
							<view style="margin-left: 22rpx;">
								<view class="fz_32 text-black">{{isReach(item.value,userInfo.level).title}}</view>
								<view style="margin-top: 24rpx;">
									<template v-for="item in taskList">
										<view class="task-title fx a-center">{{item.name}}</view>
									</template>
								</view>
							</view>
							<view class="level-box2" style="margin-top: 60rpx;">
								<view class="text">{{item.name}}</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="main">
			<view class="task-box">
				<view class="text-center fz_32 text-yellow bold" style="padding: 34rpx 0;">升级{{level_title}}条件</view>
				<view class="fx-center">
					<view class="task-list">
						<template v-for="(item,index) in taskList">
							<view class="fx item" style="align-items: flex-start;">
								<view class="number">{{index+1}}</view>
								<view class="f1">
									<view class="title">{{item.name}}</view>
									<view class="desc">{{item.title}}</view>
									<view style="margin-top: 10rpx;">
										<progressBar :value="computedPercent(item)"></progressBar>
									</view>
								</view>
							</view>
						</template>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getlevelInfo, getTaskFulfillListApi } from '@/api/user.js';
	import { mapGetters } from "vuex";
	export default {
		data() {
			return {
				lock: false,
				VipList: [], // 会员等级列表
				taskList: [],
				swiperIndex: 0,
				growthValue: true,
				task: [], //任务列表
				illustrate: '', //任务说明
				level_id: 1, //任务id,
				level_title: '',
			};
		},
		computed: mapGetters(["userInfo"]),
		watch: {
			level_id: {
				handler() {
					this.getTaskFulfillList();
				},
				immediate: true
			}
		},
		onLoad() {
			this.getlevelInfo();
		},
		methods: {

			/**
			 * 计算百分比
			 */
			computedPercent(item) {
				let { complete_number, number } = item;
				if (complete_number == 0) {
					return 0
				} else if (complete_number >= number) {
					return 100
				} else {
					return parseInt((complete_number / number * 100))
				}
			},
			/**
			 * 计算用户是否达到指定等级
			 */
			isReach(grade, level) {
				let flag = "";
				let title = "";
				if (grade > level) {
					flag = "未达成"
					title = "未解锁该等级"
				} else if (grade == level) {
					flag = "当前等级"
					title = "已解锁该等级"
				} else {
					flag = "已达成"
					title = "已解锁更高等级"
				}
				return {
					flag,
					title,
				}
			},

			/**
			 * 获取任务完成情况
			 */
			async getTaskFulfillList() {
				let params = {
					level: this.level_id
				}
				let { data } = await getTaskFulfillListApi(params);
				this.taskList = Object.values(data);
			},

			/**
			 * 获取会员等级列表
			 */
			getlevelInfo() {
				uni.showLoading();
				getlevelInfo().then(res => {
					this.VipList = Object.values(res.data);
					console.log(this.VipList);
					this.level_title = this.VipList[0].name;
				}).finally(() => {
					setTimeout(() => {
						uni.hideLoading()
					}, 100)
				})
			},
			/**
			 * 会员等级切换
			 */
			swiperChange(e) {
				let index = e.detail.current;
				this.swiperIndex = index;
				this.level_id = this.VipList[index].value || 0;
				this.level_title = this.VipList[index].name || '';
			},
			/**
			 * 关闭说明
			 */
			growthValueClose() {
				this.growthValue = true;
			},
			/**
			 * 打开说明
			 */
			opHelp(index) {
				this.growthValue = false;
				this.illustrate = this.task[index].illustrate;
			},

			/**
			 * 计算百分比
			 */
			computedPercent(item) {
				let { complete_number, number } = item;
				if (complete_number == 0) {
					return 0
				} else if (complete_number >= number) {
					return 100
				} else {
					return parseInt((complete_number / number * 100))
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.swiper {
		height: 330rpx;
		margin-top: 30rpx;

		.swiper-item {
			height: 100%;
			border-radius: 14rpx;
			overflow: hidden;
			background-color: rgba(255, 255, 255, 0.5);
			transform: scale(0.9);
			transition: all 0.2s ease-in 0s;
			position: relative;
			padding: 0 30rpx;

			&.on {
				transform: none;
			}
		}
	}

	.header {
		height: calc(550rpx + var(--status-bar-height));
		background-image: linear-gradient(to bottom, rgb(90, 184, 127), rgba(90, 184, 127, 0.3));
	}

	.level-box {
		background-color: #000;
		position: absolute;
		color: #fff;
		top: 0;
		left: 0;
		width: 140rpx;
		height: 50rpx;
		padding-left: 20rpx;
		line-height: 50rpx;
		border-bottom-right-radius: 50rpx;
	}

	.level-box.red {
		background-color: #e40001;
	}

	.task-title {
		line-height: 1.7;
		font-size: 24rpx;
	}

	.task-title::before {
		content: "";
		width: 6rpx;
		height: 6rpx;
		display: block;
		background-color: #000;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.level-box2 {
		width: 220rpx;
		height: 156rpx;
		background-image: url(/static/images/level.png);
		background-size: 100%;
		background-repeat: no-repeat;
		margin-left: auto;
		position: absolute;
		transform: scale(0.9);
		top: 20rpx;
		right: 0;

		.text {
			position: absolute;
			width: 124rpx;
			height: 30rpx;
			text-align: center;
			top: 77rpx;
			left: 0;
			right: 0;
			margin: 0 auto;
			color: #000;
			font-size: 32rpx;
		}
	}

	.main {
		padding: 0 30rpx;
	}

	.task-box {
		position: relative;
		z-index: 20;
		margin-top: -50rpx;
		background-color: #fff;
		border-radius: 16rpx;
		padding-bottom: 40rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.05);
	}

	.task-list {
		margin-top: 10rpx;
		width: 570rpx;
	}

	.number {
		color: $red;
		font-size: 40rpx;
		width: 60rpx;
	}

	.item {
		.title {
			color: #000;
			font-size: 30rpx;
		}

		.desc {
			font-size: 26rpx;
			color: #999;
			margin-top: 4rpx;
		}

		&+& {
			margin-top: 32rpx;
		}
	}
</style>
