declare namespace Inventory {
  interface DeviceCodeListItemForm {
    id: string;
    deviceCode: string;
    deviceName: string;
    deviceModel: string;
    deviceBrand: string;
    statusCode: string;
    statusMsg: string;
    manufacturerMerchantNum: string;
  }
  interface DeviceCodeListItem extends DeviceCodeListItemForm {
    fileName: string;
    importTime: string;
    manufacturerMerchantName: string;
    createTime: string;
    createBy: string;
    updateTime: string;
    updateBy: string;
  }
  interface ManufacturerMerchants {
    merchantName: string;
    merchantNum: string;
  }
  interface QrCodeListItem {
    bindUserId: string;
    bindUserName: string;
    deviceBrand: string;
    deviceClassifyCode: string;
    deviceClassifyName: string;
    deviceCode: string;
    deviceModel: string;
    deviceName: string;
    id: string;
    manufacturer: string;
    sellMerchantName: string;
    sellMerchantNum: string;
    sellMerchantPrice: string;
    sellPrice: string;
    sellUserDrawTime: string;
    sellUserId: string;
    sellUserName: string;
    statusCode: string;
    statusMsg: string;
    telecom: string;
    telecomCardIccid: string;
    telecomCardTelephone: string;
  }
  interface SplitRuleSample {
    ruleId: string;
    ruleName: string;
  }

  interface SplitRuleFormData {
    id: string;
    autoSettleDay: number;
    startTime: string | number;
    endTime: string | number;
    remark: string;
    ruleName: string;
    statusCode: string;
  }

  interface SplitRuleLineDetail {
    id: string;
    ruleId: string;
    merchantRoleId: string;
    merchantRoleName: string;
    splitType: string;
    splitValue: number;
    statusMsg: string;
    statusCode: string;
    memberId: string;
    memberName: string;
  }

  interface SplitRule extends SplitRuleFormData {
    splitBizType: string;
    splitBizId: number;
    ruleInstallRole: string;
    permitUpdate: string;
    saasRuleId: string;
    statusMsg: string;
    splitRuleLineDetailRes: SplitRuleLineDetail[];
  }

  interface MerchantTask {
    clickCount: number;
    endTime: number;
    finshCount: number;
    id: string;
    isTop: number;
    merchantName: string;
    merchantNum: string;
    money: number;
    points: number;
    saasMerchantName: string;
    saasMerchantNum: string;
    serialNum: string;
    splitRuleId: string;
    splitRuleName: string;
    startTime: number;
    statusCode: string;
    statusMsg: string;
    taskMerchantName: string;
    taskMerchantNum: string;
    taskName: string;
    taskOrder: number;
    taskStatus: string;
    taskType: string;
    viewCount: number;
  }

  interface Authority {
    statusCode: string;
    id: string;
    userName: string;
    userTelephone: string;
    authFunctions: string;
    realAuth: string;
    realImage: string;
    merchantNum: number;
    merchantName: string;
    saasMerchantName: string;
    saasMerchantNum: string;
    statusMsg: string;
    createTime: string;
    createBy: string;
    updateTime: string;
    updateBy: string;
  }

  interface MerchantRole {
    roleId: string;
    roleName: string;
  }
  interface MerchantTaskDetailAdDetail {
    id: string;
    taskId: string;
    duration: string;
    adType: string;
    adUrl: string;
  }

  interface MerchantTaskDetail extends MerchantTask {
    taskResp: {
      id: string;
      serialNum: string;
      taskType: string;
      taskName: string;
      taskMerchantNum: string;
      taskMerchantName: string;
      isTop: number;
      taskOrder: number;
      points: number;
      money: number;
      startTime: string;
      endTime: string;
      statusCode: string;
      taskAdDetail: MerchantTaskDetailAdDetail;
    };
  }

  interface MerchantApi {
    id: string;
    merchantNum: string;
    merchantName: string;
    saasMerchantNum: string;
    saasMerchantName: string;
    appType: string;
    appUrl: string;
    appId: string;
    appKey: string;
    appPublicKey: string;
    appSecret: string;
    price: number;
    statusCode: string;
    statusName: string;
    createTime: string;
    createBy: string;
    updateTime: string;
    updateBy: string;
  }
}
