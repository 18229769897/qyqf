<template>
	<view>
		<view class='coupon-list' v-if="couponsList.length">
			<view class='item acea-row row-center-wrapper' v-for="(item,index) in couponsList" :key="index">
				<view class='money' :class='item.is_use ? "moneyGray" : "" '>
					<view>￥<text class='num'>{{item.coupon_price}}</text></view>
					<view class="pic-num">满{{item.use_min_price}}元可用</view>
				</view>
				<view class='text'>
					<view class='condition line1'>
					    <span class='line-title' :class='(item.is_use==true || item.is_use==2)?"gray":""' v-if='item.type===0'>通用劵</span>
					    <span class='line-title' :class='(item.is_use==true || item.is_use==2)?"gray":""' v-else-if='item.type===1'>品类券</span>
					    <span class='line-title' :class='(item.is_use==true || item.is_use==2)?"gray":""' v-else>商品券</span>
					    <span>{{item.title}}</span>
					</view>
					<view class='data acea-row row-between-wrapper'>
						<view>{{ item.start_time ? item.start_time + "-" : ""}}{{ item.end_time }}</view>
						<view class='bnt gray' v-if="item.is_use==true">已领取</view>
						<view class='bnt gray' v-else-if="item.is_use==2">已领完</view>
						<view class='bnt bg-color' v-else @click='getCoupon(item.id,index)'>立即领取</view>
					</view>
				</view>
			</view>
		</view>
		<view class='loadingicon acea-row row-center-wrapper' v-if="couponsList.length">
		     <text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
		  </view>
		<view class='noCommodity' v-else-if="!couponsList.length && loading==true">
			<view class='pictrue'>
				<image src='../../../static/images/noCoupon.png'></image>
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
		getCoupons,
		setCouponReceive
	} from '@/api/api.js';
	 import {
	 	mapGetters
	 } from "vuex";
	 import authorize from '@/components/Authorize';
		export default {
			components: {
				authorize
			},
			data() {
				return {
					couponsList: [],
					loading: false,
					loadend: false,
					loadTitle: '加载更多',//提示语
					page: 1,
					limit: 20,
					isAuto: false, //没有授权的不会自动授权
					isShowAuth: false //是否隐藏授权
				};
			},
			computed: mapGetters(['isLogin']),
			onLoad(){
				if(this.isLogin){
					// #ifdef H5
					this.getUseCoupons();
					// #endif
				}else{
                    this.isAuto = true;
                    this.isShowAuth = true
				}
			},
			 /**
			   * 页面上拉触底事件的处理函数
			   */
			  onReachBottom: function () {
			    this.getUseCoupons();
			  },
			methods: {
				onLoadFun(){
					this.isShowAuth = false;
					this.getUseCoupons();
				},
				// 授权关闭
				authColse:function(e){
					this.isShowAuth = e
				},
				 getCoupon:function(id,index){
				    let that = this;
				    let list = that.couponsList;
				    //领取优惠券
				    setCouponReceive(id).then(function (res) {
				      list[index].is_use = true;
					  that.$set(that,'couponsList',list);
				      that.$util.Tips({ title: '领取成功' });
				    },function(res){
				      return that.$util.Tips({title:res.msg});
				    });
				  },
				   /**
				     * 获取领取优惠券列表
				    */
				    getUseCoupons:function(){
				      let that=this
				      if(this.loadend) return false;
				      if(this.loading) return false;
				      getCoupons({ page: that.page, limit: that.limit }).then(res=>{
				        let list=res.data,loadend=list.length < that.limit;
				        let couponsList = that.$util.SplitArray(list, that.couponsList);
						that.$set(that,'couponsList',couponsList);
						that.loadend = loadend;
						that.loadTitle = loadend ? '我也是有底线的' : '加载更多';
						that.page = that.page + 1;
						that.loading = false;
				      }).catch(err=>{
						  that.loading = false;
						  that.loadTitle = '加载更多';
				      });
				    }
			}
		}
</script>

<style scoped>
	.condition .line-title{
	  width:90rpx;
	  padding: 0 10rpx;
	  box-sizing: border-box;
	  background:rgba(255,247,247,1);
	  border:1px solid rgba(232,51,35,1);
	  opacity:1;
	  border-radius:20rpx;
	  font-size:20rpx;
	  color: #E83323;
	  margin-right: 12rpx;
	}
	.condition .line-title.gray{
	  border-color:#BBB;
	  color:#bbb;
	  background-color:#F5F5F5;
	}
	.coupon-list .pic-num{
	  color: #FFFFFF;
	  font-size: 24rpx;
	}
</style>
