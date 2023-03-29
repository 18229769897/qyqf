export default {
	data() {
		return {
			page: 1,
			limit: 10,
			loadState: 0,
			count: 0,
			loadText: "",
			noData: false,
			lockLoad: false
		}
	},
	watch: {
		loadState(val) {
			if (val == 0) {
				this.loadText = ""
			}
			if (val == 1) {
				this.loadText = "加载中..."
			}
			if (val == 2) {
				this.loadText = "已加载全部~"
			}
		}
	},
	methods: {
		setList(listName, list, first) {
			let total = list.length;
			this[listName] = first ? list : this[listName].concat(list);
			this.loadState = 1;
			this.noData = false;
			if (total < this.limit) this.loadState = 2;
			if (first && total == 0) {
				this.noData = true;
				this.loadState = 0;
			}
			if (this.loadState == 1) {
				this.page++;
			}
		}
	}
}
