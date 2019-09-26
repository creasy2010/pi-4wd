import {View, Button, Text, Image} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import './buy-card-payment.less';
import wechatIcon from '@/assets/image/wechat_ico.png';
import CartCount from './cart-count';
import api from 'api';
import {isLogin, saveToken} from '@/service/auth';
import Login from '@/pages/coupon/list/components/login';
export interface IBuyCardPaymentProps {
  onClose?: Function;
  price: number;
  cardId: string;
  cardType: number;
}

export interface IBuyCardPaymentState {
  count: number;
  showPopup: boolean;
}

export default class BuyCardPayment extends Component<Partial<IBuyCardPaymentProps>, IBuyCardPaymentState> {
  constructor(props: IBuyCardPaymentProps) {
    super(props);
    this.state = {
      count: 1,
      showPopup: false,
    };
  }

  render() {
    let {} = this.props;
    return (
      <View className="buy-card-bj" onClick={this._close}>
        <View className="buy-card-container" onClick={(e) => e.stopPropagation()}>
          <View className="buy-num">
            <Text className="text">购买数量</Text>
            <CartCount
              count={1}
              getNum={(index) => {
                this.setState({count: index});
              }}
            />
          </View>
          <View className="buy-money">
            <Text className="text1">您需支付</Text>
            <Text className="text2">¥{this._calculatePrice()}</Text>
          </View>
          <View className="payment">
            <View className="wechat">
              <Image className="wechat-img" src={wechatIcon} />
              <Text className="text">微信支付</Text>
            </View>
            <View className="radio">
              <View className="s-radio"></View>
            </View>
          </View>
          {this.state.count == 0 ? (
            <Button className="gray-btn go-btn">去支付</Button>
          ) : (
            <Button className="go-btn" onClick={this._payment}>
              去支付
            </Button>
          )}
        </View>
        {this.state.showPopup && (
          <Login
            hideLoginPopup={this.hideLoginPopup}
            afterLogin={async () => {
              this.setState({
                showPopup: false,
              });
              await this._entryStore();
            }}
          />
        )}
      </View>
    );
  }
  //点击黑层关闭
  _close = () => {
    this.props.onClose();
  };

  hideLoginPopup = () => {
    this.setState({
      showPopup: false,
    });
  };

  _entryStore = async () => {
    let res = Taro.getStorageSync('pet:storeInfo');
    let storeCode = res.storeCode;
    try {
      const res = await api.storeCustomerController.entryWithLogin(storeCode);
      let token = res.token;
      saveToken(token);
    } catch (e) {
      throw e;
    }
  };

  //支付
  _payment = async (e) => {
    e.stopPropagation();

    if (!isLogin()) {
      this.setState({
        showPopup: true,
      });
      return;
    }

    let paymentParams = {goods: [], deliverWay: 2, payItems: []}; //结算应收传参
    let goodsParams = []; //结算应收商品参数
    let payItems = [];
    goodsParams.push({
      cardType: this.props.cardType, //计次卡0 充值卡1
      num: this.state.count, //数量
      goodsType: 2, ////类型： 2：卡
      pid: this.props.cardId, //卡id
    });
    payItems.push({
      account: (this.state.count * this.props.price).toFixed(2),
      payChannel: 1,
      payType: 0,
    });
    paymentParams.goods = goodsParams;
    paymentParams.payItems = payItems;
    let {orderCommitResultVOS} = await api.petOrderController.create(paymentParams);
    let _this = this;
    Taro.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          _this._getOpenId(res.code, orderCommitResultVOS[0].oid);
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      },
    });
  };

  //获取openid
  _getOpenId = async (code, oid) => {
    let context = await api.payController.getLittleProgramOpenId(code);
    this._getWxPayment(oid, context);
  };

  //获取微信支付
  _getWxPayment = async (oid, openid) => {
    let content: any = await api.petPayController.wxPay({
      oid: oid,
      openId: openid,
    });
    console.log(content);
    let _this = this;
    Taro.requestPayment({
      timeStamp: content.timeStamp,
      nonceStr: content.nonceStr,
      package: content.package,
      signType: content.signType,
      paySign: content.paySign,
      success: function(res) {
        Taro.navigateTo({
          url: '/pages/packageA/pages/success/index?cardType=' + _this.props.cardType,
        });
      },
      fail: function(res) {
        console.log(res);
      },
    });
  };

  //计算金额
  _calculatePrice = () => {
    let price: any = 0;
    price = (this.state.count * this.props.price).toFixed(2);
    return price;
  };
}
