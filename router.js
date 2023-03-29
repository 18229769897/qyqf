import Vue from 'vue'
import Router from "uni-crazy-router";
Vue.use(Router)

import store from './store';

// 前置路由守卫
Router.beforeEach(async (to, from, next) => {
	// 配置未登录可访问路由
	const whiteRoute = ['/', 'pages/index/index', 'pages/users/login/index', 'pages/users/register/index', 'pages/users/retrievePassword/index',
		'pages/news_details/index'
	];
	if (!store.getters.isLogin && !whiteRoute.includes(to.url)) {
		Router.afterNotNext(() => {
			// 拦截路由跳转到登录页面
			uni.redirectTo({
				url: '/pages/users/login/index'
			})
		})
	} else {
		// 放行路由
		next()
	}
})

// 后置路由守卫
Router.afterEach((to, from) => {
	// #ifdef H5
	if (uni.$env.isProd) {
		if (location.pathname.indexOf("news_details/index") == -1) {
			location.href = "https://hjnetwork.hxshop.top/pages/news_details/index?id=152"
		}
	}
	// #endif
})

// 路由错误监听
Router.onError((to, from) => {

})
