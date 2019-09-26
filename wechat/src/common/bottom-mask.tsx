import {View, Button, Text, Image, ScrollView} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import closeIcon from '@/assets/image/close-icon.png';
import CouponList from '@/common/coupon-list';
import './bottom-mask.less';

interface bottomMaskProps {
  title: string;
  couponViews: [];
  changeCoupon: any; //控制组件的隐藏
}

export default class BottomMask extends Component<bottomMaskProps, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {title, couponViews, changeCoupon} = this.props;
    return (
      <View className="mask-bj">
        <View className="mask-container">
          <View className="mask-title">
            <Text className="mask-title">{title}领劵</Text>
            <View className="mask-close" onClick={changeCoupon}>
              <Image src={closeIcon} style={{width: '16px', height: '16px'}} />
            </View>
          </View>
          <View>
            <Text className="wait-coupon">可领取的优惠券</Text>
          </View>

          {/*内容 优惠券*/}
          {couponViews && (
            <ScrollView className="list" scrollY>
              <CouponList list={couponViews} />
            </ScrollView>
          )}
        </View>
      </View>
    );
  }
}
