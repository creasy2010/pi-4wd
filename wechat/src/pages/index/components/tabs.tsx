import {View, Button, Text, Image} from '@tarojs/components';
import Taro, {Component, Config} from '@tarojs/taro';

import * as T from '../types';
import './tabs.less';
import coupons from '@/assets/image/coupons.png';
import recharge from '@/assets/image/recharge.png';
import would from '@/assets/image/would.png';
import goods from '@/assets/image/goods-icon.png';

type ITabsProps = T.IProps & T.ITabsProps;

export default class Tabs extends Component<Partial<ITabsProps>, T.ITabsState> {
  constructor(props: ITabsProps) {
    super(props);
  }

  render() {
    let {list} = this.props;

    return (
      <View className="tabs">
        <View
          className="item"
          onClick={() => {
            Taro.navigateTo({url: '/pages/coupon/list/index'});
          }}
        >
          <Image className="icon" src={coupons} />
          <View className="name">优惠券</View>
          <View className="border-bottom" />
        </View>
        <View
          className="item"
          onClick={() => {
            Taro.navigateTo({url: '/pages/packageA/pages/timingCard/list/index'});
          }}
        >
          <Image className="icon" src={would} />
          <View className="name">计次卡</View>
          <View className="border-bottom" />
        </View>
        <View
          className="item"
          onClick={() => {
            Taro.navigateTo({url: '/pages/packageA/pages/rechargeCard/list/index'});
          }}
        >
          <Image className="icon" src={recharge} />
          <View className="name">充值卡</View>
          <View className="border-bottom" />
        </View>
        <View
          className="item"
          onClick={() => {
            Taro.switchTab({url: '/pages/goods/list/index'});
          }}
        >
          <Image className="icon" src={goods} />
          <View className="name">服务/商品</View>
          <View className="border-bottom" />
        </View>
      </View>
    );
  }
}
