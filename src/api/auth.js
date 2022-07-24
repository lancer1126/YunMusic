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
