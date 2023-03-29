<template>
	<view class="time" :style="justifyLeft+'background-color:'+ bgColor +';color:'+ colors +';'">
		<text class="red" v-if="tipText">{{ tipText }}</text>
		<text class="styleAll" v-if="isDay === true">{{ day }}</text>
		<text class="timeTxt red" v-if="dayText">{{ dayText }}</text>
		<text class="styleAll">{{ hour }}</text>
		<text class="timeTxt red" v-if="hourText">{{ hourText }}</text>
		<text class="styleAll">{{ minute }}</text>
		<text class="timeTxt red" v-if="minuteText">{{ minuteText }}</text>
		<text class="styleAll">{{ second }}</text>
		<text class="timeTxt red" v-if="secondText">{{ secondText }}</text>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------

	export default {
		name: "countDown",
		props: {
			justifyLeft: {
				type: String,
				default: ""
			},
			//距离开始提示文字
			tipText: {
				type: String,
				default: "倒计时"
			},
			dayText: {
				type: String,
				default: "天"
			},
			hourText: {
				type: String,
				default: "时"
			},
			minuteText: {
				type: String,
				default: "分"
			},
			secondText: {
				type: String,
				default: "秒"
			},
			datatime: {
				type: Number,
				default: 0
			},
			isDay: {
				type: Boolean,
				default: true
			},
			id:{
				type: String | Number,
				default: ""
			},
			bgColor:{
				type: String,
				default: ""
			},
			colors:{
				type: String,
				default: ""
			}
		},
		data: function() {
			return {
				day: "00",
				hour: "00",
				minute: "00",
				second: "00"
			};
		},
		created: function() {
			this.show_time();
		},
		mounted: function() {},
		methods: {
			show_time: function() {
				let that = this;

				function runTime() {
					//时间函数
					let intDiff = that.datatime - Date.parse(new Date()) / 1000; //获取数据中的时间戳的时间差；
					let day = 0,
						hour = 0,
						minute = 0,
						second = 0;
					if (intDiff > 0) {
						//转换时间
						if (that.isDay === true) {
							day = Math.floor(intDiff / (60 * 60 * 24));
						} else {
							day = 0;
						}
						hour = Math.floor(intDiff / (60 * 60)) - day * 24;
						minute = Math.floor(intDiff / 60) - day * 24 * 60 - hour * 60;
						second =
							Math.floor(intDiff) -
							day * 24 * 60 * 60 -
							hour * 60 * 60 -
							minute * 60;
						if (hour <= 9) hour = "0" + hour;
						if (minute <= 9) minute = "0" + minute;
						if (second <= 9) second = "0" + second;
						that.day = day;
						that.hour = hour;
						that.minute = minute;
						that.second = second;
					} else {
						that.day = "00";
						that.hour = "00";
						that.minute = "00";
						that.second = "00";
						clearInterval(runTime)
						uni.$emit('endTime',that.id)
					}
				}
				runTime();
				setInterval(runTime, 1000);
			}
		}
	};
</script>

<style>
	.time{
		display: flex;
		justify-content: center;
	} 
	.styleAll {
		padding: 0 6rpx;
		color: var(--view-theme);
		border-radius: 2rpx;
		background-color: var(--view-minorColor);
	}
	.red{
		margin: 0 4rpx;
		
	}
</style>
