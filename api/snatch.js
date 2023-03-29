import request from "@/utils/request.js";


/**
 * 夺宝商品列表
 */
export function getSnatchListApi(params) {
	return request.get('loot/product/lst', params, {
		noAuth: true
	});
}

/**
 * 夺宝商品详情
 */
export function getSnatchInfoApi(id) {
	return request.get(`loot/product/detail/${id}`, {}, {
		noAuth: true
	});
}

/**
 * 本期参与用户列表
 */
export function getSnatchUserListApi(id, params) {
	return request.get(`loot/product/participation/${id}`, params, {
		noAuth: true
	});
}

/**
 * 往期用户列表
 */
export function getSnatchHistoryUserApi(id, params) {
	return request.get(`loot/product/previously/announced/${id}`, params, {
		noAuth: true
	});
}

/**
 * 购买夺宝商品
 */
export function buyApi(params) {
	return request.post(`loot/product/buy`, params);
}

/**
 * 我的夺宝码
 */
export function myCodeApi(params) {
	return request.get(`loot/product/my/code`, params);
}


/**
 * 开奖历史
 */
export function drawHistoryApi(params) {
	return request.get(`loot/record/draw/histroy`, params);
}


/**
 * 参与积分、抽奖次数
 */
export function myParamsApi() {
	return request.get(`loot/param/my`);
}

/**
 * 夺宝记录
 */
export function buyRecordApi(params, options) {
	return request.get(`loot/record/buy`, params, options);
}

/**
 * 夺宝订单提交详情
 */
export function snatchOrderApi(id) {
	return request.get(`loot/record/buy/detail/${id}`);
}

/**
 * 抽奖订单提交详情
 */
export function lotteryOrderApi(id) {
	return request.get(`loot/record/draw/detail/${id}`);
}

/**
 * 提交夺宝订单
 */
export function commitSnatchApi(id,params) {
	return request.post(`loot/record/buy/submit/${id}`,params);
}

/**
 * 提交抽奖订单
 */
export function commitlotteryApi(id,params) {
	return request.post(`loot/record/draw/submit/${id}`,params);
}


/**
 * 抽奖记录
 */
export function getDrawApi(params) {
	return request.get(`loot/record/draw`, params);
}

/**
 * 抽奖商品列表
 */
export function getDrawListApi() {
	return request.get(`loot/product/draw/list`);
}

/**
 * 获取中奖商品id
 */
export function getLuckyDrawApi() {
	return request.post(`loot/product/lucky/draw`);
}
