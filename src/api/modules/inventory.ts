import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

export const merchantDeviceImportPageListApi = (data: any) => {
  return http.post<Inventory.DeviceCodeListItem[]>(PORT1 + `/merchantDeviceImport/v1/merchantDeviceImportPageList`, data);
};

export const merchantDeviceImportAddApi = (data: { classifyCode: string; manufacturerMerchantNum: string; file: File }) => {
  const formData = new FormData();
  formData.append("file", data.file);
  return http.post(
    PORT1 +
      `/merchantDeviceImport/v1/merchantDeviceImportAdd?classifyCode=${data.classifyCode}&manufacturerMerchantNum=${data.manufacturerMerchantNum}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

export const merchantDeviceExportApi = (data: any) => {
  return http.post<{ downloadPath: string }>(PORT1 + `/merchantDeviceImport/v1/merchantDeviceExport`, data);
};

export const merchantDeviceSuccessApi = (data: any) => {
  return http.post(PORT1 + `/merchantDeviceImport/v1/merchantDeviceSuccess`, data);
};

export const merchantDeviceImportUpdateApi = (data: any) => {
  return http.post(PORT1 + `/merchantDeviceImport/v1/merchantDeviceImportUpdate`, data);
};

export const merchantDeviceImportDetailApi = (data: any) => {
  return http.post(PORT1 + `/merchantDeviceImport/v1/merchantDeviceImportDetail`, data);
};

export const merchantDeviceImportDeleteApi = (data: any) => {
  return http.post(PORT1 + `/merchantDeviceImport/v1/merchantDeviceImportDelete`, data);
};

export const manufacturerMerchantsApi = () => {
  return http.post<Inventory.ManufacturerMerchants[]>(PORT1 + `/merchantDeviceImport/v1/manufacturerMerchants`);
};

export const merchantDevicePageListApi = (data: any) => {
  return http.post(PORT1 + `/merchantDevice/v1/merchantDevicePageList`, data);
};

export const merchantDeviceBackApi = (data: any) => {
  return http.post(PORT1 + `/merchantDevice/v1/merchantDeviceBack`, data);
};

export const merchantDeviceBindSimApi = (data: any) => {
  return http.post(PORT1 + `/merchantDevice/v1/merchantDeviceBindSim`, data);
};

export const merchantDeviceSellerListApi = () => {
  return http.post<Inventory.ManufacturerMerchants[]>(PORT1 + `/merchantDevice/v1/merchantDeviceSellerList`);
};

export const merchantDeviceBindSellerApi = (data: any) => {
  return http.post(PORT1 + `/merchantDevice/v1/merchantDeviceBindSeller`, data);
};

export const merchantDeviceSplitRuleApi = (data: any) => {
  return http.post<Inventory.SplitRuleSample[]>(PORT1 + `/merchantDevice/v1/merchantDeviceSplitRule`, data);
};

export const merchantDeviceSplitRuleDetailApi = (data: any) => {
  return http.post<Inventory.SplitRule>(PORT1 + `/merchantDevice/v1/merchantDeviceSplitRuleDetail`, data);
};

export const merchantDeviceDetailApi = (id: string) => {
  return http.post(PORT1 + `/merchantDevice/v1/merchantDeviceDetail`, { id });
};

export const splitRulePageListApi = (data: any) => {
  return http.post(PORT1 + `/splitRule/v1/splitRulePageList`, data);
};

export const splitRuleAddApi = (data: any) => {
  return http.post<Inventory.SplitRule>(PORT1 + `/splitRule/v1/splitRuleAdd`, data);
};

export const splitRuleUpdateApi = (data: any) => {
  return http.post(PORT1 + `/splitRule/v1/splitRuleUpdate`, data);
};

export const splitRuleDetailApi = (data: any) => {
  return http.post(PORT1 + `/splitRule/v1/splitRuleDetail`, data);
};

export const splitRuleTaskDetailApi = (data: any) => {
  return http.post<Inventory.SplitRule>(PORT1 + `/splitRule/v1/splitRuleTaskDetail`, data);
};

export const splitRuleTaskSaveApi = (data: any) => {
  return http.post<Inventory.SplitRule>(PORT1 + `/splitRule/v1/splitRuleTaskSave`, data);
};

export const splitRuleGoodsDetailApi = (data: any) => {
  return http.post<Inventory.SplitRule>(PORT1 + `/splitRule/v1/splitRuleGoodsDetail`, data);
};

export const splitRuleGoodsSaveApi = (data: any) => {
  return http.post<Inventory.SplitRule>(PORT1 + `/splitRule/v1/splitRuleGoodsSave`, data);
};

export const splitRuleMobileDetailApi = (data: any) => {
  return http.post<Inventory.SplitRule>(PORT1 + `/splitRule/v1/splitRuleMobileDetail`, data);
};

export const splitRuleMobileSaveApi = (data: any) => {
  return http.post<Inventory.SplitRule>(PORT1 + `/splitRule/v1/splitRuleMobileSave`, data);
};

export const splitRuleLinePageListApi = (data: any) => {
  return http.post(PORT1 + `/splitRuleLine/v1/splitRuleLinePageList`, data);
};

export const splitRuleLineAddApi = (data: any) => {
  return http.post(PORT1 + `/splitRuleLine/v1/splitRuleLineAdd`, data);
};

export const splitRuleLineUpdateApi = (data: any) => {
  return http.post(PORT1 + `/splitRuleLine/v1/splitRuleLineUpdate`, data);
};

export const splitRuleLineDetailApi = (data: any) => {
  return http.post(PORT1 + `/splitRuleLine/v1/splitRuleLineDetail`, data);
};

export const querySubMerchantsApi = (data: any) => {
  return http.post<Inventory.ManufacturerMerchants[]>(PORT1 + `/splitRuleLine/v1/subMerchants`, data);
};

export const merchantTaskPageListApi = (data: any) => {
  return http.post<Inventory.MerchantTask[]>(PORT1 + `/merchantTask/v1/merchantTaskPageList`, data);
};

export const merchantTaskAddApi = (data: any) => {
  return http.post(PORT1 + `/merchantTask/v1/merchantTaskAdd`, data);
};

export const merchantTaskUpdateApi = (data: any) => {
  return http.post(PORT1 + `/merchantTask/v1/merchantTaskUpdate`, data);
};

export const merchantTaskDetailApi = (data: any) => {
  return http.post<Inventory.MerchantTaskDetail>(PORT1 + `/merchantTask/v1/merchantTaskDetail`, data);
};

export const taskPageListApi = (data: any) => {
  return http.post<Inventory.MerchantTask[]>(PORT1 + `/task/v1/taskPageList`, data);
};

export const merchantAuthorityPageListApi = (data: any) => {
  return http.post<Inventory.Authority[]>(PORT1 + `/merchantAuthority/v1/merchantAuthorityPageList`, data);
};

export const merchantAuthorityAddApi = (data: any) => {
  return http.post(PORT1 + `/merchantAuthority/v1/merchantAuthorityAdd`, data);
};

export const merchantAuthorityUpdateApi = (data: any) => {
  return http.post(PORT1 + `/merchantAuthority/v1/merchantAuthorityUpdate`, data);
};

export const merchantAuthorityDetailApi = (data: any) => {
  return http.post(PORT1 + `/merchantAuthority/v1/merchantAuthorityDetail`, data);
};

export const subMerchantsRoleApi = () => {
  return http.post<Inventory.MerchantRole[]>(PORT1 + `/splitRuleLine/v1/subMerchantsRole`, { startPage: false });
};

export const merchantApiPageListApi = (merchantNum: string, appType: string) => {
  return http.post<Inventory.MerchantApi[]>(PORT1 + `/merchantApp/v1/merchantAppPageList`, {
    startPage: false,
    appType,
    merchantNum
  });
};

export const merchantApiUpdateApi = (data: any) => {
  return http.post(PORT1 + `/merchantApp/v1/merchantAppSaveOrUpdate`, data);
};
