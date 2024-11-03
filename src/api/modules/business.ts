import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { categroyListToTree } from "@/utils";

export const queryReturnAddress = (data: any) => {
  return http.post(PORT1 + `/mallBackAddress/v1/mallBackAddressPageList`, data);
};

export const addReturnAddress = (data: BusinessSpace.AfterSaleAddressForm) => {
  return http.post(PORT1 + `/mallBackAddress/v1/mallBackAddressAdd`, data);
};

export const updateReturnAddress = (data: BusinessSpace.AfterSaleAddressForm) => {
  return http.post(PORT1 + `/mallBackAddress/v1/mallBackAddressUpdate`, data);
};

export const queryLogisticComps = (data: any) => {
  return http.post(PORT1 + `/mallDeliveryCompany/v1/mallDeliveryCompanyPageList`, data);
};

export const addLogisticComp = (data: BusinessSpace.AddLogisticCompForm) => {
  return http.post(PORT1 + `/mallDeliveryCompany/v1/mallDeliveryCompanyAdd`, data);
};

export const deleteLogisticComp = (ids: number[]) => {
  return http.post(PORT1 + `/mallDeliveryCompany/v1/mallDeliveryCompanyDelete`, ids);
};

export const setReceiveDay = (data: { receiveDay: number }) => {
  return http.post(PORT1 + `/mallConfigurate/v1/setReceiveDay`, data);
};

export const setSendHour = (data: { sendHour: number }) => {
  return http.post(PORT1 + `/mallConfigurate/v1/setSendHour`, data);
};

export const queryFreightTemplate = (data: any) => {
  return http.post(PORT1 + `/freightTemplate/v1/freightTemplatePageList`, data);
};

export const addFreightTemplate = (data: BusinessSpace.FreightTemplateForm) => {
  return http.post(PORT1 + `/freightTemplate/v1/freightTemplateAdd`, data);
};

export const updateFreightTemplate = (data: BusinessSpace.FreightTemplateForm) => {
  return http.post(PORT1 + `/freightTemplate/v1/freightTemplateUpdate`, data);
};

export const queryFreightTemplateDetail = (id: string) => {
  return http.post(PORT1 + `/freightTemplate/v1/freightTemplateDetail`, { id });
};

export const queryMallConfigurateDetail = (id?: string) => {
  return http.post<BusinessSpace.MallConfigurateDetail>(PORT1 + `/mallConfigurate/v1/mallConfigurateDetail`, { id });
};

export const queryProductCategoryTree = (classifyType: string, parentClassifyCode: string) => {
  return http.post<BusinessSpace.ProductCategory[]>(PORT1 + `/merchantClassify/v1/merchantClassifyPageList`, {
    classifyType,
    parentClassifyCode,
    startPage: false
  });
};

export const queryProductCategoryList = async (classifyType: string) => {
  const res = await http.post<BusinessSpace.ProductCategory[]>(PORT1 + `/merchantClassify/v1/merchantClassifyPageList`, {
    classifyType,
    startPage: false
  });
  return categroyListToTree(res.data);
};

export const queryProductCategoryDetails = (id: string) => {
  return http.post<BusinessSpace.ProductCategory>(PORT1 + `/merchantClassify/v1/merchantClassifyDetail`, {
    id
  });
};

export const addProductCategory = (data: BusinessSpace.ProductCategory) => {
  return http.post(PORT1 + `/merchantClassify/v1/merchantClassifyAdd`, data);
};

export const updateProductCategory = (data: BusinessSpace.ProductCategory) => {
  return http.post(PORT1 + `/merchantClassify/v1/merchantClassifyUpdate`, data);
};

export const queryGoodsPageList = (data: any) => {
  return http.post<BusinessSpace.GoodsItem>(PORT1 + `/goods/v1/goodsPageList`, data);
};

export const addGoodsFirstInfo = (data: any) => {
  return http.post(PORT1 + `/goods/v1/goodsFirstAdd`, data);
};

export const addGoodsSecondInfo = (data: any) => {
  return http.post(PORT1 + `/goods/v1/goodsSecondAdd`, data);
};

export const addGoodsThirdInfo = (data: any) => {
  return http.post(PORT1 + `/goods/v1/goodsThirdAdd`, data);
};

export const addGoodsFourthInfo = (data: any) => {
  return http.post(PORT1 + `/goods/v1/goodsFourthAdd`, data);
};

export const queryGoodsModelList = (data: any) => {
  return http.post<BusinessSpace.GoodsItemModel[]>(PORT1 + `/goodsModel/v1/goodsModelPageList`, data);
};

export const addGoodsModel = (data: any) => {
  return http.post(PORT1 + `/goodsModel/v1/goodsModelAdd`, data);
};

export const updateGoodsModel = (data: any) => {
  return http.post(PORT1 + `/goodsModel/v1/goodsModelUpdate`, data);
};

export const deleteGoodsModel = (data: any) => {
  return http.post(PORT1 + `/goodsModel/v1/goodsModelDelete`, data);
};

export const getSupplyListApi = () => {
  return http.post<Inventory.ManufacturerMerchants[]>(PORT1 + `/goods/v1/getSupplyList`);
};

export const merchantTaskConsumerPageListApi = (data: any) => {
  return http.post(PORT1 + `/merchantTaskConsumer/v1/merchantTaskConsumerPageList`, data);
};

export const merchantTaskConsumerUpdateApi = (data: any) => {
  return http.post(PORT1 + `/merchantTaskConsumer/v1/merchantTaskConsumerUpdate`, data);
};

export const merchantTaskConsumerDetailApi = (id: string) => {
  return http.post(PORT1 + `/merchantTaskConsumer/v1/merchantTaskConsumerDetail`, { id });
};

export const merchantHelpDocPageListApi = (docModel: string) => {
  return http.post<BusinessSpace.MerchantHelpDoc[]>(PORT1 + `/merchantHelpDoc/v1/merchantHelpDocPageList`, {
    docModel,
    startPage: false
  });
};

export const merchantHelpDocUpdateApi = (data: BusinessSpace.MerchantHelpDoc) => {
  return http.post(PORT1 + `/merchantHelpDoc/v1/merchantHelpDocUpdate`, data);
};

export const mallConfiguratePageListApi = () => {
  return http.post<BusinessSpace.MallConfigurateItem[]>(PORT1 + `/mallConfigurate/v1/mallConfiguratePageList`, {
    startPage: false
  });
};

export const mallConfigurateUpdateApi = (data: any) => {
  return http.post(PORT1 + `/mallConfigurate/v1/mallConfigurateUpdate`, data);
};

export const telephoneMsgPageListApi = (data: any) => {
  return http.post<BusinessSpace.TelephoneMsgItem[]>(PORT1 + `/telephoneMsg/v1/telephoneMsgPageList`, data);
};

export const electronicSignPageListApi = (data: any) => {
  return http.post<BusinessSpace.ElectronicSignItem[]>(PORT1 + `/electronicSign/v1/electronicSignPageList`, data);
};

export const platformPackagePoPageListApi = (data: any) => {
  return http.post<BusinessSpace.PlatformPackagePo[]>(PORT1 + `/platformPackagePo/v1/platformPackagePoPageList`, data);
};

export const platformPackagePageListApi = (data: any) => {
  return http.post<BusinessSpace.PlatformPackage[]>(PORT1 + `/platformPackage/v1/platformPackagePageList`, data);
};

export const platformPackagePoAddApi = (data: any) => {
  return http.post<BusinessSpace.PlatformPackageOrder>(PORT1 + `/platformPackagePo/v1/platformPackagePoAdd`, data);
};

export const platformPackagePoToPayApi = (data: any) => {
  return http.post<{ payUrl: string }>(PORT1 + `/platformPackagePo/v1/platformPackagePoToPay`, data);
};

export const platformPackagePoCancelApi = (data: any) => {
  return http.post(PORT1 + `/platformPackagePo/v1/platformPackagePoCancel`, data);
};

export const ocrRecordPageListApi = (data: any) => {
  return http.post(PORT1 + `/ocrRecord/v1/ocrRecordPageList`, data);
};

export const taskRecordExceptionApi = (data: any) => {
  return http.post(PORT1 + `/merchantTaskConsumer/v1/exception`, data);
};

export const taskRecordViolationApi = (data: any) => {
  return http.post(PORT1 + `/merchantTaskConsumer/v1/violation`, data);
};

export const weChatComplaintApi = (data: any) => {
  return http.post(PORT1 + `/weChatComplaint/list`, data);
};

export const weChatComplaintDetailApi = (data: any) => {
  return http.post(PORT1 + `/weChatComplaint/historyDetail`, data);
};

export const eleSignTemplatePageListApi = (data: any) => {
  return http.post<BusinessSpace.SignTemplate[]>(PORT1 + `/eleSignTemplate/v1/eleSignTemplatePageList`, data);
};

export const eleSignTemplateAddApi = (data: any) => {
  return http.post<{ url: string }>(PORT1 + `/eleSignTemplate/v1/eleSignTemplateAdd`, data);
};

export const eleSignTemplateContentUpdateApi = (data: any) => {
  return http.post<{ url: string }>(PORT1 + `/eleSignTemplate/v1/eleSignTemplateContentUpdate`, data);
};

export const eleSignTemplateUpdateApi = (data: any) => {
  return http.post(PORT1 + `/eleSignTemplate/v1/eleSignTemplateUpdate`, data);
};

export const eleSignTemplateDetailApi = (data: any) => {
  return http.post<BusinessSpace.SignTemplateDetails>(PORT1 + `/eleSignTemplate/v1/eleSignTemplateDetail`, data);
};

export const eleSignTaskPageListApi = (data: any) => {
  return http.post<BusinessSpace.SignTask[]>(PORT1 + `/eleSignTask/v1/eleSignTaskPageList`, data);
};

export const eleSignTemplateListApi = () => {
  return http.post<BusinessSpace.SignTemplate[]>(PORT1 + `/eleSignTask/v1/eleSignTemplateList`);
};

export const eleSignUserApi = (data: any) => {
  return http.post<BusinessSpace.SignFill[]>(PORT1 + `/eleSignTask/v1/eleSignUser`, data);
};

export const eleSignUserListApi = (data: any) => {
  return http.post<{ memberId: string; memberName: string }[]>(PORT1 + `/eleSignTask/v1/eleSignUserList`, data);
};

export const eleSignTaskAddApi = (data: any) => {
  return http.post<{ authType: string; url: string }>(PORT1 + `/eleSignTask/v1/eleSignTaskAdd`, data);
};

export const eleSignTaskProgressApi = (data: any) => {
  return http.post<BusinessSpace.SignProgress>(PORT1 + `/eleSignTask/v1/eleSignTaskProgress`, data);
};

export const eleSignTaskViewApi = (data: any) => {
  return http.post<{ url: string }>(PORT1 + `/eleSignTask/v1/eleSignTaskView`, data);
};
