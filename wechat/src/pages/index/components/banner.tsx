import { View, Button, Text, Image } from "@tarojs/components";
import Taro, { Component, Config } from "@tarojs/taro";

import * as T from "../types";
import "./banner.less";
import actions from "../actions/index";
import { connect } from "@tarojs/redux";
import { store2Props } from "../selectors";
import { addressInfo } from "@/utils/location/area/area";

type IBannerProps = T.IProps & T.IBannerProps;

@connect<Partial<IBannerProps>, T.IBannerState>(
  store2Props,
  actions
)
export default class Banner extends Component<
  Partial<IBannerProps>,
  T.IBannerState
> {
  constructor(props: IBannerProps) {
    super(props);
  }

  render() {
    let {
      actions: { action },
      main: { storeBaseInfo }
    } = this.props;
    return (
      <View className="banner">
        <Image className="back" mode="aspectFill" src={storeBaseInfo.storeSign} />
        <View className="mask-layer">
          <View className="main">
            <Image className="logo" src={storeBaseInfo.storeLogo} />
            <View className="info">
              <View className="title">{storeBaseInfo.storeName}</View>
              <View className="location">
                {this.getLocation(storeBaseInfo)}
                {storeBaseInfo.addressDetail || ""}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
  getLocation(storeBaseInfo) {
    if (storeBaseInfo) {
      let { provinceId, cityId, areaId, addressDetail } = storeBaseInfo;
      if (provinceId && cityId && areaId) {
        let area = addressInfo(provinceId, cityId, areaId);
        console.log(area);
        return area;
      }
    }
  }
}
