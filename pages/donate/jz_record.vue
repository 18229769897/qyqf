<template>
	<view class="page-box">
		<view class="list">
			<template v-for="item in list">
				<view class="item fx j-between a-end" :key="item.case_no">
					<view>
						<view>编号：{{item.case_no}}</view>
						<view>捐赠：{{item.score}}爱心积分</view>
						<view>受助人：{{item.user.phone | filterPhone}}</view>
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
	import { getDonateListApi } from "@/api/user.js"
	import { filterPhone } from "@/utils/filters.js"
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
		filters: {
			filterPhone,
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
					let { data: { list } } = await getDonateListApi(params, option);
					this.setList("list", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
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
		line-height: 1.7;
	}
</style>
