<template>
	<view class="warp">
		<view>
			<u-field label-width="220" disabled v-model="form.bank_name" label="银行卡" />
			<u-field label-width="220" @click="show = true" :value="address.province?`${address.province},${address.city}`:''" label="支行地区" placeholder="填写支行地址" />
			<u-field label-width="220" v-model="form.branch_name" label="支行地址" placeholder="填写支行地址" />
			<u-field label-width="220" disabled v-model="bank_num" label="卡号" />
			<u-field label-width="220" v-model="form.phone" v-if="!edit_index" label="手机号" placeholder="银行预留手机号码" />
		</view>
		<view style="padding-right: 30rpx;margin-top: 80rpx;">
			<view class="binding" hover-class="hover-class" @click="commit">{{edit_index?"确定编辑":"确定绑卡"}}</view>
		</view>

		<addrList :show.sync="show" :rank="2" v-model="address" />
	</view>
</template>

<script>
	import { bindBank, getBankList } from '@/api/user.js'
	export default {
		data() {
			return {
				show: false,
				bank_num: "",
				edit_index: "", // 是否编辑
				form: {
					bank_name: "",
					bank_num: "",
					phone: "",
					branch_name: ""
				},
				address: {
					province: "", //省
					city: "", // 市
				},
			}
		},
		onLoad(options) {
			this.edit_index = options.edit_index;
			if (this.edit_index) {
				uni.setNavigationBarTitle({
					title: "编辑银行卡信息"
				})
			}
			let params = this.getParams(options.params);
			this.form.bank_name = params.type;
			this.bank_num = params.number;
		},
		methods: {
			async commit() {
				let f = this.form;
				if (!this.address.province) return this.$msg.fail("请选择支行地区");
				if (!f.branch_name) {
					return this.$msg.fail("请填写支行地址");
				}
				if (!this.edit_index && !/^1[3-9]\d{9}$/.test(this.form.phone)) {
					return uni.showToast({
						title: "请输入正确的手机号",
						icon: "none"
					})
				}
				this.form.bank_num = this.bank_num.replace(/ /g, "");
				uni.showLoading({
					title: ""
				})
				try {
					let { message } = await bindBank({ ...this.form, ...this.address });
					uni.showToast({
						title: message,
						icon: "none"
					})
					setTimeout(() => {
						if (this.edit_index) {
							uni.navigateBack();
						} else {
							uni.switchTab({
								url: "./index"
							})
						}
					}, 1000)

				} catch (e) {
					uni.showToast({
						title: e,
						icon: "none"
					})
				} finally {
					uni.hideLoading()
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.warp {
		padding: 30rpx 0 0 24rpx;
		box-sizing: border-box;
	}

	.binding {
		height: 85rpx;
		background-color: $red;
		line-height: 85rpx;
		text-align: center;
		color: #FFFFFF;
		border-radius: 10rpx;
		font-size: 32rpx;
	}
</style>
