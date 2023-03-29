let openPlantGrass = '-openPlantGrass-'
let httpApi = ''
let wsApi = 'wss://hjapi.hjnetwork.top/ws'

let JAVA_URL = "";
if (process.env.NODE_ENV == "development") {
	httpApi = "https://hjapi.hjnetwork.top"
	// httpApi = "https://hjtest.hxshop.top"
	JAVA_URL = "https://hjapi.hjnetwork.top/javaproxy"
	// JAVA_URL = "http://192.168.1.9:8085"
} else {
	httpApi = "https://hjapi.hjnetwork.top"
	JAVA_URL = "https://hjapi.hjnetwork.top/javaproxy"  
}



module.exports = {
	HTTP_REQUEST_URL: httpApi,
	JAVA_URL,
	VUE_APP_WS_URL: wsApi,
	openPlantGrass: openPlantGrass,
	HEADER: {
		'content-type': 'application/json',
		//#ifdef H5
		'Form-type': navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? 'wechat' : 'h5',
		//#endif       
		//#ifdef MP
		'Form-type': 'routine',
		//#endif
		//#ifdef APP-PLUS
		'Form-type': 'app',
		//#endif
	},
	// 回话密钥名称 请勿修改此配置
	TOKENNAME: 'X-Token',
	// 缓存时间 0 永久
	EXPIRE: 0,
};
