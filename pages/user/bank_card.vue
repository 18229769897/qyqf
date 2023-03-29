<template>
	<view style="box-sizing: border-box;padding: 40rpx 30rpx 0;">
		<template v-for="item in bankList">
			<view class="bank_item" :key="item.id">
				<view>
					<view style="display: flex;justify-content: space-between;align-items: center;">
						<view style="font-size: 17px;">{{item.bank_name}}</view>
						<view class="remove_bind" @click="removeBind(item.id)">解绑</view>
					</view>
				</view>
				<view class="bank_num">
					<view class="circles" v-for="i in 4"></view>
					<view class="w24"></view>
					<view class="circles" v-for="i in 4"></view>
					<view class="w24"></view>
					<view class="circles" v-for="i in 4"></view>
					<view class="w24"></view>
					<text>{{item.bank_num}}</text>
				</view>
			</view>
		</template>
		<view class="add_bank_card" @click="addBank">
			<u-icon name="plus"></u-icon>
			<view style="margin-left: 20rpx;">添加银行卡</view>
		</view>
		<u-modal @confirm="confirm" @cancel="cancel" v-model="show" :show-cancel-button="true" content="您未实名认证,是否立即实名认证"></u-modal>
		<u-modal @confirm="confirm2" @cancel="cancel2" v-model="show2" :show-cancel-button="true" content="确定解除绑定？"></u-modal>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		getBankList,
		removeBindBank,
		getUserInfo
	} from '../../api/user.js'
	export default {
		data() {
			return {
				userInfo: "",
				show: false,
				show2: false,
				bankList: [],
				delId: ""
			}
		},
		onLoad() {
			this.getBankList();
		},
		onShow() {
			getUserInfo().then(res => {
				this.userInfo = res.data;
				this.$store.commit("UPDATE_USERINFO",res.data);
			});
		},
		methods: {
			...mapMutations(['setUserInfo']),
			// 获取银行卡列表
			async getBankList() {
				let {
					data,
					status,
					message
				} = await getBankList();
				if (status == 200) {
					this.bankList = data;
				}
			},
			addBank() {
				if (!this.userInfo.is_reals) {
					this.show = true;
				} else {
					uni.navigateTo({
						url: "./add_bankcard"
					})
				}
			},
			removeBind(id) {
				this.show2 = true;
				this.delId = id;
			},
			confirm2() {
				removeBindBank(this.delId).then(res => {
					if (res.status == 200) {
						setTimeout(() => {
							this.bankList = this.bankList.filter(item => item.id != this.delId);
							uni.showToast({
								title: "解绑成功",
								icon: "none"
							})
						}, 800)

					}
				})
			},
			confirm() {
				uni.navigateTo({
					url: './autonyms'
				})
			},
			cancel() {
				uni.switchTab({
					url: "./index"
				})
			},
			cancel2() {}
		}
	}
</script>

<style>
	page {
		background-color: #EDEDED;
		padding-top: 1rpx;
	}

	.add_bank_card {
		padding-left: 30rpx;
		background-color: #FFFFFF;
		font-size: 32rpx;
		height: 150rpx;
		display: flex;
		align-items: center;
		border-radius: 12rpx;
		margin-top: 25rpx;
	}

	.bank_item {
		color: #FFFFFF;
		height: 270rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 32rpx 40rpx;
		background-color: #008C77;
		border-radius: 12rpx;
	}

	.bank_item+.bank_item {
		margin-top: 16rpx;
	}

	.bank_num {
		color: #FFFFFF;
		font-size: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.circles {
		width: 16rpx;
		height: 16rpx;
		background-color: #FFFFFF;
		border-radius: 50%;
	}

	.circles+.circles {
		margin-left: 10rpx;
	}

	.w24 {
		width: 24rpx;
	}

	.remove_bind {
		border: 1rpx solid #FFFFFF;
		border-radius: 8rpx;
		padding: 6rpx 14rpx;
		font-size: 26rpx;
	}
</style>
