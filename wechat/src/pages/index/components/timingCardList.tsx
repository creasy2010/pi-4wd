import {View, Button, Text, Image} from '@tarojs/components';
import Taro, {Component, Config} from '@tarojs/taro';

import * as T from '../types';
import './cardList.less';
import actions from '../actions/index';
import {connect} from '@tarojs/redux';
import {store2Props} from '../selectors';
import TimingCardItem from '@/common/timingCardItem';
import rightArrow from '@/assets/image/right_arrow.png';

type ITimingCardListProps = T.IProps & T.ITimingCardListProps;
export interface ITimingCardListState {
  ifShow: boolean;
}
@connect<Partial<ITimingCardListProps>, T.ITimingCardListState>(
  store2Props,
  actions,
)
export default class TimingCardList extends Component<Partial<ITimingCardListProps>, ITimingCardListState> {
  constructor(props: ITimingCardListProps) {
    super(props);
    this.state = {
      ifShow: false,
    };
  }

  render() {
    let {
      actions: {action},
      main: {timingCardList},
    } = this.props;

    let items;
    if (timingCardList.length) {
      this.setState({
        ifShow: true,
      });
      items = timingCardList.map((item) => (
        <View className="wrap" key={item.timingCardId}>
          <TimingCardItem timingCard={item} jump={true} />
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
            <Text className="name">计次卡</Text>
            <View
              className="more-card"
              onClick={() => {
                Taro.navigateTo({
                  url: '/pages/packageA/pages/timingCard/list/index',
                });
              }}
            >
              <Text className="info">更多计次卡</Text>
              <Image src={rightArrow} className="more-icon" />
            </View>
          </View>
          <View className="list">{items}</View>
        </View>
      )
    );
  }
}
