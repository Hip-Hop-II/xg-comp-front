import type { ResPage } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 财务管理模块
 */
export const merchantBankQueryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBank/v1/apply/queryList`, params);
};

export const merchantBankMerDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBank/v1/apply/merDetail`, params);
};

export const merchantBankCommitApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBank/v1/apply/commit`, params);
};

export const merchantBankTelCodeApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBank/v1/apply/telCode`, params);
};

export const merchantBankReTelCodeApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBank/v1/apply/reTelCode`, params);
};

export const merchantBankQueryResultApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBank/v1/apply/queryResult`, params);
};

export const merchantBankDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBank/v1/apply/detail`, params);
};

export const merchantBankDeleteApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBank/v1/apply/delete`, params);
};

export const accountQueryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBank/v1/account/queryList`, params);
};

export const merchantShopQueryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantShop/v1/queryList`, params);
};

export const merchantShopDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantShop/v1/detail`, params);
};

export const merchantShopSaveApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantShop/v1/save`, params);
};

export const merchantShopPoCheckApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantShop/v1/poCheck`, params);
};

// 银行VB余额汇总查询
export const queryBalanceSummaryApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBankFund/v1/queryBalance`, params);
};

// 银行VB账户充值-查询列表
export const getAccountRechargeListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBankFund/v1/recharge/queryList`, params);
};

export const merchantBankFundRechargeCreateApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBankFund/v1/recharge/create`, params);
};

export const merchantBankFundRechargeCommitApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBankFund/v1/recharge/commit`, params);
};

export const merchantBankFundRechargeQueryResultApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBankFund/v1/recharge/queryResult`, params);
};

export const merchantBankFundBankInputQueryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBankFund/v1/bankInput/queryList`, params);
};

export const merchantBankFundBankOutputQueryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBankFund/v1/bankOutput/queryList`, params);
};

export const merchantAccountFundQueryBalanceApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/queryBalance`, params);
};

export const merchantAccountFundOutSettleAccountApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/outSettleAccount`, params);
};

export const merchantAccountFundAccountListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/accountList`, params);
};

export const merchantAccountFundFundWithdrawPageListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundWithdrawPageList`, params);
};

export const preFundWithdrawAddApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/preFundWithdrawAdd`, params);
};

export const fundWithdrawAddApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundWithdrawAdd`, params);
};

export const fundWithdrawDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundWithdrawDetail`, params);
};

export const fundWithdrawApproveApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundWithdrawApprove`, params);
};

export const fundWithdrawCancelApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundWithdrawCancel`, params);
};

export const fundSettlementPageListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundSettlementPageList`, params);
};

export const fundSettlementDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundSettlementDetail`, params);
};

export const getBankAccApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBankFund/v1/recharge/getBankAcc`, params);
};

export const rechargeCancelApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantBankFund/v1/recharge/cancel`, params);
};

export const fundSettlementToSubMerApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundSettlementToSubMer`, params);
};

export const fundSettlementAddApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundSettlementAdd`, params);
};

export const fundSettlementToSubMerBanksApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundSettlementToSubMerBanks`, params);
};

export const fundSettlementCancelApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundSettlementCancel`, params);
};

export const fundSettlementApproveApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundSettlementApprove`, params);
};

export const merchantShopPoQueryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantShopPo/v1/queryList`, params);
};

export const merchantShopPoDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantShopPo/v1/detail`, params);
};

export const withdrawQueryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchantAccountFund/v1/subMer/withdrawQueryList`, params);
};

export const accountChangeLinePageListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/accountChangeLine/v1/accountChangeLinePageList`, params);
};

export const subMerchantAccountFundQueryListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchantAccountFund/v1/queryList`, params);
};

export const fundRuleDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchantAccountFund/v1/fundRuleDetail`, params);
};

export const fundRuleSaveApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/subMerchantAccountFund/v1/fundRuleSave`, params);
};

export const consumerAccountPageListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumerAccount/v1/consumerAccountPageList`, params);
};

export const consumerAccountDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumerAccount/v1/consumerAccountDetail`, params);
};

export const consumerAccountSubmitApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumerAccount/v1/grant`, params);
};

export const consumerAccountRiskRuleApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumerAccount/v1/riskRule`, params);
};

export const consumerAccountRiskApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/consumerAccount/v1/risk`, params);
};

export const realAuthPageListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/realAuth/v1/realAuthPageList`, params);
};

export const realAuthDetailApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/realAuth/v1/realAuthDetail`, params);
};

export const merchantShopPoListApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantShopPo/v1/queryList`, params);
};

export const merchantAccountFundApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/queryBalance`, params);
};

export const fundWithdrawCommitApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundWithdrawCommit`, params);
};

export const fundSettlementCommitApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchantAccountFund/v1/fundSettlementCommit`, params);
};

export const merchantSaveCommitApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchant/v1/save`, params);
};

export const merchantSaveDetailCommitApi = (params: any) => {
  return http.post<ResPage<any>>(PORT1 + `/merchant/v1/saveDetail`, params);
};

export const merchantDetailsApi = (data: any) => {
  return http.post(PORT1 + `/merchant/v1/detail`, data);
};

export const subMerFundWithdrawApproveApi = (data: any) => {
  return http.post(PORT1 + `/merchantAccountFund/v1/subMerFundWithdrawApprove`, data);
};

export const saveFileApi = (data: any) => {
  return http.post(PORT1 + `/merchant/v1/saveFile`, data);
};

export const commitApi = (data: any) => {
  return http.post(PORT1 + `/merchant/v1/commit`, data);
};

export const delFileApi = (data: any) => {
  return http.post(PORT1 + `/merchant/v1/delFile`, data);
};

export const fundWithdrawResultQueryApi = (data: any) => {
  return http.post(PORT1 + `/merchantAccountFund/v1/fundWithdrawResultQuery`, data);
};

export const consumerWithdrawQueryListApi = (data: any) => {
  return http.post(PORT1 + `/consumerAccount/v1/consumer/withdrawQueryList`, data);
};
export const consumerFundWithdrawApproveApi = (data: any) => {
  return http.post(PORT1 + `/merchantAccountFund/v1/consumerFundWithdrawApprove`, data);
};
export const consumerFundWithdrawCancelApi = (data: any) => {
  return http.post(PORT1 + `/consumerAccount/v1/consumer/fundWithdrawCancel`, data);
};
export const consumerFundWithdrawCommitApi = (data: any) => {
  return http.post(PORT1 + `/consumerAccount/v1/consumer/fundWithdrawCommit`, data);
};
export const consumerFundWithdrawResultQueryApi = (data: any) => {
  return http.post(PORT1 + `/consumerAccount/v1/consumer/fundWithdrawResultQuery`, data);
};

export const subMerchantAccountFundWithdrawCancelApi = (data: any) => {
  return http.post(PORT1 + `/subMerchantAccountFund/v1/subMer/fundWithdrawCancel`, data);
};

export const subMerchantAccountFundWithdrawCommitApi = (data: any) => {
  return http.post(PORT1 + `/subMerchantAccountFund/v1/subMer/fundWithdrawCommit`, data);
};

export const consumerAccountChangeLinePageListApi = (data: any) => {
  return http.post(PORT1 + `consumerAccountChangeLine/v1/consumerAccountChangeLinePageList`, data);
};

export const consumerAccountGrantTelCodeApi = (data: any) => {
  return http.post(PORT1 + `/consumerAccount/v1/grantTelCode`, data);
};

export const consumerAccountReplyTelCodeApi = (data: any) => {
  return http.post(PORT1 + `/consumerAccount/v1/replyTelCode`, data);
};
