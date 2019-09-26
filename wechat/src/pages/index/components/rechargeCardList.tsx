import {View, Button, Text, Image} from '@tarojs/components';
import Taro, {Component, Config} from '@tarojs/taro';

import * as T from '../types';
import './cardList.less';
import actions from '../actions/index';
import {connect} from '@tarojs/redux';
import {store2Props} from '../selectors';
import RechargeCardItem from '@/common/rechargeCardItem';
import rightArrow from '@/assets/image/right_arrow.png';

type IRechargeCardListProps = T.IProps & T.IRechargeCardListProps;
export interface IRechargeCardList {
  ifShow: boolean;
}
@connect<Partial<IRechargeCardListProps>, T.IRechargeCardListState>(
  store2Props,
  actions,
)
export default class RechargeCardList extends Component<Partial<IRechargeCardListProps>, IRechargeCardList> {
  constructor(props: IRechargeCardListProps) {
    super(props);
    this.state = {
      ifShow: false,
    };
  }

  render() {
    let {
      actions: {action},
      main: {rechargeCardList},
    } = this.props;
    let items;
    if (rechargeCardList.length) {
      this.setState({
        ifShow: true,
      });
      items = rechargeCardList.map((item) => (
        <View className="wrap" key={item.rechargeableCardId}>
          <RechargeCardItem rechargeCard={item} jump={true} />
        </View>
      ));
    } else {
      this.setState({
        ifShow: false,
      });
    }

    return (
      this.state.ifShow && (
        <View className="cardList">
          <View className="title">
            <Text className="name">充值卡</Text>
            <View
              className="more-card"
              onClick={() => {
                Taro.navigateTo({
                  url: '/pages/packageA/pages/rechargeCard/list/index',
                });
              }}
            >
              <Text className="info">更多充值卡</Text>
              <Image src={rightArrow} className="more-icon" />
            </View>
          </View>
          <View className="list">{items}</View>
        </View>
      )
    );
  }
}
