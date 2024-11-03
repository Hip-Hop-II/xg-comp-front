import type { ResPage } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 人员管理模块
 */
export const queryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerInvite/v1/queryList`, params);
};

export const subMerInviteCreateApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerInvite/v1/create`, params);
};

export const subMerInviteSaveApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerInvite/v1/save`, params);
};

export const subMerInviteCloseeApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerInvite/v1/close`, params);
};

export const subMerInviteDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerInvite/v1/detail`, params);
};

export const subMerInviteParentMerApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerInvite/v1/parentMer`, params);
};

// 关联方账户列表
export const relatedPartyAccountsListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchant/v1/queryList`, params);
};

// 关联方账户详情
export const relatedPartyAccountsDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchant/v1/detail`, params);
};

// 关联方账户详情附件
export const relatedPartyAccountAttachmentsDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchant/v1/attachments`, params);
};

export const approveApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchant/v1/approve`, params);
};

export const riskApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchant/v1/risk`, params);
};

export const sendSignApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchant/v1/sendSign`, params);
};

export const riskRuleApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchant/v1/riskRule`, params);
};

export const consumerQueryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumer/v1/queryList`, params);
};

export const consumerPointsApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumer/v1/points`, params);
};

export const consumerPwdSetApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumer/v1/pwdSet`, params);
};

export const consumerRiskApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumer/v1/risk`, params);
};

export const consumerDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumer/v1/detail`, params);
};

export const consumerRiskRuleApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumer/v1/riskRule`, params);
};

export const subMerRolesApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerInvite/v1/subMerRoles`, params);
};
