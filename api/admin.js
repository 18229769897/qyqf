// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import request from "@/utils/request.js";

/**
 * 统计数据
 */
export function getStatisticsInfo() {
  return request.get("admin/order/statistics", {}, { login: true });
}
/**
 * 订单月统计
 */
export function getStatisticsMonth(where) {
  return request.get("admin/order/data", where, { login: true });
}
/**
 * 订单月统计
 */
export function getAdminOrderList(where) {
  return request.get("admin/order/list", where, { login: true });
}
/**
 * 订单改价
 */
export function setAdminOrderPrice(merId,id,data) {
  return request.post("admin/"+merId+"/price/"+id, data, { login: true });
}
/**
 * 订单备注
 */
export function setAdminOrderRemark(merId,id,data) {
  return request.post("admin/"+merId+"/mark/" +id, data, { login: true });
}
/**
 * 订单详情
 */
export function getAdminOrderDetail(merId, orderId) {
  return request.get("admin/"+merId+"/order/" + orderId, {}, { login: true });
}
/**
 * 订单发货信息获取
 */
export function getAdminOrderDelivery(orderId) {
  return request.get( "admin/order/delivery/gain/" + orderId,{},{ login: true });
}

/**
 * 订单发货保存
 */
export function setAdminOrderDelivery(merId,id,data) {
  return request.post("admin/"+merId+"/delivery/"+ id, data, { login: true });
}
/**
 * 订单统计图
 */
export function getStatisticsTime(data) {
  return request.get("admin/order/time", data, { login: true });
}
/**
 * 线下付款订单确认付款
 */
export function setOfflinePay(merId, data) {
  return request.post("admin/"+merId+"/order/offline", data, { login: true });
}
/**
 * 订单确认退款
 */
export function setOrderRefund(merId,data) {
  return request.post("admin/"+merId+"/order/refund", data, { login: true });
}

/**
 * 获取快递公司
 * @returns {*}
 */
export function getLogistics() {
  return request.get("logistics", {}, { login: false });
}

/**
 * 订单核销
 * @returns {*}
 */
export function orderVerific(data) {
  // return request.post("verifier/"+code);
	return request.post(`verifier/${data.mer_id}/${data.id}`);
}

/**
 * 核销订单详情
 * @returns {*}
 */
export function verifierOrder(mer_id,code) {
  return request.get("verifier/"+mer_id+"/order/"+code);
}

/**
 * 订单统计数
 * @returns {*}
 */
export function orderStatistics(mer_id) {
  return request.get("admin/"+mer_id+"/statistics");
}
/**
 * 每日成交额
 * @returns {*}
 */
export function orderPrice(where, mer_id) {
  return request.get("admin/"+mer_id+"/order_price", where, { login: true });
}
/**
 * 订单列表
 * @returns {*}
 */
export function getOrderList(where, merId) {
  return request.get(`admin/${merId}/order_list`, where, { login: true });
}
/**
 * 营业额统计
 * @returns {*}
 */
export function turnoverStatistics(where, merId) {
  return request.get(`admin/${merId}/pay_price`, where, { login: true });
}
/**
 * 订单统计
 * @returns {*}
 */
export function orderNumberStatistics(where, merId) {
  return request.get(`admin/${merId}/pay_number`, where, { login: true });
}
/**
 * 获取订单打印默认配置
 * @returns {*}
 */
export function orderDeliveryInfo(merId) {
  return request.get(`admin/${merId}/mer_form`);
}
/**
 * 获取电子面单列表
 * @returns {*}
 */
export function orderExportTemp(data) {
  return request.get("store/expr/temps", data);
}