import {View, Image} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro'
import close from '@/assets/image/close_map.png';

import './overduePopup.less';

interface IProps {}
interface IState {}

export default class OverduePopup extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View className="overlay">
        <View className="popup">
          <View className="img">
            <Image src={close} className="close" />
          </View>
          <View className="content">
            <View className="title">啊哦，店铺关闭了~</View>
            <View className="info">您可点击“我的”查看历史记录</View>
          </View>
        </View>
      </View>
    );
  }
}
