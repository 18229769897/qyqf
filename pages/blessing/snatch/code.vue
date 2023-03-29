<template>
	<view>
		<template v-for="(item,index) in list">
			<view class="item">
				<view class="fx j-between a-center">
					<view>第{{item.number}}期</view>
					<view v-if="item.opening_time" style="font-size: 24rpx; color: #AAAAAA;">开奖时间：{{item.opening_time}}</view>
				</view>
				<view class="fx flex-wrap j-between">
					<template v-for="(item2,index2) in item.code_numbers">
						<view class="text" v-if="index2<19">{{item2}}</view>
						<view class="text" v-else-if="item.openAll">
							{{item2}}
						</view>
					</template>
					<view class="text control" v-if="item.code_numbers && item.code_numbers.length>18" @click="cutShowStatus(index)">
						{{item.openAll?"收起":"展开全部"}}
					</view>
					<view class="text h0"></view>
					<view class="text h0"></view>
					<view class="text h0"></view>
				</view>
			</view>
		</template>
		<foot :text="loadText" :state="loadState"></foot>
		<view v-if="noData">
			<emptyPage title="暂无数据"></emptyPage>
		</view>
	</view>
</template>

<script>
	import paging from '@/mixins/paging.js'
	import { myCodeApi } from "@/api/snatch.js"
	export default {
		data() {
			return {
				list: [],
				pid:""
			}
		},
		mixins: [paging],
		onLoad(options) {
			this.pid = options.pid;
			this.getList();
		},
		methods: {
			async getList(options = {}) {
				let opt = {
					first: true,
					...options,
				}
				let params = {
					page: this.page,
					limit: this.limit,
					product_id:this.pid
				}
				let { data: { count, list } } = await myCodeApi(params)
				if (opt.first) {
					this.list = list.map(item => ({
						...item,
						openAll: item.code_numbers.length < 19
					}));
					this.noData = count == 0;
					this.count = count;
				} else {
					let temp = list.map(item => ({
						...item,
						openAll: item.code_numbers.length < 19
					}))
					this.list = this.list.concat(temp);
				}
			},
			cutShowStatus(index) {
				this.list[index].openAll = !this.list[index].openAll;
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

<style>
	@import url("/static/css/common.css");

	page {
		background-color: #FFFFFF;
		padding: 30rpx 30rpx 0;
	}

	.item {
		background: #FFFFFF;
		box-shadow: 0px 2rpx 12rpx rgba(0, 0, 0, 0.06);
		border-radius: 20rpx;
		padding: 32rpx 32rpx 14rpx;
	}

	.item+.item {
		margin-top: 30rpx;
	}

	.text {
		width: 134rpx;
		margin-top: 22rpx;
	}

	.text.control {
		font-size: 27rpx;
		color: #AAAAAA
	}

	.h0 {
		height: 0;
	}
</style>
