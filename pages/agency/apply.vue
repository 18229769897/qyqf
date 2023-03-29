<template>
	<view class="page-box">
		<u-form :model="form" ref="form" label-width="240">
			<u-form-item label="选择代理类型" prop="reimbursement_cost">
				<u-input placeholder="点击选择代理类型" disabled :value="proxy_type.label" @click.native="show = true" />
				<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
			</u-form-item>
		</u-form>
		<view style="padding: 40rpx 0;" v-if="form.agentLevel">
			代理区域：<text>{{userInfo.province}}</text> 
			<text v-if="form.agentLevel>=2">，{{userInfo.city}}</text> 
			<text v-if="form.agentLevel>=3">，{{userInfo.district}}</text> 
			<text v-if="form.agentLevel>=4">，{{userInfo.street}}</text>
		</view>
		<view class="update-box" max-count="9">
			<view>上传支付凭据</view>
			<view style="margin-top: 20rpx;">
				<u-upload :multiple="true" max-count="1" @on-success="success" :action="action" ref="upload" name="field">
				</u-upload>
			</view>
		</view>
		<view class="btn-red" @click="commit" style="margin-top: 150rpx;">立即申请</view>
	</view>
</template>

<script>
	import { HTTP_REQUEST_URL } from "@/config/app.js"
	import { proxyShopApplyApi } from "@/api/javaApi"
	import { mapGetters } from "vuex";
	export default {
		data() {
			return {
				action: `${HTTP_REQUEST_URL}/api/upload/image/field`,
				proxy_type: {},
				list: [
					{ label: "省代理", value: 1 },
					{ label: "市代理", value: 2 },
					{ label: "区代理", value: 3 },
					{ label: "街道代理", value: 4 },
				],
				show: false,
				show2: true,
				form: {
					agentLevel: "", // 代理等级
					proofUrl: "", // 凭据图片
				},
				status: ""
			}
		},
		computed: {
			...mapGetters(["userInfo"])
		},
		async onLoad() {
			try {
				await this.interce("isRealName")
			} catch (e) {
				//TODO handle the exception
			}
		},
		methods: {
			success(e) {
				this.form.proofUrl = e.data.path;
			},
			confirm(e) {
				this.proxy_type = e[0];
				this.form.agentLevel = this.proxy_type.value;
			},
			async commit() {
				let f = this.form;
				if (!f.agentLevel) {
					return this.$msg.fail("请选择代理类型");
				}
				if (!f.proofUrl) {
					return this.$msg.fail("请上传凭据图片");
				}
				let params = {
					ebAgentVerify: this.form,
				}
				try {
					let { message, status } = await proxyShopApplyApi(f);
					if (status == 200) {
						this.$msg.succ(message, () => {
							uni.redirectTo({
								url: "/pages/agency/apply_record"
							})
						});
					}
				} catch (e) {
					this.$msg.fail(e.message || e);
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules);
		}
	}
</script>

<style>
	@import url("/static/css/common.css");

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
