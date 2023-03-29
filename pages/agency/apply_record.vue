<template>
	<view class="page-box">
		<view class="list">
			<template v-for="item in list">
				<view class="item fx j-between a-end">
					<view>
						<view>代理类型：{{map[item.agentLevel]}}</view>
						<view>状态：{{ map2[item.status] }}</view>
						<view v-if="item.status==2">驳回原因：{{item.reason}}</view>
					</view>
					<view>{{item.createTime | date("yyyy-mm-dd hh:MM:ss")}}</view>
				</view>
			</template>
		</view>
		<view v-if="noData">
			<emptyPage title="暂无数据~"></emptyPage>
		</view>
	</view>
</template>
<script>
	import { getApplyRecord } from "@/api/javaApi.js"
	export default {
		data() {
			return {
				list: [],
				noData: false,
				map: {
					1: "省代理",
					2: "市代理",
					3: "区代理",
					4: "街道代理",
				},
				map2: {
					0: "审核中",
					1: "审核成功",
					2: "审核失败"
				}
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			async getList() {
				try {
					let { data } = await getApplyRecord();
					this.list = data;
					this.noData = this.list.length == 0;
				} catch (e) {
					console.log(e);
				} finally {

				}
			},
			toDetail(item) {
				if (item.status == 0 || item.status == 2) {
					uni.navigateTo({
						url: `./shenbao_detail?id=${item.declare_id}`
					})
				} else if (item.status == 1 || item.status == 3) {
					uni.navigateTo({
						url: `./detail?id=${item.declare_id}`
					})
				}
			},
		}
	}
</script>

<style>
	@import url("/static/css/common.css");

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
