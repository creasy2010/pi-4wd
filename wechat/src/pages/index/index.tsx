import {View} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';

import {connect} from '@tarojs/redux';
import './index.less';
import * as T from './types';
import actions from './actions';
import {store2Props} from './selectors';


@connect<Partial<T.IProps>>(
  store2Props,
  actions,
)
export default class Index extends Component<Partial<T.IProps>, any> {
  constructor(props) {
    super(props);
  }

  config = {
    navigationBarTitleText: '店铺首页',
    enablePullDownRefresh: true,
  };

  async componentDidMount() {
    this.props.actions.init();
  }
  async componentDidShow(){
  }

  componentWillUnmount() {
    this.props.actions.clean();
  }

  onPullDownRefresh() {
  }

  render() {
    return (
      <View className="index">
        hello
      </View>
    );
  }
}
