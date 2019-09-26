import {View} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import {TimingCardVO2} from '@/webapi/PetTimingCardController';
import './cardItem.less';
import {priceFormat} from '@/utils/priceFormat';
interface ITimingCardItemProps {
  timingCard: TimingCardVO2;
  jump: boolean;
}

interface ITimingCardItemState {}

export default class TimingCardItem extends Component<Partial<ITimingCardItemProps>, ITimingCardItemState> {
  constructor(props: ITimingCardItemProps) {
    super(props);
    this.state = {};
  }
  render() {
    let {timingCard: card, jump} = this.props;
    return (
      <View className={!jump && 'large'}>
        <View
          className="card-item"
          onClick={() => {
            if (jump) {
              Taro.navigateTo({
                url: '/pages/packageA/pages/timingCard/info/index?timingCardId=' + card.timingCardId,
              });
            }
          }}
        >
          <View className="title">{card.timingCardName}</View>
          <View className="project">{this.getProject(card)}</View>
          <View className="price">&yen;{priceFormat(card.price)}</View>
          <View className="endtime">{card.validityFlag ? '永久有效' : card.validityDays + '天内有效'} </View>
        </View>
      </View>
    );
  }
  getProject(card) {
    if (card.timingCardProjectVOList) {
      let num =
        parseInt(card.timingCardProjectVOList[0].projectNum) + parseInt(card.timingCardProjectVOList[0].presentNum);
      return card.timingCardProjectVOList[0].projectName + 'x' + num;
    } else {
      let num = parseInt(card.projects[0].projectNum) + parseInt(card.projects[0].presentNum);
      return card.projects[0].projectName + 'x' + num;
    }
  }
}
