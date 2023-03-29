export default {
	methods: {
		throttle(fn, delay = 2000, title = "请勿频繁点击") {
			let timer = null;
			let flag = true;
			return function(...args) {
				if (flag) {
					fn.apply(context, args);
					flag = false;
					return;
				}
				const context = this;
				if (!timer) {
					timer = setTimeout(() => {
						fn.apply(context, args);
						timer = null;
						flag = true;
					}, delay);
				}
			}
		}
	}
}
