import {View, Input, Image} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import './cart-count.less';
import reduce from '@/assets/image/-_point_ico@2x.png';
import reduceg from '@/assets/image/-_ico@2x.png';
import add from '@/assets/image/+_ico@2x.png';
import addg from '@/assets/image/+_point_ico@2x.png';
export interface ICartCountProps {
  count: any;
  getNum: Function;
  inventory?: any;
}

export interface ICartCountState {
  number: any;
}

export default class CartCount extends Component<Partial<ICartCountProps>, ICartCountState> {
  constructor(props: ICartCountProps) {
    super(props);
    this.state = {
      number: props.count,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.count != this.props.count) {
      this.state = {
        number: nextProps.count,
      };
    }
  }

  render() {
    return (
      <View className="cart-count">
        {this.state.number == 1 || this.state.number == '' ? (
          <Image className="reduce" src={reduce} />
        ) : (
          <Image className="reduce" src={reduceg} onClick={this._reduce} />
        )}
        {this.props.inventory ? ( //库存存在的话,支持input输入
          <Input className="int" value={this.state.number} type="number" onInput={this._change} />
        ) : (
          <Input className="int" value={this.state.number} type="text" disabled />
        )}
        {this.props.inventory && this.state.number == this.props.inventory ? (
          <Image className="add" src={addg} />
        ) : (
          <Image className="add" src={add} onClick={this._add} />
        )}
      </View>
    );
  }

  _change = (e) => {
    let num = e.target.value == '' || e.target.value == '-' ? '' : Number(e.target.value);
    if (num > this.props.inventory) {
      this.props.getNum(this.props.inventory);
      return this.props.inventory;
    } else if (num == '' || num < 0) {
      this.props.getNum('');
      return '';
    } else {
      this.props.getNum(e.target.value);
      return e.target.value;
    }
  };

  _getCount = (num) => {};

  _reduce = (e) => {
    e.stopPropagation();
    let index = this.state.number;
    if (index > 0 && index != 1) {
      index--;
      this.setState({number: index});
      this.props.getNum(index);
    } else {
      this.setState({number: ''});
    }
  };
  _add = (e) => {
    e.stopPropagation();
    let index = this.state.number;
    if (this.props.inventory) {
      //判断库存是否有传入
      if (index < this.props.inventory) {
        //如果传入 加号可点击的最大值不能超过传进来的值
        index++;
        this.setState({number: index});
        this.props.getNum(index);
      }
    } else {
      index++;
      this.setState({number: index});
      this.props.getNum(index);
    }
  };
}
