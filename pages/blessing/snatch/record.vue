<template>
	<view>
		<tui-tab :tabs="tabs" :size="30" bold color="#777777" selectedColor="#0f734f" isFixed sliderBgColor="#0f734f"
			@change="change"></tui-tab>
		<view class="container">
			<template v-for="item in list">
				<view class="item fx" :key="item.record_id" @click="toDetail(item)">
						<image :src="item.period.product_img" style="width: 182rpx;height: 182rpx;"></image>
						<view style="margin-left: 20rpx;">
							<view style="color: #333333; font-size: 30rpx;margin-bottom: 14rpx;">
								{{item.period.product_name}}
							</view>
							<view class="text">
								参与期号: <text style="color: #0f734f;">{{item.period.number}}</text>
							</view>
							<view class="text">夺宝码数量：{{item.num}}</view>
						</view>

					<view class="db_status_btn" v-if="!item.period.opening_time">夺宝进行中</view>
					<template v-else>
						<view class="kj_status_btn" v-if="!item.is_ok">未中奖，再来一局</view>
						<view class="kj_status_btn" v-if="item.is_ok && !item.status"
							@click="toPage(`/pages/blessing/snatch/orderInfo?type=1&record_id=${item.record_id}`)">
							中奖啦，立即领取
						</view>

						<view class="kj_status_btn disabled" v-if="item.is_ok && item.status">
							已领取奖品
						</view>
					</template>
				</view>
			</template>
			<foot :text="loadText" :state="loadState"></foot>
			<view v-if="noData">
				<emptyPage title="暂无数据~"></emptyPage>
			</view>
		</view>
	</view>
</template>
<script>
	import paging from '@/mixins/paging.js'
	import { buyRecordApi } from "@/api/snatch.js"
	export default {
		data() {
			return {
				tabs: ["全部", "待开奖", "已开奖"],
				list: [],
				tabIndex: 0
			}
		},
		mixins: [paging],
		onShow() {
			this.getList();
		},
		methods: {

			toDetail(item) {
				if (!item.period.opening_time) {
					this.toPage(
						`/pages/blessing/snatch/info?period_id=${item.period_id}&product_id=${item.period.product_id}`)
				}
			},

			change({ index }) {
				this.tabIndex = index;
				this.page = 1;
				this.loadState = 0;
				this.getList()
			},
			async getList(options = {}) {
				let opt = {
					first: true,
					...options,
				}
				let params = {
					page: this.page,
					limit: this.limit,
					is_open: this.tabIndex
				}

				let { data: { count, list } } = await buyRecordApi(params);
				if (opt.first) {
					this.list = list;
					this.noData = count == 0;
					this.count = count;
				} else {
					this.list = this.list.concat(list);
				}
			}
		},
		onReachBottom() {
			if (this.list.length >= this.count) {
				this.loadState = 2;
				return
			}
			this.loadState = 1;
			this.page++;
			this.getList({ first: false });
		}
	}
</script>

<style lang="scss">
	@import url("/static/css/common.css");

	.container {
		padding: 60px 30rpx 0 30rpx;
	}

	.item {
		height: 246rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		position: relative;
		overflow: hidden;
		padding: 25rpx;
	}

	.item+.item {
		margin-top: 25rpx;
	}

	.text {
		color: #777777;
		line-height: 1.7;
		font-size: 26rpx;
	}

	.db_status_btn {
		position: absolute;
		width: 156rpx;
		height: 40rpx;
		background: $theme;
		border-radius: 30px 0px 0px 30px;
		text-align: center;
		line-height: 40rpx;
		color: #FFFFFF;
		right: 1rpx;
		top: calc(50% - 20rpx);
		font-size: 24rpx;
	}

	.kj_status_btn {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		width: 232rpx;
		height: 48rpx;
		background: #0f734f;
		border-radius: 50px;
		text-align: center;
		line-height: 48rpx;
		color: #FFFFFF;
		font-size: 24rpx;
	}
</style>
