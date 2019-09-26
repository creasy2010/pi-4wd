import {View, Image, Text, Input} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import './style/password-input.less';
import {add} from '@/actions/counter';

export interface IPasswordInputProps {
  // input是否聚焦
  focus?: boolean;
  style?: {};
  // 获取input value 的方法
  getValue?: Function;
  // 输入完6位密码后调用的方法
  toPay?: Function;
  // 密码框的标题
  title?: string;
}

export interface IPasswordInputState {
  // sku商品库存
  value?: string;
}

export default class PasswordInput extends Component<Partial<IPasswordInputProps>, IPasswordInputState> {
  constructor(props: IPasswordInputProps) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    let {value} = this.state;
    let {style, focus, getValue,title, toPay} = this.props;
    return (
      <View style={style}>
        {
          title && <Text className="password-title">{title}</Text>
        }
        <View className="password-input">
          {/*固定box层*/}
          <View className="number-box">
            {[1, 2, 3, 4, 5, 6].map((v, k) => {
              return <View className="item-box"></View>;
            })}
          </View>
          {/*真实密码层*/}
          <View className="number-box">
            {this.state.value &&
            this.state.value.split('').map((v, k) => {
              return (
                <View className="item-box">
                  {/*{v}*/}
                  ●
                </View>
              );
            })}
          </View>
          {/*input层*/}
          <Input
            className="input-hidden"
            value={value}
            onInput={(e) => {
              this.setState({value: e.detail.value});
              // 输入6位数字后传出props
              if(e.detail.cursor===6){
                getValue(e.detail.value);
                toPay(e.detail.value);
              } else {
                getValue(e.detail.value);
              }
            }}
            maxlength={6}
            type="number"
            focus={focus}
          />
        </View>
      </View>

    );
  }
}
