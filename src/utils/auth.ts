/*
 * @Author: your name
 * @Date: 2021-04-14 13:42:33
 * @LastEditTime: 2021-06-19 15:22:43
 * @LastEditors: 曾宇奇
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\utils\auth.js
 */
import Cookies from "js-cookie";

const TokenKey = "Admin-Token";

const PermissionKey = "User-Permission";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getPermissionKey() {
  return Cookies.get(PermissionKey);
}

export function setPermissionKey(isPermission) {
  return Cookies.set(PermissionKey, isPermission);
}

export function removePermissionKey() {
  return Cookies.remove(PermissionKey);
}
