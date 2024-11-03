import type { Upload } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";
import { nanoid } from "nanoid";
import OSS from "ali-oss";
import { UploadRawFile } from "element-plus";

interface OssSTSToken {
  expiration: string;
  accessKeyId: string;
  accessKeySecret: string;
  securityToken: string;
  dir: string;
}

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/img`, params, { cancel: false });
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return http.post<Upload.ResFileUrl>(PORT1 + `/file/upload/video`, params, { cancel: false });
};

export async function getOssToken(bizType: string): Promise<OssSTSToken & { stsToken: string }> {
  const res = await http.post<OssSTSToken>(PORT1 + `/comm/v1/ossSTSToken`, {
    domain: "globalpay-iotcard.oss-cn-beijing.aliyuncs.com",
    forceUpdate: true,
    bizType
  });
  return {
    ...res.data,
    stsToken: res.data.securityToken
  };
}

export function deleteFromOss({ url, bizType }: { bizType: string; url: string }): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await getOssToken(bizType);
      const client = new OSS({
        region: "oss-cn-beijing",
        ...res,
        refreshSTSToken: getOssToken,
        bucket: "globalpay-iotcard"
      });
      let _url = url;
      if (url.startsWith("http")) {
        _url = new URL(url).pathname;
      }
      await client.delete(_url);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
}

export function uploadToOss({
  file,
  url,
  bizType
}: {
  file: UploadRawFile;
  bizType: string;
  url?: string;
}): Promise<{ viewUrl: string; url: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await getOssToken(bizType);
      const client = new OSS({
        region: "oss-cn-beijing",
        ...res,
        refreshSTSToken: getOssToken,
        bucket: "globalpay-iotcard"
      });
      if (url) {
        let _url = url;
        if (url.startsWith("http")) {
          _url = new URL(url).pathname;
        }
        await client.delete(_url);
      }
      const fileName = res.dir + nanoid() + "." + file.name.split(".").pop()?.toLowerCase();
      await client.put(fileName, file);
      const result = await http.post<{ viewUrl: string }>(PORT1 + `/comm/v1/ossView`, {
        objectName: fileName
      });
      resolve({
        viewUrl: result.data.viewUrl,
        url: fileName
      });
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

export function queryOssViewUrl(fileName: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await http.post<{ viewUrl: string }>(PORT1 + `/comm/v1/ossView`, {
        objectName: fileName
      });
      resolve(result.data.viewUrl);
    } catch (error) {
      reject(error);
    }
  });
}
