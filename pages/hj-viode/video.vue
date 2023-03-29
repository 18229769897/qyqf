<template>
	<view class="page-box fx-center">
		<video style="width: 750rpx;" vslide-gesture-in-fullscreen vslide-gesture autoplay :src="videoUrl"></video>
	</view>
</template>

<script>
	import { getArticleDetails } from "@/api/api.js";
	export default {
		data() {
			return {
				article_id: "",
				videoUrl: ""
			}
		},
		async onLoad(e) {
			let { data } = await getArticleDetails(e.article_id);
			this.videoUrl = data.synopsis;
		}
	}
</script>

<style>
	page {
		background-color: #000;
	}
</style>

<style scoped>
	.page-box {
		width: 750rpx;
		height: 100vh;
	}
</style>
