<template>
	<view class="page-box">
		<view class="list">
			<template v-for="item in list">
				<view class="item fx j-between a-end" @click="toDetail(item)">
					<view>
						<view>疾病名称：{{item.disease_name}}</view>
						<view>申报数量：{{parseInt(item.remainder_cost)}}爱心积分</view>
						<view>状态：{{item.status_text}}</view>
						<view v-if="item.status==2">驳回原因：{{item.reason}}</view>
						<view v-if="item.status==1">是否上架：{{item.is_show?"已上架":"已下架"}}</view>
					</view>
					<view>{{item.create_time}}</view>
				</view>
			</template>
		</view>
		<loadMore :text="loadText" :state="loadState" />
		<view v-if="noData">
			<emptyPage title="暂无数据~"></emptyPage>
		</view>
	</view>
</template>
<script>
	import paging from '@/mixins/paging.js'
	import { myDeclareApi } from "@/api/user.js"
	export default {
		data() {
			return {
				list: [],
			}
		},
		mixins: [paging],
		onLoad() {
			this.getList();
		},
		methods: {
			async getList(options = {}) {
				let option = {
					loading: true,
					first: true,
					...options,
				}
				if (option.first) {
					this.page = 1;
					this.loadState = 0;
				}
				if (this.lockLoad || this.loadState == 2) return;
				this.lockLoad = true;
				let params = {
					page: this.page,
					limit: this.limit,
				}
				try {
					let { data: { list } } = await myDeclareApi(params, option);
					this.setList("list", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
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
		},
		onReachBottom() {
			this.getList({ first: false });
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
