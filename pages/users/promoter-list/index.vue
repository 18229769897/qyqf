<template>
	<view :style="viewColor">
		<view class="promoter-list">
			<view class='promoterHeader'>
				<view class='headerCon acea-row row-between-wrapper'>
					<view>
						<view class='name'>推广人数</view>
						<view><text class='num'>{{userInfo.spread_total}}</text>人</view>
					</view>
					<view class='iconfont icon-tuandui'></view>
				</view>
			</view>
			<!-- <view class='nav acea-row row-around'>
				<view :class="grade == 0 ? 'item on' : 'item'" @click='setType(0)'>一级({{userInfo.one_level_count}})</view>
				<view :class="grade == 1 ? 'item on' : 'item'" @click='setType(1)'>二级({{userInfo.two_level_count}})</view>
			</view> -->
			<view class='search acea-row row-between-wrapper'>
				<view class='input'><input placeholder='点击搜索会员名称' placeholder-class='placeholder' v-model="keyword" @confirm="submitForm" confirm-type='search' name="search"></input></view>
				<button class='iconfont icon-sousuo2' @click="submitForm"></button>
			</view>
			<view class='list'>
				<view class="sortNav acea-row row-middle">	
					<view class="sortItem" @click='setSort("spread_count ASC")' v-if="sort == 'spread_count DESC'">团队排序
						<image :src="domain+'/static/diy/sort1'+keyColor+'.png'"></image>
					</view>
					<view class="sortItem" @click='setSort("")' v-else-if="sort == 'spread_count ASC'">团队排序
						<image :src="domain+'/static/diy/sort3'+keyColor+'.png'"></image>
					</view>
					<view class="sortItem" @click='setSort("spread_count DESC")' v-else>团队排序
						<image src="/static/images/sort2.png"></image>
					</view>
					<view class="sortItem" @click='setSort("pay_price ASC")' v-if="sort == 'pay_price DESC'">金额排序
						<image :src="domain+'/static/diy/sort1'+keyColor+'.png'"></image>
					</view>
					<view class="sortItem" @click='setSort("")' v-else-if="sort == 'pay_price ASC'">金额排序
						<image :src="domain+'/static/diy/sort3'+keyColor+'.png'"></image>
					</view>
					<view class="sortItem" @click='setSort("pay_price DESC")' v-else>金额排序
						<image src="/static/images/sort2.png"></image>
					</view>
					<view class="sortItem" @click='setSort("pay_count ASC")' v-if="sort == 'pay_count DESC'">订单排序
						<image :src="domain+'/static/diy/sort1'+keyColor+'.png'"></image>
					</view>
					<view class="sortItem" @click='setSort("")' v-else-if="sort == 'pay_count ASC'">订单排序
						<image :src="domain+'/static/diy/sort3'+keyColor+'.png'"></image>
					</view>
					<view class="sortItem" @click='setSort("pay_count DESC")' v-else>订单排序
						<image src="/static/images/sort2.png"></image>
					</view>
				</view>
				<block v-for="(item,index) in recordList" :key="index">
					<view class='item acea-row row-between-wrapper'>
						<view class="picTxt acea-row row-between-wrapper">
							<view class='pictrue'>
								<image :src='item.avatar ? item.avatar : "/static/images/f.png"'></image>
							</view>
							<view class='text'>
								<view class='name line1'>{{item.nickname}}</view>
								<view>加入时间: {{item.spread_time}}</view>
							</view>
						</view>
						<view class="right">
							<view><text class='num t-color'>{{item.spread_count ? item.spread_count : 0}}</text>人</view>
							<view><text class="num">{{item.pay_count ? item.pay_count : 0}}</text>单</view>
							<view><text class="num">{{item.pay_price ? item.pay_price : 0}}</text>元</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
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
	import {
		spreadPeople,
		getUserInfo,
		spreadInfo
	} from '@/api/user.js';
	import { mapGetters } from "vuex";
	import authorize from '@/components/Authorize';
	import { HTTP_REQUEST_URL } from '@/config/app';
	export default {
		components: {
			authorize
		},
		data() {
			return {
				domain: HTTP_REQUEST_URL,
				total: 0,
				totalLevel: 0,
				teamCount: 0,
				page: 1,
				limit: 20,
				keyword: '',
				sort: '',
				grade: 0,
				status: false,
				recordList: [],
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				userInfo:{}
			};
		},
		computed: mapGetters(['isLogin','viewColor','keyColor']),
		onLoad() {
			if (this.isLogin) {
				this.userSpreadNewList();
				this.getUserInfo()
			} else {
                this.isAuto = true;
                this.isShowAuth = true
			}
		},
		onShow: function() {
			if (this.is_show){
				this.userSpreadNewList();
				this.getUserInfo();
			}
		},
		onHide: function() {
			this.is_show = true;
		},
		methods: {
			getUserInfo(){
				spreadInfo().then(res => {
					this.userInfo = res.data
				});
			},
			onLoadFun: function(e) {
				this.isShowAuth = false;
				this.userSpreadNewList();
				this.getUserInfo()
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			setSort: function(sort) {
				let that = this;
				that.sort = sort;
				that.page = 1;
				that.limit = 20;
				that.status = false;
				that.$set(that, 'recordList', []);
				that.userSpreadNewList();
			},
			// setKeyword: function(e) {
			// 	this.keyword = e.detail.value;
			// },
			submitForm: function() {
				this.page = 1;
				this.limit = 20;
				this.status = false;
				this.$set(this, 'recordList', []);
				this.userSpreadNewList();
			},

			setType: function(grade) {
				if (this.grade != grade) {
					this.grade = grade;
					this.page = 1;
					this.limit = 20;
					this.keyword = '';
					this.sort = '';
					this.status = false;
					this.$set(this, 'recordList', []);
					this.userSpreadNewList();
				}
			},
			userSpreadNewList: function() {
				let that = this;
				let page = that.page;
				let limit = that.limit;
				let status = that.status;
				let keyword = that.keyword;
				let sort = that.sort;
				let grade = that.grade;
				let recordList = that.recordList;
				let recordListNew = [];
				if (status == true) return;
				spreadPeople({
					page: page,
					limit: limit,
					keyword: keyword,
					level: grade+1,
					sort: sort,
				}).then(res => {
					let len = res.data.list.length;
					let recordListData = res.data.list;
					recordListNew = recordList.concat(recordListData);
					that.total = res.data.total;
					that.totalLevel = res.data.totalLevel;
					that.teamCount = that.$util.$h.Add(Number(res.data.total), Number(res.data.totalLevel));
					that.status = limit > len;
					that.page = page + 1;
					that.$set(that, 'recordList', recordListNew);
				});
			}
		},
		onReachBottom: function() {
			this.userSpreadNewList();
		}
	}
</script>

<style scoped lang="scss">
	.promoterHeader {
		background-image: linear-gradient(to right, var(--view-bntColor21) 0%, var(--view-bntColor22) 100%);
	}
	.t-color {
		color: var(--view-theme);
	}
	.promoter-list .nav {
		background-color: #fff;
		height: 86rpx;
		line-height: 86rpx;
		font-size: 28rpx;
		color: #282828;
		border-bottom: 1rpx solid #eee;
	}

	.promoter-list .nav .item.on {
		border-bottom: 5rpx solid var(--view-theme);
		color: var(--view-theme);
	}

	.promoter-list .search {
		width: 100%;
		background-color: #fff;
		height: 86rpx;
		padding-left: 30rpx;
		box-sizing: border-box;
	}

	.promoter-list .search .input {
		width: 610rpx;
		height: 60rpx;
		border-radius: 50rpx;
		background-color: #f5f5f5;
		text-align: center;
		position: relative;
	}

	.promoter-list .search .input input {
		height: 100%;
		font-size: 26rpx;
		width: 610rpx;
		text-align: center;
	}

	.promoter-list .search .input .placeholder {
		color: #bbb;
	}

	.promoter-list .search .input .iconfont {
		position: absolute;
		right: 28rpx;
		color: #999;
		font-size: 28rpx;
		top: 50%;
		transform: translateY(-50%);
	}

	.promoter-list .search .iconfont {
		font-size: 45rpx;
		color: #515151;
		width: 110rpx;
		height: 60rpx;
		line-height: 60rpx;
	}

	.promoter-list .list {
		margin-top: 12rpx;
	}

	.promoter-list .list .sortNav {
		background-color: #fff;
		height: 76rpx;
		border-bottom: 1rpx solid #eee;
		color: #333;
		font-size: 28rpx;
	}

	.promoter-list .list .sortNav .sortItem {
		text-align: center;
		flex: 1;
	}

	.promoter-list .list .sortNav .sortItem image {
		width: 24rpx;
		height: 24rpx;
		margin-left: 6rpx;
		vertical-align: -3rpx;
	}

	.promoter-list .list .item {
		background-color: #fff;
		border-bottom: 1rpx solid #eee;
		height: 152rpx;
		padding: 0 30rpx 0 20rpx;
		font-size: 24rpx;
		color: #666;
	}

	.promoter-list .list .item .picTxt {
		width: 440rpx;
	}

	.promoter-list .list .item .picTxt .pictrue {
		width: 106rpx;
		height: 106rpx;
		border-radius: 50%;
	}

	.promoter-list .list .item .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 3rpx solid #fff;
		box-shadow: 0 0 10rpx #aaa;
		box-sizing: border-box;
	}

	.promoter-list .list .item .picTxt .text {
		width: 304rpx;
		font-size: 24rpx;
		color: #666;
	}

	.promoter-list .list .item .picTxt .text .name {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 13rpx;
	}

	.promoter-list .list .item .right {
		width: 240rpx;
		text-align: right;
		font-size: 22rpx;
		color: #333;
	}

	.promoter-list .list .item .right .num{
		margin-right: 7rpx;
	}
</style>
