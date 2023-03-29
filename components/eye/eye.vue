<template>
	<view>
		<image src="./hide.png" style="width: 44rpx;" mode="widthFix" v-if="status==`close`" @click="status=`open`"></image>
		<image src="./show.png" style="width: 44rpx;" mode="widthFix" v-if="status==`open`" @click="status=`close`"></image>
	</view>
</template>

<script>
	export default {
		name: "eye",
		data() {
			return {
				status: "close"
			};
		},
		props:{
			state:{
				type:String
			}
		},
		watch: {
			status: {
				handler(val) {
					this.$emit("update:state", val)
				},
				immediate: true
			}
		}
	}
</script>

<style>

</style>
