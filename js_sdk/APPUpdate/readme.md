## 使用步骤



**1、在manifest.json文件中，添加安装app的权限：**

```
 "<uses-permission android:name=\"android.permission.WAKE_LOCK\"/>",
 "<uses-permission android:name=\"android.permission.WRITE_SETTINGS\"/>"
```





**2、在App.vue中，编写如下代码**

```js
import appUpdate from "@/js_sdk/APPUpdate/src/index.js"
export default {
	onLaunch: function() {
		// #ifdef APP-PLUS
			appUpdate();
		// #endif
	},
}
```

