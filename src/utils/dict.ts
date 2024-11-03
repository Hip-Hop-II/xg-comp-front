// ? 系统全局字典

/**
 * @description：用户性别
 */
export const genderType = [
  { label: "男", value: 1 },
  { label: "女", value: 2 }
];

/**
 * @description：用户状态
 */
export const userStatus = [
  { label: "启用", value: 1, tagType: "success" },
  { label: "禁用", value: 0, tagType: "danger" }
];

export const AccessValueToUrl = {
  "0": "/inventory/access",
  "1": "/inventory/qrcodes/features",
  "2": "/inventory/qrcodes/benefits",
  "3": "/inventory/qrcodes/split/hardware",
  "4": "/inventory/qrcodes/split/earning-tasks",
  "5": "/inventory/qrcodes/split/supply-chain",
  "6": "/inventory/qrcodes/split/data-plans"
};
