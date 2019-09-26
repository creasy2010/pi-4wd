// import api from 'api';
// /**
//  * @desc
//  *
//  * @使用场景
//  *
//  * @company qianmi.com
//  * @Date    2019/6/25
//  **/
// import Taro from '@tarojs/taro';
// var token = null;
// loadToken();
// getStoreInfo();
//
// export function isLogin() {
//   return token !== null; //true是已经登录
// }
//
// export async function saveToken(_token) {
//   token = _token;
//   await Taro.setStorage({key: 'pet:authInfo:token', data: token});
// }
//
// export async function getCartNum() {
//   //登录后合并购物车
//   const data = Taro.getStorageSync('goodsToCart') || [];
//
//   const purchaseMergeDTOList = data.map((item) => ({
//     goodsInfoId: item.goods.goodsInfoId,
//     goodsNum: item.count,
//   }));
//
//   purchaseMergeDTOList.length && (await api.purchaseBaseController.mergePurchase({purchaseMergeDTOList}));
//
//   const num = await api.purchaseBaseController.countGoods(); //更新图标
//   Taro.removeStorageSync('goodsToCart'); //清空本地缓存
//   if (num) {
//     await Taro.setTabBarBadge({
//       index: 2,
//       text: num.toString(),
//     });
//   }
// }
// let storeInfo: StoreBaseResponse = null;
// let phone: string = '';
//
// export async function getStoreInfo(): Promise<StoreBaseResponse> {
//   if (storeInfo) {
//     return storeInfo;
//   }
//
//   try {
//     let {data} = Taro.getStorageSync('pet:storeInfo');
//     storeInfo = data as any;
//   } catch (err) {
//     console.warn(err);
//   }
//   return storeInfo;
// }
//
// export function getStoreInfoSync(): StoreBaseResponse {
//   if (storeInfo) {
//     return storeInfo;
//   }
//   return {};
// }
//
// export async function saveStoreInfo(store: StoreBaseResponse): Promise<void> {
//   try {
//     storeInfo = store;
//     await Taro.setStorage({
//       key: 'pet:storeInfo',
//       data: store,
//     });
//   } catch (err) {
//     console.warn(err);
//   }
// }
//
// export function getToken() {
//   if (!token) {
//     loadToken();
//   }
//   return token;
// }
//
// function loadToken() {
//   try {
//     const {data} = Taro.getStorageSync('pet:authInfo:token');
//     if (data) {
//       token = data;
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// }
//
// export function getPhone() {
//   if (!phone) {
//     try {
//       const data = Taro.getStorageSync('pet:phone');
//       if (data) {
//         phone = data;
//       } else {
//         phone = '';
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   }
//   return phone;
// }
//
// export async function savePhone(phone) {
//   try {
//     await Taro.setStorage({
//       key: 'pet:phone',
//       data: phone,
//     });
//   } catch (err) {
//     console.warn(err);
//   }
// }
//
// export function setAddressStatus(value) {
//   Taro.setStorageSync('addressStatus', value);
// }
// export function getAddressStatus() {
//   return Taro.getStorageSync('addressStatus');
// }
