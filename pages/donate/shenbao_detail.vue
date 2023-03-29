<template>
	<view class="page-box">
		<u-form label-width="240">
			<u-form-item label="疾病名称" prop="disease_name">
				<u-input :value="form.disease_name" disabled />
			</u-form-item>
			<u-form-item label="住院医院总费用" prop="total_cost">
				<u-input :value="form.total_cost" disabled />
			</u-form-item>
			<u-form-item label="医院已报销额度" prop="reimbursement_cost">
				<u-input :value="form.reimbursement_cost" disabled />
			</u-form-item>
			<u-form-item label="剩余未报销额度" prop="remainder_cost">
				<u-input :value="form.remainder_cost" disabled />
			</u-form-item>
			<u-form-item label="住院医院名称" prop="hospital_name">
				<u-input :value="form.hospital_name" disabled />
			</u-form-item>
			<u-form-item label="医院电话" prop="hospital_phone">
				<u-input :value="form.hospital_phone" disabled />
			</u-form-item>
			<u-form-item label="主治医生姓名" prop="doctor_name">
				<u-input :value="form.doctor_name" disabled />
			</u-form-item>
			<u-form-item label="主治医生电话" prop="doctor_phone">
				<u-input :value="form.doctor_phone" disabled />
			</u-form-item>
			<u-form-item label="病人情况描述" label-position="top" prop="describe">
				<u-input :value="form.describe" type="textarea" maxlength="65535" auto-height disabled />
			</u-form-item>
		</u-form>
		<view class="list fx fx-warp" style="margin-top: 30rpx;">
			<template v-for="(item,index) in form.picture_data">
				<image @click="openPer(index)" :src="item" class="img" mode="widthFix"></image>
			</template>
		</view>
	</view>
</template>

<script>
	import { declareDetailApi, donateApi } from "@/api/user.js"
	import { isInteger } from "@/utils/validate.js"
	import { mapGetters } from "vuex"
	export default {
		data() {
			return {
				visible: false,
				payShow: false,
				picture_data: [],
				id: "",
				form: {},
				donateNum: ""
			}
		},
		onLoad(options) {
			this.id = options.id;
			this.getDetail();
		},
		computed: {
			...mapGetters(["userInfo"]),
		},
		methods: {
			async getDetail() {
				let { data } = await declareDetailApi(this.id);
				this.form = data;
				this.picture_data = data.picture_data;
			},
			openPer(index) {
				uni.previewImage({
					urls: this.picture_data,
					count: index
				});
			},
			commit() {

			}
		}
	}
</script>

<style>
	

	page {
		background-color: #FFFFFF;
	}

	.page-box {
		padding: 24rpx;
	}

	.img {
		width: calc((100% - 14rpx * 2) / 3);
		margin-left: 14rpx;
		margin-bottom: 14rpx;
		border-radius: 15rpx;
	}

	.list .img:nth-child(3n + 1) {
		margin-left: 0;
	}
</style>
