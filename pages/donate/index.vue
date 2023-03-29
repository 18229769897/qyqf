<template>
	<view class="page-box">
		<view class="fill-bg"></view>
		<headBar2 title="捐赠专区" white noText />
		<view class="list">
			<template v-for="item in list">
				<view class="item" :style="{'background-image':`url(${item.case_cover})`}"
					@click="toPage(`./detail?id=${item.declare_id}`)">
					<view class="content flex align-center">
						<view class="flex flex-col">
							<text class="fz_30">{{item.user.real_name}}</text>
							<view class="fz_24"> <text>{{item.user.sex}}</text> <text
									style="margin-left: 18rpx;">{{item.user.age}}岁</text>
							</view>
						</view>
						<view class="ellipsis2" style="width: 160rpx;margin-left: 20rpx;">{{item.disease_name}}</view>
						<view class="flex_1 flex flex-col fz_24" style="line-height: 1.2;padding-right: 20rpx;">
							<view>需捐赠：{{item.case_total_score}}爱心积分</view>
							<progressBar :value="computedProgress(item)" />
							<view>已获赠：{{item.case_donated_score}}爱心积分</view>
						</view>
					</view>
				</view>
			</template>
		</view>
		<loadMore :text="loadText" :state="loadState" />
		<view v-if="noData">
			<emptyPage title="暂无数据" />
		</view>

		<view class="footer flex align-center justify-between">
			<view class="flex flex-col flex-center" @click="toPage(`./shenbao_record`)">
				<image src="@/static/images/shenbao.png" style="width: 60rpx;" mode="widthFix"></image>
				<text>我的申报</text>
			</view>
			<view class="flex flex-col flex-center" @click="toPage(`./jz_record`)">
				<image src="@/static/images/juanzeng.png" style="width: 60rpx;" mode="widthFix"></image>
				<text>捐赠记录</text>
			</view>
			<view class="btn" @click="toPage(`./applyHelp`)">申请爱心捐赠</view>
		</view>
	</view>
</template>
<script>
	import paging from '@/mixins/paging.js'
	import { getCrowdApi } from "@/api/user.js"
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
			filterName(data) {
				return data.replace(/^(\S)\S+(\S)$/g, "$1*$2");
			}
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
					let { data: { list } } = await getCrowdApi(params, option);
					this.setList("list", list, option.first);
				} catch (e) {

				} finally {
					this.lockLoad = false;
				}
			},

			/**
			 * 计算捐赠百分比
			 */
			computedProgress(item) {
				return ((item.case_donated_score / item.case_total_score) * 100).toFixed(2)
			}
		},
		onReachBottom() {
			this.getList({ first: false });
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff !important;
		padding-bottom: 160rpx;
	}

	.fill-bg {
		position: fixed;
		z-index: 0;
		background-image: linear-gradient(to bottom, rgb(90, 184, 127), rgba(90, 184, 127, 0.2));
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
	}

	.list {
		width: 696rpx;
		padding-top: 30rpx;
		margin-left: auto;
		margin-right: auto;
		position: relative;
		z-index: 2;

		.item {
			width: 100%;
			height: 380rpx;
			border-radius: 14rpx;
			overflow: hidden;
			background-size: cover;
			background-repeat: no-repeat;
			position: relative;

			.content {
				position: absolute;
				background-color: rgba(0, 0, 0, 0.5);
				left: 0;
				right: 0;
				bottom: 0;
				height: 100rpx;
				color: #fff;
				padding: 0 30rpx;
			}
		}

		.item+.item {
			margin-top: 30rpx;
		}
	}

	.footer {
		height: 140rpx;
		position: fixed;
		z-index: 4;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0 40rpx 0 70rpx;
		background-color: #fff;
	}

	.btn {
		padding: 20rpx 30rpx;
		border-radius: 100px;
		color: #fff;
		background-image: linear-gradient(to right, #ff90af, #ffdbc4);
	}
</style>

<style scoped>
	/deep/ .head-fixed {
		background-color: transparent !important;
	}
</style>
