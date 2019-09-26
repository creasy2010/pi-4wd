import { View, Button, Text, Image, OpenData } from "@tarojs/components";
import Taro, { Component, Config } from "@tarojs/taro";
import { TimingCardCodeVO } from "@/webapi/TimingCardCodeController";
import "./myCardItem.less";
import { getPhone } from "@/service/auth";
export interface IMyTimingCardItemProps {
  timingCard: TimingCardCodeVO;
  jump: boolean;
}

export interface IMyTimingCardItemState {
  overdue: boolean;
  willOverdue: boolean;
}

export default class MyTimingCardItem extends Component<
  Partial<IMyTimingCardItemProps>,
  IMyTimingCardItemState
> {
  constructor(props: IMyTimingCardItemProps) {
    super(props);
    this.state = {
      overdue: false,
      willOverdue: false
    };
  }
  render() {
    let card = this.props.timingCard;
    let phone = getPhone();
    this.ifEnd(card.endTime);
    return (
      <View className={this.state.overdue && "overdue"}>
        <View
          className="myCardItem"
          onClick={() => {
            if (!this.state.overdue && this.props.jump) {
              Taro.navigateTo({
                url:
                  "/pages/customer/myTimingCard/info/index?codeId=" +
                  card.codeId
              });
            }
          }}
        >
          <View className="user-info">
            <View className="head">
              <OpenData className="head" type="userAvatarUrl" />
            </View>
            <View className="info">
              <OpenData className="name" type="userNickName" />
              <View className="phone">
                {phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : ""}
              </View>
            </View>
          </View>
          <View className="title">{card.timingCardName}</View>
          <View className="end-time">
            {card.endTime ? card.endTime.slice(0, 10) + "前有效" : "永久有效"}
            {this.state.willOverdue && (
              <Text className="will-end">即将过期</Text>
            )}
            {this.state.overdue && <Text className="will-end">已过期</Text>}
          </View>
          <View className="code">
            {card.timingCardCode
              ? card.timingCardCode.replace(
                  /(\d{4})(\d{4})(\d{4})/,
                  "$1 $2 $3 "
                )
              : ""}
          </View>
        </View>
      </View>
    );
  }
  ifEnd(endTime) {
    if (endTime != null) {
      let now = new Date().getTime();
      let arr = endTime.split(/[- : \/]/);
      let end = new Date(
        arr[0],
        arr[1] - 1,
        arr[2],
        arr[3],
        arr[4],
        arr[5]
      ).getTime();
      if (end <= now) {
        this.setState({
          overdue: true,
          willOverdue: false
        });
      } else if ((end - now) / (1000 * 60 * 60 * 24) < 30) {
        this.setState({
          willOverdue: true
        });
      }
    }
  }
}
