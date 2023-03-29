<template>
	<image src="./copy.png" @click="copy" class="copy_img"></image>
</template>

<script>
	/**
	 *复制文本
	 */
	function setClipboardData(data) {
		data = data.toString();
		return new Promise((success, fail) => {
			// #ifndef H5
			uni.setClipboardData({ data, success, fail })
			// #endif

			// #ifdef H5
			const textarea = document.createElement("textarea");
			textarea.value = data;
			textarea.readOnly = true;
			document.body.appendChild(textarea);
			textarea.select();
			textarea.setSelectionRange(0, data.length);
			document.execCommand("copy");
			textarea.remove();
			success(data);
			// #endif
		});
	}
    
	export default {
		props: {
			text: {
				type: [String, Number],
			},
		},
		methods: {
			copy() {
				setClipboardData(this.text).then(() => {
					this.$msg.succ("复制成功");
				})
			},
		},
	}
</script>

<style>
	.copy_img {
		width: 38rpx;
		height: 36rpx;
		margin-left: 8rpx;
		margin-bottom: -4rpx;
		display: inline-block;
	}
</style>
