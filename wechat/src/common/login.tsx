import {View, Button, Image} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import api from 'api';
import './login.less';

import entryTop from '@/assets/image/entry_top.png';
import {saveToken, savePhone, getToken ,getCartNum} from '@/service/auth';

type PageStateProps = {
  counter: {
    num: number;
  };
};

type PageDispatchProps = {
  add: () => void;
  dec: () => void;
  asyncAdd: () => any;
};

type PageOwnProps = {
  afterLogin: () => void;
  hideLoginPopup: () => void;
};

type PageState = {
  isNew: boolean;
  [key: string]: any;
};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Index {
  props: IProps;
}

export default class Login extends Component<PageOwnProps, PageState> {
  constructor(props: PageOwnProps) {
    super(props);
    this.state = {
      isNew: false,
      ifShow: true,
    };
    this._getCode();
  }

  render() {
    const {afterLogin} = this.props;
    return (
      <View className="login popup" onClick={(e) => e.stopPropagation()}>
        <View className="main-container">
          <Image src={entryTop} className="entry-top" />
          <View className="back" />
          <View className="title">登录</View>
          <View className="brief">登录享受更多服务</View>
          {!this.state.isNew ? (
            <Button
              className="add btn"
              openType="getUserInfo"
              onGetUserInfo={async (e: {detail: IDetail; [name: string]: any}) => {
                e.stopPropagation();
                if (this.state.code && e.detail.encryptedData && e.detail.iv) {
                  let result = await api.authorizeController.authorize({
                    code: this.state.code,
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                  });
                  //用户如果已经注册了, 直接拿到登录信息, 否则要用手机号注册登录
                  if (!result.loginFlag) {
                    this.setState({isNew: true});
                  } else {
                    await saveToken(result.token);
                    await savePhone(result.phoneNum);
                    afterLogin();
                  }

                } else {
                  // Taro.switchTab({
                  //   url: "/pages/coupon/list/index"
                  // });
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              授权登录
            </Button>
          ) : (
            <Button
              className="add btn"
              openType="getPhoneNumber"
              onGetPhoneNumber={async (e: {
                detail: {
                  encryptedData: string;
                  errMsg?: string;
                  iv: string;
                };
              }) => {
                let {iv, encryptedData} = e.detail;
                let code = await this._getCode();
                if (iv && encryptedData && code) {
                  let {token, phoneNum} = await api.authorizeController.authorizePhoneLogin({
                    iv,
                    encryptedData,
                    code,
                  });
                  await saveToken(token);
                  await savePhone(phoneNum);
                  afterLogin();
                } else {
                  // Taro.switchTab({
                  //   url: "/pages/coupon/list/index"
                  // });
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              微信手机号快捷登录
            </Button>
          )}
          <Button className="btn cancel" onClick={this._cancel}>
            取消
          </Button>
        </View>
      </View>
    );
  }

  _cancel(e: {stopPropagation: () => void}) {
    e.stopPropagation();
    const {hideLoginPopup} = this.props;
    hideLoginPopup();
  }

  _getCode = (): Promise<string> => {
    var _this = this;
    return new Promise((resolve, reject) => {
      //@ts-ignore
      wx.login({
        async success(res: {code: string | PromiseLike<string>; errMsg: string}) {
          if (res.code) {
            _this.setState({
              code: res.code,
            });
            resolve(res.code);
          } else {
            reject(res.errMsg);
            console.log('登录失败！' + res.errMsg);
          }
        },
      });
    });
  };

  _entryStore = async () => {
    let res = Taro.getStorageSync('pet:storeInfo');
    let storeCode = res.storeCode;
    try {
      const res = await api.storeCustomerController.entryWithLogin(storeCode);
      let token = res.token;
      await saveToken(token);
    } catch (e) {
      throw e;
    }
    Taro.reLaunch({url: '/pages/index/index'});
  };
}

interface IDetail {
  errMsg?: string;
  rawData: string;
  signature: string;
  encryptedData: string;
  iv: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  nickName: string;
  gender: number;
  language?: string;
  city: string;
  province: string;
  country: string;
  avatarUrl: string;
}
