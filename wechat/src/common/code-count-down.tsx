import {View, Text} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';

import './style/code-count-down.less';
/**
 *
 *
 * 使用实例
 *
 <CodeCountDown count={60} onCounting={(count)=>{
                    return count+"秒";
                  }}>
 获取短信验证码
 </CodeCountDown>
 */
interface ICountDownProps {
  count: number;
  onClick: (e) => boolean;
  onCounting: (count: number) => Component | string | number;
  [name: string]: any;
}

interface ICountDownState {
  isDoing: boolean;
  count: number;
  [name: string]: any;
}

export default class CodeCountDown extends Component<
  ICountDownProps,
  ICountDownState
> {

  state = {
    //准备发送阶段;
    isDoing: false,
    //倒计时阶段;
    count: 0
  };

  render() {
    let { children, onCounting } = this.props;
    return (
      <View onClick={this._click} className="codeCount">
        {this.state.count > 0
          ? (onCounting && onCounting(this.state.count)) || (
              <Text className="codeText" style={{ color: 'gray' }}>已发送({this.state.count})</Text>
            )
          : <Text className="codeText">{children}</Text>}
      </View>
    );
  }

  _click = async (e) => {
    try {
      if (this.state.count === 0) {
        if (this.state.isDoing) {
          return;
        }
        //准备发送阶段
        this.setState({ isDoing: true });

        try {
          let result = await this.props.onClick(e);
          if (typeof result === 'boolean' && !result) {
            this.setState({ isDoing: false });
            return;
          }
        } catch (err) {
          this.setState({ isDoing: false });
          return;
        }
        //倒计时阶段;
        this.setState({ count: this.props.count, isDoing: false }, () => {
          let _t = setInterval(() => {
            if (this.state.count === 0) {
              clearInterval(_t);
            } else {
              this.setState({ count: this.state.count - 1 });
            }
          }, 1000);
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };
}
