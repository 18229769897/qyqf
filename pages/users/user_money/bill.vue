<template>
	<view style="background-color:#FFFFFF;">
		<template v-for="(item,index) in userBillList">
			<view class='item' :key="index">
				<view class="probably">
					<view class="ellipsis">{{item.mark}}</view>
					<view class="gray">{{item.title}}</view>
					<view class="gray">{{item.create_time}}</view>
				</view>
				<view class="ml-auto" style="padding-right: 25rpx;">
					<view class='money' v-if="item.pm ==1">+{{item.number}}</view>
					<view class='money' v-else>-{{item.number}}</view>
				</view>
			</view>
		</template>
		<view class='loadingicon acea-row row-center-wrapper' v-if="userBillList.length>0">
			<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
		</view>
		<view v-if="userBillList.length == 0">
			<emptyPage title="暂无数据～"></emptyPage>
		</view>
	</view>
</template>

<script>
	import {
		getCommissionInfo
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	// #ifdef MP
	import authorize from '@/components/Authorize';
	// #endif
	import emptyPage from '@/components/emptyPage.vue'
	export default {
		components: {
			// #ifdef MP
			authorize,
			// #endif
			emptyPage
		},
		data() {
			return {
				map: {
					1: "余额明细",
					2: "补贴钱包明细",
					3: "红包积分明细",
					4: "焕际值明细",
					5: "消费积分明细",
					6: "爱心积分明细",
					7: "代理商钱包明细",
					8: "商户钱包明细",
					9: "商品积分明细",
					10: "焕际券明细",
					11: "嗨豆明细",
					12: "嗨票明细",
					13: "嗨券明细",
				},
				loadTitle: '加载更多',
				loading: false,
				loadend: false,
				page: 1,
				limit: 15,
				type: 0,
				userBillList: [],
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false //是否隐藏授权
			};
		},
		computed: mapGetters(['isLogin']),
		onLoad: function(options) {
			this.type = options.type;
			this.getUserBillList();
			this.$nextTick(() => {
				uni.setNavigationBarTitle({
					title: this.map[this.type]
				})
			})
		},
		watch: {
			type(val) {
				if (val != 0) {
					uni.setNavigationBarTitle({
						title: this.map[val]
					})
				}
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.getUserBillList();
		},
		methods: {
			/**
			 * 授权回调
			 */
			onLoadFun: function() {
				this.isShowAuth = false;
				this.getUserBillList();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 获取账户明细
			 */
			getUserBillList: function() {
				let that = this;
				if (that.loadend) return;
				if (that.loading) return;
				that.loading = true;
				that.loadTitle = "";
				let data = {
					page: that.page,
					limit: that.limit,
					type: that.type
				}
				getCommissionInfo(data).then(function(res) {
					let list = res.data.list;
					let loadend = list.length < that.limit;
					that.userBillList = that.$util.SplitArray(list, that.userBillList);
					that.$set(that, 'userBillList', that.userBillList);
					that.loadend = loadend;
					that.loading = false;
					that.loadTitle = loadend ? "已加载全部~" : "加载更多";
					that.page = that.page + 1;
				}, function(res) {
					that.loading = false;
					that.loadTitle = '加载更多';
				});
			},
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF !important;
		padding-left: 25rpx;
	}

	.item {
		display: flex;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #EEE;
	}

	.probably {
		line-height: 1.6;
	}

	.ml-auto {
		margin-left: auto;
	}

	.gray {
		color: #AAAAAA;
		font-size: 24rpx;
	}

	.money {
		color: #282828;
		font-size: 32rpx;
	}

	.ellipsis {
		font-size: 30rpx;
		max-width: 500rpx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		vertical-align: bottom;
	}
</style>