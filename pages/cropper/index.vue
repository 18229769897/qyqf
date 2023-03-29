<template>
	<view class="container">
		<tui-picture-cropper :quality="0.6" :width="340" :height="213" :lockRatio="true" :imageUrl="imageUrl" @ready="ready" @cropper="cropper"
			rotateImg="/static/images/xuanzhuan.png"></tui-picture-cropper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '', //要裁剪的图片
				name: "", // 图片名称
				imageUrl: "100"
			};
		},
		onLoad(options) {
			this.src = options.src || '';
			this.name = options.name;
			//如果从上个页面传值时可显示loading
			this.src &&
				uni.showLoading({
					title: '请稍候...',
					mask: true,
				});
		},
		methods: {
			ready() {
				this.imageUrl = this.src;
			},
			cropper(e) {
				this.$Cache.set(this.name, e.url);
				setTimeout(() => {
					uni.navigateBack()
				}, 300)
			}
		}
	};
</script>
