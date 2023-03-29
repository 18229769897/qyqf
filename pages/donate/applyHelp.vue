<template>
	<view class="page-box">
		<u-form :model="form" ref="form" label-width="240">
			<u-form-item label="疾病名称" prop="disease_name">
				<u-input v-model="form.disease_name" />
			</u-form-item>
			<u-form-item label="住院医院总费用" prop="total_cost">
				<u-input v-model="form.total_cost" />
			</u-form-item>
			<u-form-item label="医院已报销额度" prop="reimbursement_cost">
				<u-input v-model="form.reimbursement_cost" />
			</u-form-item>
			<u-form-item label="剩余未报销额度" prop="remainder_cost">
				<u-input v-model="form.remainder_cost" />
			</u-form-item>
			<u-form-item label="住院医院名称" prop="hospital_name">
				<u-input v-model="form.hospital_name" />
			</u-form-item>
			<u-form-item label="医院电话" prop="hospital_phone">
				<u-input v-model="form.hospital_phone" />
			</u-form-item>
			<u-form-item label="主治医生姓名" prop="doctor_name">
				<u-input v-model="form.doctor_name" />
			</u-form-item>
			<u-form-item label="主治医生电话" prop="doctor_phone">
				<u-input v-model="form.doctor_phone" />
			</u-form-item>
			<u-form-item label="病人情况描述" label-position="top" prop="describe">
				<u-input v-model="form.describe" type="textarea" :custom-style="input_style" maxlength="65535" auto-height />
			</u-form-item>
		</u-form>
		<view class="update-box" max-count="9">
			<view>上传图片资料</view>
			<view style="font-size: 26rpx;padding: 12rpx 0;line-height: 1.8;">(图片应包含：受赠者身份证正反面、受赠者病例&诊断报告&相关化验报告、受赠者住院证明、受赠则住院结算单&住院收费发票)</view>
			<view>
				<u-upload :multiple="true" max-count="9" @on-error="uploadError" :auto-upload="false" @on-uploaded="success" :action="action" ref="upload" name="field">
				</u-upload>
			</view>
		</view>
		<!-- <view style="margin-top: 50rpx;" class="fx j-center">
			<protocol ref="protocol">
				<text class="deal" @click.stop="toPage('/pages/news_details/index?id=165')">《爱心积分申请规则》</text>
			</protocol>
		</view> -->
		<view class="btn-red" style="margin-top: 30rpx;" @click="commit">提交</view>
	</view>
</template>

<script>
	import { HTTP_REQUEST_URL } from "@/config/app.js"
	import { declareApi } from "@/api/user.js"
	export default {
		data() {
			return {
				HTTP_REQUEST_URL,
				action: `${HTTP_REQUEST_URL}/api/upload/image/field`,
				picture_data: [],
				input_style: {
					"font-size": "30rpx",
					"line-height": "1.7"
				},
				form: {
					disease_name: "",
					total_cost: "",
					reimbursement_cost: "",
					remainder_cost: "",
					hospital_name: "",
					hospital_phone: "",
					doctor_name: "", // 医生姓名
					doctor_phone: "",
					describe: ""
				},
				rules: {
					disease_name: [{
						required: true,
						message: '请输入疾病名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ["blur", "change"],
					}],
					total_cost: [{
						required: true,
						message: '请输入总费用',
						trigger: ["blur", "change"],
					}],
					reimbursement_cost: [{
						required: true,
						message: '请输入已报销额度',
						trigger: ["blur", "change"],
					}],
					remainder_cost: [{
						required: true,
						message: '请输入剩余未报销额度',
						trigger: ["blur", "change"],
					}],
					hospital_name: [{
						required: true,
						message: '请输入医院名称',
						trigger: ["blur", "change"],
					}],
					hospital_phone: [{
						required: true,
						message: '请输入医院电话',
						trigger: ["blur", "change"],
					}],
					doctor_name: [{
						required: true,
						message: '请输入医生姓名',
						trigger: ["blur", "change"],
					}],
					doctor_phone: [{
						required: true,
						message: '请输入医生电话',
						trigger: ["blur", "change"],
					}],
					describe: [{
						required: true,
						message: '请输入描述信息',
						trigger: ["blur", "change"],
					}],
				}
			}
		},
		onLoad() {

		},
		methods: {
			success(list, name) {
				list.forEach(item => {
					let url = item.response.data.path;
					this.picture_data.push(url);
				})
				uni.$emit("uploadSucc")
			},
			uploadError() {
				uni.hideLoading();
				return this.$msg.fail("上传图片错误！")
			},
			commit() {
				// if (!this.$refs.protocol.checked) {
				// 	return this.$msg.fail("未勾选爱心积分申请规则");
				// }
				let that = this;
				let f = this.form;
				if (f.total_cost - f.reimbursement_cost != f.remainder_cost) {
					return this.$msg.fail("未报销费用不匹配")
				}
				this.$refs.form.validate((result) => {
					if (result) {
						this.$refs.upload.upload();
						uni.showLoading({
							title: "上传中..."
						})
						uni.$on("uploadSucc", async () => {
							let params = {
								...that.form,
								picture_data: that.picture_data
							}
							try {
								let { message } = await declareApi(params);
								setTimeout(() => {
									this.$msg.succ(message, () => {
										uni.redirectTo({
											url: "./shenbao_record"
										})
									})
								}, 100)
							} catch (e) {
								//TODO handle the exception
							} finally {
								uni.hideLoading();
							}
						})
					}
				})
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules);
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

	.update-box {
		margin-top: 25rpx;
	}
</style>
