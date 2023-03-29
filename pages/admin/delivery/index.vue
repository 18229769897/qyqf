<template>
	<view class="deliver-goods">
		<header>
			<view class="order-num acea-row row-between-wrapper">
				<view class="num line1">订单号：{{ delivery.order_sn }}</view>
				<view class="name line1">
					<span class="iconfont icon-yonghu2"></span>{{ delivery.user.nickname }}
				</view>
			</view>
			<view class="address">
				<view class="name">
					{{ delivery.real_name
          }}<span class="phone">{{ delivery.user_phone }}</span>
				</view>
				<view>{{ delivery.user_address }}</view>
			</view>
			<view class="line">
				<image src="@/static/images/line.jpg" />
			</view>
		</header>
		<view class="wrapper">
			<view class="item acea-row row-between-wrapper">
				<view>发货方式</view>
				<view class="mode acea-row row-middle row-right">
					<view class="goods" :class="active === index ? 'on' : ''" v-for="(item, index) in types" :key="index" @click="changeType(item, index)">
						{{ item.title }}<span class="iconfont icon-xuanzhong2"></span>
					</view>
				</view>
			</view>
			<block v-if="logistics.length>0">
				<view class="list" v-show="active === 0">
					<view class="item acea-row row-between-wrapper">
						<view>发货类型</view>
						<view class="mode acea-row row-middle row-right">
							<view class="goods" :class="curExpress === item.key ? 'on' : ''" v-for="(item, index) in expressType" :key="index"
							 @click="changeExpTpe(item, index)">
								{{ item.title }}<span class="iconfont icon-xuanzhong2"></span>
							</view>
						</view>
					</view>
					<block v-if="curExpress == 1">
						<view class="item acea-row row-between-wrapper">
							<view>快递公司</view>
							<view class="select-box">
								<picker class="pickerBox" @change="bindPickerChange" :value="seIndex" :range="logistics" range-key="label">
									<view class="uni-input">{{logistics[seIndex].label}}</view>
								</picker>
							</view>
						</view>
						<view class="item acea-row row-between-wrapper">
							<view>快递单号</view>
							<input type="text" placeholder="填写快递单号" v-model="delivery_id" class="mode" />
							<!-- #ifdef MP -->
							<text class="iconfont icon-xiangji" @click="scanCode"></text>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<text v-if="isWeixin" class="iconfont icon-xiangji" @click="scanCode"></text>
							<!-- #endif -->
						</view>
					</block>
					<block v-if="curExpress == 4">
						<view class="item acea-row row-between-wrapper">
							<view>快递公司</view>
							<view class="select-box">
								<picker class="pickerBox" @change="bindPickerChange" :value="seIndex" :range="logistics" range-key="label">
									<!-- <view></view> -->
									<view class="uni-input">{{logistics[seIndex].label}}</view>
								</picker>
							</view>
						</view>
						<view class="item acea-row row-between-wrapper" v-if="expTemp.length>0">
							<view>电子面单 {{expIndex}}</view>
							<div style="display: flex;align-items: center;">
								<picker class="pickerBox" @change="bindTempChange" :value="expIndex" :range="expTemp" range-key="title">
									<view class="uni-input input-inline">{{expTemp[expIndex].title}}</view>
								</picker>
								<div class="look" @click="previewImage">预览</div>
							</div>
							
						</view>
						<view class="item acea-row row-between-wrapper">
							<view>寄件人姓名：</view>
							<input type="text" placeholder="填写寄件人姓名" v-model="from_name" class="mode" />
						</view>
						<view class="item acea-row row-between-wrapper">
							<view>寄件人电话：</view>
							<input type="text" placeholder="填写寄件人电话" v-model="from_tel" class="mode" />
						</view>
						<view class="item acea-row row-between-wrapper">
							<view>寄件人地址：</view>
							<input type="text" placeholder="填写寄件人地址" v-model="from_addr" class="mode" />
						</view>
					</block>
				</view>
			</block>
			<view class="list" v-show="active === 1">
				<view class="item acea-row row-between-wrapper">
					<view>送货人</view>
					<input type="text" placeholder="填写送货人" v-model="delivery_name" class="mode" />
				</view>
				<view class="item acea-row row-between-wrapper">
					<view>送货电话</view>
					<input type="text" placeholder="填写送货电话" v-model="delivery_id" class="mode" />
				</view>
			</view>
		</view>
		<view style="height:1.2rem;"></view>
		<view class="confirm" @click="saveInfo">确认提交</view>
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
		getAdminOrderDetail,
		setAdminOrderDelivery,
		orderExportTemp,
		orderDeliveryInfo,
	} from "@/api/admin";
	import {
		expressList
	} from "@/api/order";
	import {
		checkPhone
	} from '@/utils/validate.js'
	export default {
		name: "GoodsDeliver",
		components: {},
		props: {},
		data: function() {
			return {
				types: [{
						type: 1,
						title: "发货"
					},
					{
						type: 2,
						title: "送货"
					},
					{
						type: 3,
						title: "无需物流"
					}
				],
				expressType: [{
						title: '手动填写',
						key: 1
					},
					{
						title: '电子面单打印',
						key: 4
					},
				],
				curExpress: 1,
				active: 0,
				order_id: "",
				delivery: {
					user: {}
				},
				logistics: [],
				delivery_type: 1,
				delivery_name: "",
				delivery_id: "",
				mer_config_temp_id: "",
				mer_from_com: "",
				seIndex: 0,
				merId: "",
				expIndex:0,
				expTemp:[], // 快递模板
				from_name:'', // 发货人名称	
				from_tel:'',  // 发货人电话	
				from_addr:"", // 发货人地址	
				postPeople:[], //配送人
				postIndex:0,
				fictitious_content: '',
				// #ifdef H5
				isWeixin: this.$wechat.isWeixin()
				// #endif
			};
		},
		watch: {
			"$route.params.oid": function(newVal) {
				let that = this;
				if (newVal != undefined) {
					that.order_id = newVal;
					that.getIndex();
				}
			}
		},
		onLoad: function(option) {
			this.order_id = option.id;
			this.merId = option.merId
			this.getIndex();
			this.expressList();
			this.orderDeliveryInfo();
		},
		methods: {
			// 扫描快递单号一维码
			scanCode() {
				// #ifdef MP
				let that = this;
				uni.scanCode({
					scanType: ['barCode'],
					success(res) {
						let code = res.result.split(",")
						that.delivery_id = code.length == 1 ? code[0] : code[1];
					}
				})
				// #endif
				// #ifdef H5
				if (this.$wechat.isWeixin()) {
					this.$wechat.wechatEvevt('scanQRCode', {
						needResult: 1,
						scanType: ['barCode']
					}).then(res => {
						let code = res.resultStr.split(",")
						that.delivery_id = code.length == 1 ? code[0] : code[1];
					});
				}
				// #endif
			},
			// 预览图片
			previewImage(){
				uni.previewImage({
						urls: [this.expTemp[this.expIndex].pic],
						success:function(){
							
						},
						fail:function(error){
							
						}
				});
			},
			// 获取配送员列表
			// geTorderOrderDelivery(){
			// 	orderOrderDelivery().then(res=>{
			// 		this.postPeople = res.data
			// 	})
			// },
			// 选择发货类型
			changeExpTpe(item, index) {
				// this.expressList(item.key);
				let that = this;
				that.curExpress = item.key
				that.getDump();
				if(item.key == 4){
					that.logistics.forEach((val,index) =>{
						if(val.value == that.mer_from_com){
							that.seIndex = index;
							return;
						}
					})
				}
			},
			//获取电子面单默认数据
			getDump(){
				let that = this;
				that.expTemp.forEach((val,index) =>{
					if(val.temp_id == that.mer_config_temp_id){
						that.expIndex = index;
						return;
					}
				})
			},
			changeType: function(item, index) {
				this.active = index;
				this.delivery_type = item.type;
				this.delivery_name = "";
				this.delivery_id = "";
			},
			getIndex: function() {
				let that = this;
				getAdminOrderDetail(that.merId,that.order_id).then(
					res => {
						that.delivery = res.data;
						console.log(this.active);
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				);
			},

			expressList: function() {
				let that = this;
				expressList().then(
					res => {
						that.logistics = res.data;
						that.getExpTemp(res.data[0].value)
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				);
			},
			async saveInfo() {
				let that = this,
					delivery_type = that.delivery_type,
					delivery_name = that.logistics[that.seIndex].value,
					delivery_id = that.delivery_id,
					save = {};
				save.delivery_name = delivery_name
				if(delivery_type==1 && this.curExpress == 1){
					if (!delivery_id) {
						return this.$util.Tips({
							title: '请填写快递单号'
						})
					}
					save.delivery_type = that.curExpress
					save.delivery_id = delivery_id
					that.setInfo(save);
				}
				
				if(delivery_type==1 && this.curExpress == 4){
					if (!that.from_name) {
						return this.$util.Tips({
							title: '请填写寄件人姓名'
						})
					}
					if (!that.from_tel) {
						return this.$util.Tips({
							title: '请填写寄件人手机号码'
						})
					}
					if (!(/^1[3456789]\d{9}$/.test(that.from_tel))) {
						return this.$util.Tips({
							title: '请填写正确的手机号码'
						})
					}
					if (!that.from_addr) {
						return this.$util.Tips({
							title: '请填写寄件人地址'
						})
					}
					if(that.expTemp.length==0){
						return this.$util.Tips({
							title: '请选择电子面单'
						})
					}
					save.delivery_type = that.curExpress
					save.from_name = that.from_name
					save.from_tel = that.from_tel
					save.from_addr = that.from_addr
					save.temp_id = that.expTemp[that.expIndex].temp_id
					that.setInfo(save);
				}
				if(delivery_type == 2){
					let obj = this.postPeople[this.postIndex]
					let params = {}
					params.delivery_type = that.delivery_type
					params.delivery_name = that.delivery_name
					params.delivery_id = that.delivery_id
					params.delivery_uid = that.uid
					that.setInfo(params);
				}
				if(delivery_type == 3){
					let params = {}
					params.delivery_type = that.delivery_type;
					params.fictitious_content = that.fictitious_content;
					that.setInfo(params);
				}
			},
			setInfo: function(item) {
				let that = this;
				console.log(item);
				setAdminOrderDelivery(that.merId,that.order_id,item).then(
					res => {
						that.$util.Tips({
							title: res.message,
							icon: 'success',
							mask: true
						})
						setTimeout(res => {					
							uni.redirectTo({
								url:`/pages/admin/orderList/index?types=2&merId=${that.merId}`
							})
							
						}, 1000)
					},
					error => {
						console.log(error)
						that.$util.Tips({
							title: error
						})
					}
				);
			},
			bindPickerChange(e) {
				console.log(e, 'tar')
				this.seIndex = e.detail.value
				this.getExpTemp(this.logistics[e.detail.value].value)
			},
			getExpTemp(code){
				orderExportTemp({
					com: code
				}).then(res=>{
					this.expTemp = res.data.data
				})
			},
			// 获取订单打印默认配置
			orderDeliveryInfo(){
				let that = this
				orderDeliveryInfo(that.merId).then(
					res => {
						that.from_name = res.data.mer_from_name;
						that.from_tel = res.data.mer_from_tel;
						that.from_addr = res.data.mer_from_addr;
						that.mer_config_temp_id = res.data.mer_config_temp_id;
						that.mer_from_com = res.data.mer_from_com
					},
					error => {
						that.$util.Tips({
							title: error
						})
					}
				)
			}
		}
	};
</script>

<style lang="scss">
	/*发货*/
	.uni-input{
		display: block;
		width: 400rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.input-inline{
		width: auto;
	}
	.deliver-goods header {
		width: 100%;
		background-color: #fff;
		margin-top: 10upx;
	}

	.deliver-goods header .order-num {
		padding: 0 30upx;
		border-bottom: 1px solid #f5f5f5;
		height: 67upx;
	}

	.deliver-goods header .order-num .num {
		width: 430upx;
		font-size: 26upx;
		color: #282828;
		position: relative;
	}

	.deliver-goods header .order-num .num:after {
		position: absolute;
		content: '';
		width: 1px;
		height: 30upx;
		background-color: #ddd;
		top: 50%;
		margin-top: -15upx;
		right: 0;
	}

	.deliver-goods header .order-num .name {
		width: 260upx;
		font-size: 26upx;
		color: #282828;
		text-align: center;
	}

	.deliver-goods header .order-num .name .iconfont {
		font-size: 35upx;
		color: #477ef3;
		vertical-align: middle;
		margin-right: 10upx;
	}

	.deliver-goods header .address {
		font-size: 26upx;
		color: #868686;
		background-color: #fff;
		padding: 30upx;
	}
	.look{
		margin-left: 20rpx;
		color: #1890FF;
	}
	.deliver-goods header .address .name {
		font-size: 34upx;
		color: #282828;
		margin-bottom: 10upx;
	}

	.deliver-goods header .address .name .phone {
		margin-left: 40upx;
	}

	.deliver-goods header .line {
		width: 100%;
		height: 3upx;
	}

	.deliver-goods header .line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.deliver-goods .wrapper {
		width: 100%;
		background-color: #fff;
	}

	.deliver-goods .wrapper .item {
		border-bottom: 1px solid #f0f0f0;
		padding: 0 30upx;
		height: 96upx;
		font-size: 32upx;
		color: #282828;
		position: relative;
	}

	.deliver-goods .wrapper .item .mode {
		width: 460upx;
		height: 100%;
		text-align: right;
	}

	.deliver-goods .wrapper .item .mode .iconfont {
		font-size: 30upx;
		margin-left: 13upx;
	}

	.deliver-goods .wrapper .item .mode .goods~.goods {
		margin-left: 30upx;
	}

	.deliver-goods .wrapper .item .mode .goods {
		color: #bbb;
	}

	.deliver-goods .wrapper .item .mode .goods.on {
		color: #477ef3;
	}

	.deliver-goods .wrapper .item .icon-up {
		position: absolute;
		font-size: 35upx;
		color: #2c2c2c;
		right: 30upx;
	}

	.deliver-goods .wrapper .item select {
		direction: rtl;
		padding-right: 60upx;
		position: relative;
		z-index: 2;
	}

	.deliver-goods .wrapper .item input::placeholder {
		color: #bbb;
	}

	.deliver-goods .confirm {
		font-size: 32upx;
		color: #fff;
		width: 100%;
		height: 100upx;
		background-color: #477ef3;
		text-align: center;
		line-height: 100upx;
		position: fixed;
		bottom: 0;
	}

	.select-box {
		flex: 1;
		height: 100%;

		.pickerBox {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			width: 100%;
			height: 100%;
			text-align: right;
		}
	}
</style>
