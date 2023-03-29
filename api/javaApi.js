import { JAVA_URL as url } from "@/config/app.js"
import requset from "@/utils/request.js"

/**
 * 代理商详情
 */
export const getProxyShopDetailApi = () => requset.get(`${url}/hjAgentUser/findByUid`, {}, { handleErr: false });


/**
 * 代理商申请
 */
export const proxyShopApplyApi = (params) => requset.post(`${url}/hjAgentVerify/put`, params);


/**
 * 代理商申请记录
 */
export const getApplyRecord = () => requset.get(`${url}/hjAgentVerify/findByUid`);


/**
 * 代理商收益明细
 */
export const dateilRecordApi = (params) => requset.get(`${url}/hjAgentUser/findAgentIncome`,params);