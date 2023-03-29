<template>
	<view class="page-box">
		<view class="form-item" style="margin-top: 30rpx;">
			<view class="title">填写地址：</view>
			<tui-input placeholder="点击选择地址" disabled @click="show = true" :value="address.province?`${address.province},${address.city},${address.district},${address.street}`:''"></tui-input>
		</view>

		<view style="margin-top: 60rpx;" class="btn-red" @click="commit">确定</view>

		<addrList :show.sync="show" v-model="address" />
	</view>
</template>

<script>
	import { setUserAddrApi } from "@/api/user.js"
	export default {
		data() {
			return {
				show: false,
				address: {
					province: "", //省
					city: "", // 市
					district: "", // 区
					street: "", // 街道
				},
			}
		},
		methods: {
			async commit() {
				if (!this.address.province) return this.$msg.fail("请选择地址");
				try {
					let { message } = await setUserAddrApi(this.address);
					this.$store.dispatch("USERINFO");
					this.$msg.succ(message, () => {
						uni.switchTab({
							url: "/pages/index/index"
						})
					});
				} catch (e) {
					return this.$msg.fail(e.message || e);
				}
			},
		}
	}
</script>

<style>
	page {
		background-color: #fff !important;
	}

	.page-box {
		padding: 0 30rpx;
	}

	.title {
		padding-left: 26rpx;
		font-size: 30rpx;
	}
</style>
