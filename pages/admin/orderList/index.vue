<template>
	<view class="pos-order-list" ref="container">
		<view class="nav acea-row row-around row-middle">
			<view class="item" :class="where.status == 1 ? 'on' : ''" @click="changeStatus(1)">
				待付款
			</view>
			<view class="item" :class="where.status == 2 ? 'on' : ''" @click="changeStatus(2)">
				待发货
			</view>
			<view class="item" :class="where.status == 3 ? 'on' : ''" @click="changeStatus(3)">
				待收货
			</view>
			<view class="item" :class="where.status == 4 ? 'on' : ''" @click="changeStatus(4)">
				待评价
			</view>
			<view class="item" :class="where.status == 5 ? 'on' : ''" @click="changeStatus(5)">
				已完成
			</view>
			<view class="item" :class="where.status == 6 ? 'on' : ''" @click="changeStatus(6)">
				退款
			</view>
		</view>
			<view class="list">
				<view class="item" v-for="(item, index) in list" :key="index">
					<view class="order-num acea-row row-middle">
						<text v-if="item.activity_type != 0" class="activity_type">
							{{ item.activity_type == 1 ? '秒杀' : item.activity_type == 2 ? '预售' : item.activity_type == 3 ? '助力' : item.activity_type == 4 ? '拼团' : item.activity_type == 10 ? '套餐' :'' }}
						</text>
						订单号：{{ item.order_sn }}
						<span class="time">下单时间：{{ item.create_time }}</span>
					</view>
					<view class="pos-order-goods" v-for="(val, key) in item.orderProduct" :key="key" @click="toDetail(item)">
						<view class="goods acea-row row-between-wrapper">
							<view class="picTxt acea-row row-between-wrapper">
								<view class="pictrue">
									<image :src="val.cart_info.product.image" />
								</view>
								<view class="text acea-row row-between row-column">
									<view class="info line2">
										{{ val.cart_info.product.store_name }}
									</view>
									<view class="attr" v-if="val.cart_info.productAttr.sku">
										{{ val.cart_info.productAttr.sku }}
									</view>
								</view>
							</view>
							<view class="money">
								<view class="x-money">￥{{ val.cart_info.productAttr.price }}</view>
								<view class="num">x{{ val.product_num }}
									<text class="font-color refund_num" v-if="val.product_num-val.refund_num>0">(-{{val.product_num-val.refund_num}})</text>
								</view>
								<view class="y-money">
									￥{{ val.cart_info.productAttr.ot_price }}
								</view>
							</view>
						</view>
					</view>
					<view class="public-total">
						共{{ item.total_num }}件商品，
						<span v-if="where.status <= 1">应</span>
						<span v-else>已</span>
						支付
						<span class="money">￥{{ item.pay_price }}</span> (邮费 ¥{{ item.total_postage}})
					</view>
					<view class="operation acea-row row-between-wrapper">
						<view class="more">
						</view>
						<view class="acea-row row-middle">
							<view class="bnt" @click="modify(item, 0)" v-if="where.status == 1 && item.activity_type != 2">
								一键改价
							</view>
							<view class="bnt" @click="modify(item, 1)">订单备注</view>
							<navigator class="bnt bnt_color" v-if="where.status == 2" :url="'/pages/admin/delivery/index?id='+item.order_id+'&merId='+merId">去发货
							</navigator>
						</view>
					</view>
				</view>
			</view>
			<Loading :loaded="loaded" :loading="loading"></Loading>
	
		<view v-if="!loading && list.length <= 0" class="nothing">
			<image src="/static/images/no_thing.png" mode="widthFix"></image>
			<view class="nothing_text">暂无订单~</view>
		</view>
		<PriceChange :change="change" :orderInfo="orderInfo" v-on:closechange="changeclose($event)" v-on:savePrice="savePrice"
		 :status="status"></PriceChange>
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
		getOrderList,
		setAdminOrderPrice,
		setAdminOrderRemark,
		setOfflinePay,
		setOrderRefund
	} from "@/api/admin";
	import Loading from '@/components/Loading/index'
	import PriceChange from '@/components/PriceChange/index'
	import { isMoney } from '@/utils/validate.js'
	export default {
		name: "AdminOrderList",
		components: {
			Loading,
			PriceChange
		},
		data() {
			return {
				current: "",
				change: false,
				types: 1,
				where: {
					page: 1,
					limit: 10,
					status: 1
				},
				list: [],
				loaded: false,
				loading: false,
				orderInfo: {},
				status: "",
				merId: ''
			};
		},
		watch: {
			"$route.params.types": function(newVal) {
				let that = this;
				if (newVal != undefined) {
					that.where.status = newVal;
					that.init();
				}
			},
			types: function() {
				this.getIndex();
			}
		},
		onLoad(option) {
			this.where.status = option.types
			this.current = "";
			this.merId = option.merId;
			this.getIndex();
		},	
		// onShow: function(){
		// 	this.loading = this.loaded = false;
		// 	this.where.page = 1
		// 	this.list = []
		// 	this.getIndex();
		// },
		methods: {
			// 获取数据
			getIndex() {
				let that = this;
				if (that.loading || that.loaded) return;
				that.loading = true;
				getOrderList(that.where, that.merId).then(
					res => {
						that.loading = false;
						that.loaded = res.data.list.length < that.where.limit;
						that.list.push.apply(that.list, res.data.list);
						that.where.page = that.where.page + 1;
					},
					err => {
						that.$util.Tips({title: err});
					}
				);
			},
			// 初始化
			init: function() {
				this.list = [];
				this.where.page = 1;
				this.loaded = false;
				this.loading = false;
				this.getIndex();
				this.current = "";
			},
			// 导航切换
			changeStatus(val) {
				if (this.where.status != val) {
					this.where.status = val;
					this.init();
				}
			},
			// 商品操作
			modify: function(item, status) {
				let temp = status.toString()
				this.change = true;
				this.orderInfo = item;
				this.status = temp;
			},
			changeclose: function(msg) {
				this.change = msg;
			},
			async savePrice(opt) {
				let that = this,
					data = {},
					price = opt.orderInfo.pay_postage,
					refund_price = opt.refund_price,
					refund_status = that.orderInfo.refund_status,
					remark = opt.remark;
					let parmas = {
						 pay_postage: opt.orderInfo.pay_postage,
						 coupon_price: opt.orderInfo.coupon_price,
						 total_price: Number(opt.orderInfo.total_price)
					}
				let id = that.orderInfo.order_id;
				if (that.status == 0) {
					if(!isMoney(opt.orderInfo.pay_postage || opt.orderInfo.total_price)){
						return that.$util.Tips({title: '请输入正确的金额'});
					}
					data.pay_price = price;
					setAdminOrderPrice(this.merId,id,parmas).then(
						function() {
							that.change = false;
							that.$util.Tips({
								title:'改价成功',
								icon:'success'
							})
							that.init();
						},
						function(res) {
							that.change = false;
							that.$util.Tips({
								title:res,
								icon:'none'
							})
						}
					);
				} else {					
					if(!remark){
						return this.$util.Tips({
							title:'请输入备注'
						})
					}
					setAdminOrderRemark(this.merId,id, {remark: remark}).then(
						res => {
							that.change = false;
							this.$util.Tips({
								title:res.message,
								icon:'success'
							})
							that.init();
						},
						err => {
							that.change = false;
							that.$util.Tips({title: err});
						}
					);
				}
			},
			toDetail(item){
				uni.navigateTo({
					url:`/pages/admin/orderDetail/index?id=${item.order_id}&mer_id=${item.mer_id}`
				})
			}
		},
		onReachBottom() {
			this.getIndex()
		}
	}
</script>

<style>
	.pos-order-list .nav {
		width: 100%;
		height: 96upx;
		background-color: #fff;
		font-size: 30upx;
		color: #282828;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
	}

	.pos-order-list .nav .item.on {
		color: #2291f8;
	}

	.pos-order-list .list {
		margin-top: 120upx;
	}

	.pos-order-list .list .item {
		background-color: #fff;
		width: 100%;
	}

	.pos-order-list .list .item~.item {
		margin-top: 24upx;
	}
	.pos-order-list .list .activity_type {
		display: inline-block;
		color: #E93323;
		font-size: 20rpx;
		text-align: center;
		border-radius: 5rpx;
		padding: 0 4rpx;
		line-height: 28rpx;
		margin-right: 8rpx;
		border: 1rpx solid #E93323;
	}
	.pos-order-list .list .item .order-num {
		height: 124upx;
		border-bottom: 1px solid #eee;
		font-size: 30upx;
		font-weight: bold;
		color: #282828;
		padding: 0 30upx;
	}
	.pos-order-list .list .item .order-num .time {
		font-size: 26upx;
		font-weight: normal;
		color: #999;
		margin-top: -40upx;
	}
	.pos-order-list .list .item .operation {
		padding: 20upx 30upx 20upx 0;
		margin: 30upx 0 0 30upx;
		border-top: 1rpx solid #EEEEEE;
	}
	.pos-order-list .list .item .operation .more {
		position: relative;
	}
	.pos-order-list .list .item .operation .icon-gengduo {
		font-size: 50upx;
		color: #aaa;
	}
	.pos-order-list .list .item .operation .order .arrow {
		width: 0;
		height: 0;
		border-left: 11upx solid transparent;
		border-right: 11upx solid transparent;
		border-top: 20upx solid #e5e5e5;
		position: absolute;
		left: 15upx;
		bottom: -18upx;
	}
	.pos-order-list .list .item .operation .order .arrow:before {
		content: '';
		width: 0;
		height: 0;
		border-left: 7upx solid transparent;
		border-right: 7upx solid transparent;
		border-top: 20upx solid #fff;
		position: absolute;
		left: -7upx;
		bottom: 0;
	}
	.pos-order-list .list .item .operation .order {
		width: 200upx;
		background-color: #fff;
		border: 1px solid #eee;
		border-radius: 10upx;
		position: absolute;
		top: -100upx;
		z-index: 9;
	}
	.pos-order-list .list .item .operation .order .items {
		height: 77upx;
		line-height: 77upx;
		text-align: center;
	}
	.pos-order-list .list .item .operation .order .items~.items {
		border-top: 1px solid #f5f5f5;
	}
	.pos-order-list .list .item .operation .bnt {
		font-size: 28upx;
		color: #5c5c5c;
		width: 170upx;
		height: 60upx;
		border-radius: 30upx;
		border: 1px solid #bbb;
		text-align: center;
		line-height: 60upx;
	}
	.pos-order-list .list .item .operation .bnt_color{
		border: none;
		color: #fff;
		background: linear-gradient(90deg, #2291F8 0%, #1CD1DC 100%);
	}
	.pos-order-list .list .item .operation .bnt~.bnt {
		margin-left: 14upx;
	}

	.pos-order-goods {
		padding: 0 30upx;
		background-color: #fff;
	}
	.pos-order-goods .goods {
		height: 185upx;
	}
	.pos-order-goods .goods~.goods {
		border-top: 1px dashed #e5e5e5;
	}

	.pos-order-goods .goods .picTxt {
		width: 515upx;
	}
	.pos-order-goods .goods .picTxt .pictrue {
		width: 130upx;
		height: 130upx;
	}
	.pos-order-goods .goods .picTxt .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}
	.pos-order-goods .goods .picTxt .text {
		flex-direction: column;
		width: 365upx;
	}
	.pos-order-goods .goods .picTxt .text .info {
		font-size: 28upx;
		color: #282828;
	}
	.pos-order-goods .goods .picTxt .text .attr {
		margin-top: 5rpx;
		font-size: 24upx;
		color: #999;
	}
	.pos-order-goods .goods .money {
		width: 164upx;
		text-align: right;
		font-size: 28upx;
	}
	.pos-order-goods .goods .money .x-money {
		color: #282828;
	}
	.pos-order-goods .goods .money .num {
		color: #ff9600;
		margin: 5upx 0;
	}
	.pos-order-goods .goods .money .y-money {
		color: #999;
		text-decoration: line-through;
	}
	.pos-order-goods .goods .refund_num{
		display: inline-block;
		margin-left: 10rpx;
	}
	.public-total {
		font-size: 28upx;
		color: #282828;
		height: 92upx;
		line-height: 92upx;
		text-align: right;
		padding: 0 30upx;
		background-color: #fff;
	}
	.public-total .money {
		color: #ff4c3c;
	}
	.nothing {
		margin-top: 200rpx;
		text-align: center;	
	}
	.nothing_text{
		margin-top: 20rpx;
		color: #999999;
	}
</style>
