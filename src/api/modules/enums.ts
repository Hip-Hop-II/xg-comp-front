import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { ProvinceCityArea, LogisticComp } from "../interface";

export const queryProvinceCityAreas = () => {
  return http.post<ProvinceCityArea[]>(PORT1 + `/comm/v1/provinceCityCodePageList`);
};

export const queryLogisticComps = () => {
  return http.post<LogisticComp[]>(PORT1 + `/comm/v1/deliveryCompanyPageList`);
};

export const bankListComps = () => {
  return http.post<LogisticComp[]>(PORT1 + `/comm/v1/bankList`);
};

export const industryTypeComps = () => {
  return http.post<LogisticComp>(PORT1 + `/comm/v1/mcc`);
};
