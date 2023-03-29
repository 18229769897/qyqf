<template>
	<view class="page-box">
		<view class="list">
			<template v-for="item in list">
				<view class="item fx j-between a-end">
					<view>
						<view>商户名称：{{item.mer_name}}</view>
						<view>状态：{{ map2[item.status] }}</view>
						<view v-if="item.status==2">驳回原因：{{item.mark}}</view>
					</view>
					<view>{{item.create_time}}</view>
				</view>
			</template>
		</view>
		<view v-if="noData">
			<emptyPage title="暂无数据~"></emptyPage>
		</view>
	</view>
</template>
<script>
	import { shopApplyRecordApi } from "@/api/user.js"
	export default {
		data() {
			return {
				list: [],
				noData: false,
				map2: {
					0: "审核中",
					1: "审核成功",
					2: "审核驳回"
				}
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			async getList() {
				try {
					let { data: { list } } = await shopApplyRecordApi();
					this.list = list;
					this.noData = list.length == 0;
				} catch (e) {

				} finally {

				}
			},
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}

	.page-box {
		padding-left: 20rpx;

	}

	.item {
		padding: 50rpx 28rpx 20rpx 0;
		border-bottom: 1rpx solid #EEEEEE;
		line-height: 1.8;
	}
</style>
