declare namespace BusinessSpace {
  interface AfterSaleAddressForm {
    id?: string;
    isDefault: number | undefined;
    receiveAddress: string;
    receiveArea: string;
    receiveCity: string;
    receiveProvince: string;
    receiveUserName: string;
    receiveUserTel: string;
    statusCode: string;
  }
  interface AddLogisticCompForm {
    defaultDeliveryCompany: number | undefined;
    deliveryCompanyCode: string;
    deliveryCompanyName: string;
  }
  interface LogisticCompDataItem extends AddLogisticCompForm {
    id: number;
  }
  interface FreightTemplateLineItem {
    templateId?: number;
    province: string;
    provinceCode: string;
    freight: number;
    statusCode: string;
  }
  interface FreightTemplateForm {
    templateName: string;
    remark: string;
    statusCode: string;
    lines: FreightTemplateLineItem[];
  }
  interface ProductCategory {
    id?: string;
    classifyType: string;
    classifyCode: string;
    classifyName: string;
    splitRuleId?: string;
    splitRuleName?: string;
    iconUrl?: string;
    parentClassifyCode: string;
    respList?: ProductCategory[];
    sort?: number;
    statusCode: string;
    leaf?: boolean;
  }

  interface GoodsItemDetail {
    id: number;
    smallImg: string;
    goodsParameter: string;
    goodsDetailImg: string;
    goodsIndexImg: string;
  }

  interface GoodsItemModel {
    id?: string;
    goodsId: string;
    modelImgUrls: string;
    goodsModel: string;
    sellPrice: number;
    costPrice: number;
    inventoryCount: number;
    inventoryLowNum: number;
    goodsNum: string;
    weight: number;
    volume: string;
    merchantNum: number;
    merchantName: string;
    saasMerchantName: string;
    saasMerchantNum: number;
    statusCode: string;
  }

  interface GoodsItem {
    id: string;
    classifyId: number;
    classifyName: string;
    goodsName: string;
    splitRuleId: string;
    splitRuleName: string;
    supplyNum: number;
    goodsRemark: string;
    goodsListImg: string;
    sellLowPrice: number;
    sellStatus: number;
    inventoryLowNum: number;
    profitSplitRuleId: number;
    profitSplitRuleName: string;
    freightTemplateId: number;
    freightTemplateName: string;
    payPointsRuleType: string;
    payPointsRuleValue: number;
    deductionPointsRuleType: string;
    deductionPointsRuleValue: number;
    payCashRuleType: string;
    payCashRuleValue: number;
    deductionCashRuleType: string;
    deductionCashRuleValue: number;
    backAddressId: number;
    sellAfterSupport: string;
    sellHot: number;
    sellCount: number;
    totalSellMoney: number;
    statusCode: string;
    detail: GoodsItemDetail;
    models: GoodsItemModel[];
  }

  interface MerchantHelpDoc {
    docContent: string;
    docContentType: string;
    docModel: string;
    docTitle: string;
    docType: string;
    id: string;
    statusCode: string;
    statusMsg: string;
  }

  interface MallConfigurateItem {
    id: string;
    mallType: string;
  }

  interface MallConfigurateDetail {
    id: string;
    mallType: string;
    mallTemplateCode: string;
    mallUrl: string;
    mallName: string;
    mallLogo: string;
    channelType: string;
    channelWxpubUse: string;
    companyWechatServiceImage: string;
    serviceTelephone: string;
    serviceTime: string;
    channelWxpubBack: {
      [key: string]: string;
    }[];
    channelWxpgUse: string;
    channelWxpgBack: {
      [key: string]: string;
    }[];
    channelAliliveUse: string;
    channelAliliveBack: {
      [key: string]: string;
    }[];
    receiveDay: number;
    sendHour: number;
  }

  interface TelephoneMsgItem {
    name: string;
    bizId: string;
    bizType: string;
    id: string;
    sendStatus: string;
    sendTime: string;
    settleId: string;
    settlePrice: number;
    settleStatus: string;
    smsCode: string;
    telephone: string;
  }

  interface ElectronicSignItem {
    bizId: number;
    bizType: string;
    endTime: number;
    id: string;
    memberName: string;
    orderCode: string;
    outTradeNo: string;
    settleId: number;
    settlePrice: number;
    settleStatus: number;
    signUrl: string;
    startTime: number;
    statusCode: string;
    statusMsg: string;
    telephone: string;
    updateTime: number;
  }

  interface PlatformPackagePo {
    companyName: string;
    id: number;
    packageDesc: string;
    packageName: string;
    quantity: number;
    serviceTel: string;
    useQuantity: number;
    validityEndTime: number;
  }

  interface PlatformPackage {
    companyName: string;
    id: number;
    officialPrice: number;
    packageDesc: string;
    packageName: string;
    packageType: string;
    price: number;
    quantity: number;
    serviceTel: string;
    validityDay: number;
  }

  interface PlatformPackageOrder {
    id: string;
    packageId: string;
    packageType: string;
    packageName: string;
    packageDesc: string;
    quantity: number;
    price: number;
    validityDay: number;
    serviceTel: string;
    companyName: string;
    startTime: string;
  }

  interface SignTemplateFileDoc {
    docId: string;
    docName: string;
    fieldId: string;
  }

  interface SignTemplate {
    id: string;
    templateName: string;
    statusCode: string;
  }

  interface SignFill {
    signUserRole: string;
    signUserType: string;
    fileDocs: SignTemplateFileDoc[];
  }

  interface SignTemplateDetails extends SignTemplate {
    signFills: SignFill[];
  }

  interface SignTask {
    id: string;
    templateId: string;
    taskCode: string;
    taskName: string;
    expiresTime: string;
    outTradeNo: string;
    outTradeId: string;
    statusMsg: string;
    startTime: string;
    endTime: string;
    statusCode: string;
  }

  interface SignUser {
    signUserId: string;
    statusMsg: string;
    statusCode: string;
    signUserName: string;
    signUrl: string;
  }

  interface SignInfo {
    authType: string;
    url: string;
    type: string;
    success: number;
    errorMsg: string;
  }

  interface SignProgress {
    statusCode: string;
    statusMsg: string;
    signUsers: SignUser[];
  }
}
