<template>
	<view>
		<view class='commission-details'>
			<view class='sign-record'>
				<block v-for="(item,index) in recordList" :key="index" v-if="recordList.length>0">
					<view class='list'>
						<view class='item'>
							<view class='listn'>
								<view class='itemn acea-row row-between-wrapper'
									style="height:auto;box-sizing: content-box; padding-bottom: 10rpx;padding-top:20rpx;">
									<view>
										<view class='name line1' v-if="item.extract_type == 0">结算到银行卡</view>
										<view class='name line1' v-if="item.extract_type == 1">结算到微信</view>
										<view class='name line1' v-if="item.extract_type == 2">结算到支付宝</view>
										<view class='name line1' v-if="item.extract_type == 3">结算到现金钱包</view>

										<!-- 商户或代理商提现到银行卡， extract_type等于4-->
										<view class='name line1' v-if="item.extract_type == 4">结算到银行卡</view>

										<template v-if="item.status==1">
											<!-- <view class='name line1 succ' v-if="item.extract_type == 0 && item.bank_status==1">结算成功</view>
											<view class='name line1 succ' v-if="item.extract_type != 0">结算成功</view> -->
											<view class='name line1 succ'>结算成功</view>
										</template>
										<template v-if="item.status==0">
											<view class='name line1'>审核中</view>
										</template>
										<template v-if="item.status==-1">
											<view class='name line1 fail' style="width: auto;">
												<view>审核失败，金额已退回</view>
												<text class="message">({{item.fail_msg}})</text>
											</view>
										</template>
										<view style="margin-top: 14rpx;">{{item.create_time}}</view>
									</view>
									<view style="color: #282828;font-size: 32rpx;">￥{{item.extract_price}}</view>
								</view>
							</view>
						</view>
					</view>
				</block>
				<loadMore :text="loadText" :state="loadState" />
				<view v-if="recordList.length == 0">
					<emptyPage title='暂无结算记录~'></emptyPage>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCommissionInfo,
		spreadCount,
		getSpreadInfo,
		extractLst,
		brokerage_list,
		spreadInfo
	} from '@/api/user.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import paging from '@/mixins/paging.js'
	export default {
		data() {
			return {
				name: '',
				limit: 12,
				recordList: [],
				recordCount: 0,
				status: false,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				extractCount: 0,
				userInfo: '',
				type: "",
				map: {
					1: "收益钱包结算记录",
					2: "现金钱包结算记录",
					3: "商户钱包结算记录",
					5: "捐赠结算记录",
					6: "代理商结算记录",
				}
			};
		},
		mixins: [paging],
		computed: mapGetters(['isLogin']),
		onLoad(options) {
			this.type = options.type;
			this.spreadInfo();
			this.getRecordList();
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
		methods: {
			spreadInfo() {
				spreadInfo({
					type: this.type
				}).then(res => {
					this.userInfo = res.data
				});
			},
			onLoadFun() {
				this.isShowAuth = false;
				this.getRecordList();
				// this.getRecordListCount();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			async getRecordList(options = {}) {
				let opt = {
					first: true,
					...options
				}
				let params = {
					page: this.page,
					limit: this.limit,
					type: this.type
				}
				let { data: { count, list } } = await extractLst(params);
				if (opt.first) {
					this.recordList = list;
					this.noData = count == 0;
					this.count = count;
				} else {
					this.recordList = this.recordList.concat(list)
				}
			},
			getRecordListCount: function() {
				let that = this;
				getSpreadInfo().then(res => {
					that.recordCount = res.data.commissionCount;
					that.extractCount = res.data.extractCount;
				});
			}
		},
		onReachBottom() {
			if (this.recordList.length >= this.count) {
				this.loadState = 2;
				return
			}
			this.loadState = 1;
			this.page++;
			this.getRecordList({ first: false });
		}
	}
</script>

<style scoped lang="scss">
	.message {
		font-size: 18rpx;
		color: #0f734f;
	}

	.succ {
		color: #19be6b !important;
	}

	.fail {
		color: #fa3534 !important;
	}
</style>
