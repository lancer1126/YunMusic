import request from "@/utils/request";

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: "/logout",
    method: "post",
  });
}

/**
 * 生成二维码的key
 */
export function loginQrCodeKey() {
  return request({
    url: "/login/qr/key",
    method: "get",
    params: {
      timestamp: new Date().getTime(),
    },
  });
}

/**
 * 轮询检查二维码扫描状态
 */
export function loginQrCodeCheck(key) {
  return request({
    url: "/login/qr/check",
    method: "get",
    params: {
      key,
      timestamp: new Date().getTime(),
    },
  });
}
