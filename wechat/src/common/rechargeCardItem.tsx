import {View, Button, Text, Image, OpenData} from '@tarojs/components';
import Taro, {Component, Config} from '@tarojs/taro';
import {RechargeableCardVO2} from '@/webapi/PetRechargeableCardController';
import './cardItem.less';
import './rechargeCard.less';
import {priceFormat} from '@/utils/priceFormat';
export interface IRechargeCardItemProps {
  rechargeCard: RechargeableCardVO2;
  jump: boolean;
}

export interface IRechargeCardItemState {}

export default class RechargeCardItem extends Component<Partial<IRechargeCardItemProps>, IRechargeCardItemState> {
  constructor(props: IRechargeCardItemProps) {
    super(props);
    this.state = {};
  }
  render() {
    let {rechargeCard: card, jump} = this.props;
    return (
      <View className={!jump && 'large'}>
        <View
          className="card-item"
          onClick={() => {
            if (jump) {
              Taro.navigateTo({
                url: '/pages/packageA/pages/rechargeCard/info/index?rechargeableCardId=' + card.rechargeableCardId,
              });
            }
          }}
        >
          <View className="title">{card.rechargeableCardName}</View>
          <View className="price">
            &yen;{priceFormat(card.totalPrice) || priceFormat(card.price + card.presentPrice)}
          </View>
          {(card.validityFlag || !card.validityDays) && <View className="endtime">永久有效</View>}
          {!card.validityFlag && card.validityDays && <View className="endtime">{card.validityDays + '天内有效'}</View>}
        </View>
      </View>
    );
  }
}
