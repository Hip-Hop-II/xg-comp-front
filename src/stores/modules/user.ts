import { defineStore } from "pinia";
import type { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({
    token: "",
    userInfo: {
      merchantName: "-",
      saasMerchantName: "-",
      merchantNum: "-",
      saasMerchantNum: "-"
    },
    dataType: {
      ConsumerStatus: [
        {
          type: "success",
          value: "正常"
        },
        {
          type: "close",
          value: "关闭会员"
        }
      ],
      PlatformRole: [
        {
          type: "saas",
          value: "服务商"
        },
        {
          type: "platform",
          value: "平台商"
        },
        {
          type: "subMerchant",
          value: "子商户"
        }
      ],
      MemberStatus: [
        {
          type: "created",
          value: "入驻中"
        },
        {
          type: "success",
          value: "正常"
        },
        {
          type: "freeze",
          value: "冻结中"
        },
        {
          type: "closed",
          value: "已关闭"
        },
        {
          type: "cancel",
          value: "撤销"
        }
      ],
      PayCp: [
        {
          type: "yeePay",
          value: "易宝支付"
        },
        {
          type: "douGong",
          value: "汇付天下"
        }
      ],
      MerchantType: [
        {
          type: "company",
          value: "公司"
        },
        {
          type: "person",
          value: "个人"
        }
      ],
      MerchantAppType: [
        {
          type: "payment",
          value: "支付服务"
        },
        {
          type: "sms",
          value: "短信服务"
        },
        {
          type: "esig",
          value: "电子签约"
        },
        {
          type: "mauth",
          value: "用户认证"
        },
        {
          type: "mprdt",
          value: "产品清单"
        }
      ],
      RiskRuleConsumer: [
        {
          type: "close_withdraw",
          value: "关闭提现"
        },
        {
          type: "agent",
          value: "关闭积分和现金抵扣"
        },
        {
          type: "freeze_account",
          value: "冻结账户"
        },
        {
          type: "freeze_consumer",
          value: "冻结用户"
        },
        {
          type: "close",
          value: "关闭会员"
        },
        {
          type: "black",
          value: "黑名单管控"
        }
      ],
      SubMerInviteStatus: [
        {
          type: "register",
          value: "录入中"
        },
        {
          type: "back",
          value: "已退回"
        },
        {
          type: "approve",
          value: "待审核"
        },
        {
          type: "cancel",
          value: "链接失效"
        },
        {
          type: "success",
          value: "邀请完成"
        },
        {
          type: "sign",
          value: "签约中"
        }
      ],
      SubMerRole: [
        {
          type: "seller",
          value: "销售员"
        },
        {
          type: "agent",
          value: "代理商"
        },
        {
          type: "manufacturer",
          value: "生产商"
        },
        {
          type: "supplier",
          value: "供应商"
        },
        {
          type: "cancel",
          value: "已取消"
        },
        {
          type: "service",
          value: "服务商"
        },
        {
          type: "technology",
          value: "技术服务"
        }
      ],
      MerchantStatus: [
        {
          type: "created",
          value: "入驻中"
        },
        {
          type: "apply",
          value: "审核中"
        },
        {
          type: "submit",
          value: "开户中"
        },
        {
          type: "success",
          value: "正常"
        },
        {
          type: "freeze",
          value: "冻结中"
        },
        {
          type: "closed",
          value: "已关闭"
        },
        {
          type: "failed",
          value: "失败"
        },
        {
          type: "canceled",
          value: "撤销"
        }
      ],
      SubMerType: [
        {
          type: "company",
          value: "企业"
        },
        {
          type: "person",
          value: "个人"
        }
      ],
      BaseStatus: [
        {
          type: "enable",
          value: "有效"
        },
        {
          type: "disable",
          value: "无效"
        }
      ],
      RiskRuleMember: [
        {
          type: "freeze",
          value: "冻结"
        },
        {
          type: "agent",
          value: "关闭积分和现金抵扣"
        },
        {
          type: "freeze_account",
          value: "冻结账户"
        },
        {
          type: "freeze_consumer",
          value: "冻结用户"
        },
        {
          type: "close",
          value: "关闭会员"
        },
        {
          type: "black",
          value: "黑名单管控"
        }
      ],
      YesOrNo: [
        {
          type: 1,
          value: "是"
        },
        {
          type: 0,
          value: "否"
        }
      ],
      Shop: [
        {
          type: "douYin",
          value: "抖音店铺"
        },
        {
          type: "kuaiShou",
          value: "快手店铺"
        },
        {
          type: "jingDong",
          value: "京东店铺"
        },
        {
          type: "taoBao",
          value: "淘宝店铺"
        },
        {
          type: "tianMao",
          value: "天猫店铺"
        },
        {
          type: "xiaoHongShu",
          value: "小红书店铺"
        },
        {
          type: "pinDuoDo",
          value: "拼多多店铺"
        }
      ],
      SubMerchantStatus: [
        {
          type: "register",
          value: "录入中"
        },
        {
          type: "approve",
          value: "待审核"
        },
        {
          type: "close",
          value: "停用"
        },
        {
          type: "cancel",
          value: "注销"
        },
        {
          type: "back",
          value: "已退回"
        },
        {
          type: "sign",
          value: "签约中"
        },
        {
          type: "success",
          value: "正常"
        },
        {
          type: "freeze",
          value: "冻结"
        },
        {
          type: "black",
          value: "黑名单管控"
        }
      ],
      PayCpBank: [
        {
          type: "baiXin",
          value: "百信银行"
        }
      ],
      MerchantBankStatus: [
        {
          type: "apply",
          value: "银行开户中"
        },
        {
          type: "success",
          value: "开户成功"
        },
        {
          type: "freeze",
          value: "冻结中"
        },
        {
          type: "failed",
          value: "开户失败"
        }
      ]
    },
    role: {}
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    setDataType(dataType: UserState["dataType"]) {
      dataType.YesOrNo = dataType.YesOrNo.map((item: any) => {
        return {
          type: parseInt(item.type, 10),
          value: item.value
        };
      });
      this.dataType = dataType;
    },
    setUserRole(role: UserState["role"]) {
      this.role = role;
    },
    getDataTypeValue(target: string, key: any) {
      return this.dataType[target].find(d => d.type === key)?.value || "";
    }
  },
  persist: piniaPersistConfig("user")
});
