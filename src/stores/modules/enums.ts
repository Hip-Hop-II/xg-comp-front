import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";
import type { CascaderOption } from "element-plus";

interface ElOption {
  label: string;
  value: string;
  [propName: string]: any;
}

interface EnumState {
  provinceCityCounty: CascaderOption[];
  logisticComps: ElOption[];
  bankListComps: ElOption[];
  industryTypeComps: ElOption[];
}

export default defineStore({
  id: "enums",
  state: (): EnumState => ({
    provinceCityCounty: [],
    logisticComps: [],
    bankListComps: [],
    industryTypeComps: []
  }),
  getters: {},
  actions: {
    setProvinceCityCounty(data: CascaderOption[]) {
      this.provinceCityCounty = data;
    },
    setLogisticComps(data: ElOption[]) {
      this.logisticComps = data;
    },
    getProvinceName(code: string) {
      const province = this.provinceCityCounty.find((item: CascaderOption) => item.value === code);
      return province?.label || "";
    },
    getCityName(provinceCode: string, cityCode: string) {
      const province = this.provinceCityCounty.find((item: CascaderOption) => item.value === provinceCode);
      const city = province?.children?.find((item: CascaderOption) => item.value === cityCode);
      return city?.label || "";
    },
    getCountyName(provinceCode: string, cityCode: string, countyCode: string) {
      const province = this.provinceCityCounty.find((item: CascaderOption) => item.value === provinceCode);
      const city = province?.children?.find((item: CascaderOption) => item.value === cityCode);
      const county = city?.children?.find((item: CascaderOption) => item.value === countyCode);
      return county?.label || "";
    },
    setBankListComps(data: ElOption[]) {
      this.bankListComps = data;
    },
    setIndustryTypeComps(data: ElOption[]) {
      this.industryTypeComps = data;
    }
  },
  persist: piniaPersistConfig("enums")
});
