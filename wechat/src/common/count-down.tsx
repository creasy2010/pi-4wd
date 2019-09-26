import { View, Text, Image } from "@tarojs/components";
import Taro, { Component } from "@tarojs/taro";
import "./count-down.less";
export default class CountDown extends Component<any, any> {
  timer;
  _isMounted;
  static defaultProps = {
    timeOffset: 0,
    overHandler: () => {},
    timeStyle: {},
    colonStyle: {},
    timeClock: {},
    time: {},
    timeDaysStyle: {},
    hideSeconds: true, //隐藏秒
    parame: {},
    //倒计时结束的处理
    endHandle: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      //默认倒计时时间，正整数，单位：秒
      timeOffset: this.props.timeOffset
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this._doCount();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <View>
        <View className="time">{this._timeFormat(this.state.timeOffset)}</View>
      </View>
    );
  }

  _timeFormat = timeOffset => {
    const hour = Math.floor((timeOffset / 60 / 60) % 24);
    const min = Math.floor((timeOffset / 60) % 60);
    const second = timeOffset % 60;
    let trueHour = hour < 10 ? "0" + hour : hour;
    let truemin = min < 10 ? "0" + min : min;
    let trueSec = second < 10 ? "0" + second : second;
    if (trueHour == "00" && truemin == "00" && trueSec == "59") {
      //只显示时分  基础数据会加上59秒
      //清除定时器
      this.props.endHandle(this.props.parame);
    }
    return `${trueHour}:${truemin}`;
  };

  /**
   * 计时器倒计时
   */
  _doCount = () => {
    this.timer = setInterval(() => {
      if (this.state.timeOffset <= 1) {
        clearTimeout(this.timer);
        this.props.overHandler();
      }
      if (this._isMounted) {
        this.setState({
          timeOffset: this.state.timeOffset - 1
        });
      } else {
        clearTimeout(this.timer);
      }
    }, 1000);
  };
}
