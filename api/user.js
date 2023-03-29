import request from "@/utils/request.js";
import Cache from '@/utils/cache'
/**
 * 获取用户信息
 * 
 */
export function getUserInfo() {
	return request.get('user');
}
/**
 * h5用户登录
 * @param data object 用户账号密码
 */
export function loginH5(data) {
	return request.post("auth/login", data, {
		noAuth: true
	});
}
/**
 * h5用户手机号登录
 * @param data object 用户手机号 也只能
 */
export function loginMobile(data) {
	return request.post("auth/smslogin", data, {
		noAuth: true
	});
}
/**
 * h5用户手机号登录
 * @param data object 用户手机号 也只能
 */
export function loginMpPhone(data) {
	return request.post("auth/mp_phone", data, {
		noAuth: true
	});
}
/**
 * 验证码key
 */
export function getCodeApi() {
	return request.get("verify_code", {}, {
		noAuth: true
	});
}

/**
 * h5用户发送验证码
 * @param data object 用户手机号
 */
export function registerVerify(data) {
	return request.post("auth/verify", data, {
		noAuth: true
	});
}
/**
 * h5用户手机号注册
 * @param data object 用户手机号 验证码 密码
 */
export function register(data) {
	return request.post("auth/register", data, {
		noAuth: true
	});
}

/**
 * 用户手机号修改密码
 * @param data object 用户手机号 验证码 密码
 */
export function registerReset(data) {
	return request.post("/register/reset", data, {
		noAuth: true
	});
}
/**
 * 用户手机号忘记密码
 */
export function registerForget(data) {
	return request.post("user/change_pwd", data, {
		noAuth: true
	});
}
/**
 * 获取用户中心菜单
 *
 */
export function getMenuList() {
	return request.get("common/menus", {}, { noAuth: true });
}
/*
 * 签到用户信息
 * */
export function getSignUser() {
	return request.get("user/sign/info");
}

/**
 * 获取签到配置
 * 
 */
export function getSignConfig() {
	return request.get('sign/config')
}
/**
 * 获取签到列表
 * @param object data
 */
export function getSignList(data) {
	return request.get('user/sign/lst', data);
}
/**
 * 用户签到
 */
export function setSignIntegral() {
	return request.post('user/sign/create')
}

/**
 * 签到列表(年月)
 * @param object data
 * 
 */
export function getSignMonthList(data) {
	return request.get('user/sign/month', data)
}
/**
 * 活动状态
 * 
 */
export function userActivity() {
	return request.get('user/activity');
}
/*
 * 资金明细（types|0=全部,1=消费,2=充值,3=返佣）
 * */
export function getCommissionInfo(q, types) {
	return request.get("user/bill", q);
}
/*
 * 提现列表
 * */
export function extractLst(data) {
	return request.get("user/extract/lst", data);
}
/*
 * 积分记录
 * */
export function getIntegralList(data) {
	return request.get("user/integral/lst", data);
}

/**
 * 获取分销海报图片
 * 
 */
export function spreadBanner() {
	//#ifdef H5
	return request.get('user/spread_image', {
		type: 'wechat'
	});
	//#endif
	//#ifdef MP
	return request.get('user/spread_image', {
		type: 'routine'
	});
	//#endif
}
/**
 *
 * 获取推广用户一级和二级
 * @param object data
 */
export function spreadPeople(data) {
	return request.get('user/spread_list', data);
}
/**
 * 
 * 推广补贴/提现总和
 * @param int type
 */
export function spreadCount(type) {
	return request.get('spread/count/' + type);
}
/*
 * 推广数据
 * */
export function getSpreadInfo() {
	return request.get("/commission");
}

/**
 * 
 * 推广订单
 * @param object data
 */
export function spreadOrder(data) {
	return request.get('user/spread_order', data);
}

/*
 * 获取推广人排行
 * */
export function getRankList(data) {
	return request.get("user/spread_top", data);
}

/*
 * 获取补贴排名
 * */
export function getBrokerageRank(q) {
	return request.get("user/brokerage_top", q);
}

/**
 * 提现申请
 * @param object data
 */
export function extractCash(data) {
	return request.post('user/extract/create', data)
}

/**
 * 代理商提现申请
 */
export function merExtract(data) {
	return request.post('user/extract/create_agent', data)
}

/**
 * 商户提现申请
 */
export function storeExtractApi(data) {
	return request.post('user/extract/create_mer', data)
}

/**
 * 提现银行/提现最低金额
 * 
 */
export function extractBank() {
	return request.get('user/extract/banklst');
}

/**
 * 会员等级列表
 * 
 */
export function userLevelGrade() {
	return request.get('user/level/grade');
}

/**
 * 获取某个等级任务
 * @param int id 任务id
 */
export function userLevelTask(id) {
	return request.get('user/level/task/' + id);
}

/**
 * 检查用户是否可以成为会员
 * 
 */
export function userLevelDetection() {
	return request.get('user/level/detection');
}

/**
 * 
 * 地址列表
 * @param object data
 */
export function getAddressList(data) {
	return request.get('user/address/lst', data);
}

/**
 * 设置默认地址
 * @param int id
 */
export function setAddressDefault(id) {
	return request.post('user/address/update/' + id)
}

/**
 * 修改 添加地址
 * @param object data
 */
export function editAddress(data) {
	return request.post('user/address/create', data);
}

/**
 * 删除地址
 * @param int id
 * 
 */
export function delAddress(id) {
	return request.post('user/address/delete/' + id)
}

/**
 * 获取单个地址
 * @param int id 
 */
export function getAddressDetail(id) {
	return request.get('user/address/detail/' + id);
}

/**
 * 修改用户信息
 * @param object
 */
export function userEdit(data) {
	return request.post('user/edit', data);
}

/*
 * 退出登录
 * */
export function getLogout() {
	return request.post("logout");
}

/**
 * 补贴转入
 * 
 */
export function rechargeBrokerage(data) {
	return request.post('user/recharge/brokerage', data)
}

/**
 * 小程序充值
 * 
 */
export function rechargeRoutine(data) {
	return request.post('recharge/routine', data)
}

/*
 * 钱包充值
 * */
export function rechargeWechat(data) {
	return request.post("user/recharge", data);
}

/*
 * 钱包充值2
 * */
export function rechargeWechat2(data) {
	return request.post("user/recharge_all", data);
}



/**
 * 获取默认地址
 * 
 */
export function getAddressDefault() {
	return request.get('address/default');
}

/**
 * 充值金额选择
 */
export function getRechargeApi() {
	return request.get("common/recharge_quota");
}

/**
 * 登陆记录
 */
export function setVisit(data) {
	return request.post('user/set_visit', {
		...data
	}, {
		noAuth: true
	});
}

/**
 * 客服列表
 */
export function serviceList(data) {
	return request.get("service/list", data);
}

/**
 * 客服列表
 */
export function serviceLogin(key, data) {
	return request.post("service/scan_login/" + key, data);
}

/**
 * 客服获取客户列表
 */
export function serviceUserList(mer_id, data) {
	return request.get("service/user_list/" + mer_id, data);
}

/**
 * 用户获取聊天记录详情
 */
export function getChatRecord(to_uid, data) {
	return request.get("service/history/" + to_uid, data);
}

/**
 * 客服获取聊天记录详情
 */
export function getMerHistory(userid, mer_id, data) {
	return request.get("service/mer_history/" + mer_id + '/' + userid, data);
}

/**
 * 静默绑定推广人
 * @param {Object} puid
 */
export function spread(puid) {
	Cache.set("spread", puid || 0);
	return request.post("user/spread", {
		spread_spid: puid
	});
}

/**
 * 反馈类型
 */
export function feedbackType() {
	return request.get("common/feedback_type");
}

/**
 * 提交反馈
 */
export function feedback(data) {
	return request.post("user/feedback", {
		...data
	});
}

/**
 * 反馈列表
 */
export function feedbackList(data) {
	return request.get("user/feedback/list", data);
}

/**
 * 反馈列表
 */
export function feedbackDetail(id) {
	return request.get("user/feedback/detail/" + id);
}

/**
 * 浏览记录
 */
export function historyList(data) {
	return request.get("user/history", data);
}

/**
 * 删除浏览记录
 */
export function historyDelete(id) {
	return request.post("user/history/delete/" + id);
}
/**
 * 批量删除浏览记录
 */
export function historyBatchDelete(data) {
	return request.post("user/history/batch/delete", data);
}
/**
 * 批量收藏浏览记录
 */
export function historyBatchCollect(data) {
	return request.post("user/relation/batch/create", data);
}
/**
 * 补贴记录
 */
export function brokerage_list(data) {
	return request.get("user/brokerage_list", data);
}

/**
 * 补贴数据
 */
export function spreadInfo() {
	return request.get("user/spread_info");
}

// 图片验证码
export function getCaptcha() {
	return request.get('captcha', {
		noAuth: true
	});
}

// 用户账户列表
export function userAcc() {
	return request.get('user/account', {}, {
		noAuth: true
	});
}
// 创建发票
export function invoiceSave(data) {
	return request.post('user/receipt/create', data);
}
// 编辑发票
export function invoiceUpdate(id, data) {
	return request.post('user/receipt/update/' + id, data);
}
// 获取默认发票
export function invoiceDefault(id) {
	return request.post('user/receipt/is_default/' + id);
}
// 发票抬头--列表
export function invoice(data) {
	return request.get('user/receipt/lst', data);
}
// 发票抬头--删除
export function invoiceDelete(id) {
	return request.post('user/receipt/delete/' + id);
}
// 发票--详情
export function invoiceDetail(id) {
	return request.get('user/receipt/detail/' + id);
}

/**
 * 新版分享海报信息获取
 * 
 */
export function spreadMsg(data) {
	return request.get('user/v2/spread_image', data);
}

/**
 * 获取推广二维码
 */
export const getQrApi = (params, option) => request.post("user/code_img", params, option);


/**
 * 图片链接转base64
 * 
 */
export function imgToBase(data) {
	return request.post('common/base64', data);
}
/**
 * 获取协议
 * 
 */
export function getAgreementApi(key) {
	return request.get('agreement/' + key, {}, { noAuth: true });
}
/**
 * 获取协议
 * 
 */
export function getIntegralInfo() {
	return request.get('user/integral/info');
}
/**
 * 获取店铺列表
 * 
 */
export function getStoreList(data) {
	return request.get('user/services', data);
}

/*
	获取补贴说明
*/

export function commissionDescription() {
	return request.get('agreement/sys_extension_agree')
}
/*
	获取用户分销等级信息
*/

export function getBrokerageInfo() {
	return request.get('user/brokerage/info')
}
/*
	获取用户分销等级表格数据
*/

export function getBrokerageGrade() {
	return request.get('user/brokerage/all')
}
/*
	分销员升级提醒
*/

export function brokerageNotice(data) {
	return request.get(`user/brokerage/notice`, data)
}
/*
	口令解析
*/

export function pwdResolution(data) {
	return request.get(`command/copy?key=${data}`)
}
/*
	获取补贴说明
*/

export function getInstructions(key) {
	return request.get(`agreement/${key}`)
}
/*
	会员信息
*/

export function memberInfo() {
	return request.get('user/member/info')
}
/**
 * 成长值记录
 * @param object data
 * 
 */
export function growthValueRecord(data) {
	return request.get('user/member/log', data)
}

/**
 * 协议规则列表
 * @param object data
 * 
 */
export function cacheLst() {
	return request.get('agreement_lst', {}, { noAuth: true })
}

/**
 * 协议规则列表对应的数据
 * @param object data
 * 
 */
export function cacheInfo(key) {
	return request.get(`agreement/${key}`, {}, { noAuth: true })
}
/**
 * 注销账户
 * @param object data
 * 
 */
export function userOut(data) {
	return request.post(`user/cancel`, data)
}
/**
 * 获取聊天用户信息
 * @param object data
 * 
 */
export function serviceUser(merId, uid) {
	return request.get(`service/user/${merId}/${uid}`)
}
/**
 * 保存聊天用户备注
 * @param object data
 * 
 */
export function serviceSaveMark(merId, uid, mark) {
	return request.post(`service/mark/${merId}/${uid}`, { mark })
}


/**
 * 绑定银行卡
 */
export function bindBank(params) {
	return request.post('user/bind_banks', params);
}

/**
 * 获取银行卡列表
 */
export function getBankList() {
	return request.get('user/banks_list');
}

/**
 * 解绑卡
 */
export function removeBindBank(id) {
	return request.post(`user/del_banks/${id}`);
}

/**
 * 实名认证
 */
export function authentication(params) {
	return request.post('user/real_names', params);
}

/**
 * 修改支付密码
 */
export function changePayPwd(data) {
	return request.post('user/change_pay_pwd', data, {
		noAuth: true
	})
}


/**
 * 会员详情
 */
export function getlevelInfo() {
	return request.get("user/level_list");
}

/**
 * 会员任务完成情况
 */
export const getTaskFulfillListApi = (params, option) => request.get("user/task_list", params, option);


/**
 * 焕际值转赠
 */
export function giveHaiHui(params) {
	return request.post('user/coupon_deals', params);
}

/**
 * 焕际券转赠
 */
export function giveHjqApi(params) {
	return request.post('user/ticket_deals', params);
}

/**
 * 焕际值转赠
 */
export function giveHbjfApi(params) {
	return request.post('user/wait_released_deals', params);
}


/**
 * 捐赠区-我的申报
 */
export function declareApi(params) {
	return request.post('crowd/declare/create', params);
}

/**
 * 捐赠区-我的申报
 */
export function myDeclareApi(params) {
	return request.get('crowd/declare/my', params);
}

/**
 * 捐赠区-我的申报
 */
export function getCrowdApi(params) {
	return request.get('crowd/case/lst', params);
}

/**
 * 捐赠区-案例详情
 */
export function crowdDetailApi(id, params) {
	return request.get(`crowd/case/detail/${id}`, params);
}

/**
 * 捐赠区-申报详情
 */
export function declareDetailApi(id, params) {
	return request.get(`crowd/declare/detail/${id}`, params);
}

/**
 * 捐赠区-立即捐赠
 */
export function donateApi(id, params) {
	return request.post(`crowd/donation/${id}`, params);
}


/**
 * 捐赠区-捐赠记录
 */
export function getDonateListApi(params) {
	return request.get(`crowd/donation/lst`, params);
}

/**
 * 捐赠区-提现
 */
export function donatedCash(data) {
	return request.post('user/extract/create_crowd', data)
}

/**
 * 设置用户地址
 */
export function setUserAddrApi(data) {
	return request.post('user/set_address', data)
}

/**
 * 用户注销
 */
export const userCancelApi = (params, option) => request.post("user/cancel", params, option);


/**
 * 商品积分兑换补贴钱包配置
 */
export const buyPointsExchangeConfigApi = (params, option) => request.get("user/buy_points_exchange/config", params, option);


/**
 * 商品积分兑换补贴钱包
 */
export const buyPointsExchangeApi = (params, option) => request.post("user/buy_points_exchange", params, option);

/**
 * 购买绿巨人会员
 */
export const buyGreenVipApi = (params, option) => request.post("user/member_card/pay", params, option);


/**
 * 判断用户是否已经预约
 */
export const statusgetApi = (params, option) => request.get("user/block_stage_pre/status", params, option);

/**
 * 预约
 */
export const userSubscribeApi = (params, option) => request.post("user/block_stage_pre/pay", params, option);


/**
 * 嗨购-预约
 */
export const hibuyReserveApi = (params,option) => request.post("hibuy/reserve", params,option);

/**
 * 获取总裁中心数据
 */
export const ceoStatApi = (params,option) => request.get("user/ceo/stat", params,option);

/**
 * 嗨票兑换
 */
export const hiCouponExchangeApi = (params,option) => request.post("user/haiwen_exchange", params,option);
