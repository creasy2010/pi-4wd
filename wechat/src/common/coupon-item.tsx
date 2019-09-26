import {View, Text, Image} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import overdue from '@/assets/image/overdue_label.png';
import {CouponCodeVO} from '@/webapi/CouponCodeBaseController';
import dayjs from 'dayjs';
import './coupon-item.less';

export interface ICouponItemProps {
  coupon: CouponCodeVO;
  status: number;
}

export interface ICouponItemState {
  showPopup: boolean;
}

export default class CouponItem extends Component<ICouponItemProps, ICouponItemState> {
  constructor(props: ICouponItemProps) {
    super(props);
    this.state = {
      showPopup: false,
    };
  }

  setShowPopup(e) {
    e.stopPropagation();
    this.setState({
      showPopup: true,
    });
  }
  hidePopup = (value) => {
    this.setState({
      showPopup: value,
    });
  };
  render() {
    const {
      coupon: {
        denomination,
        fullBuyType,
        fullBuyPrice,
        scopeType,
        storeCateNames,
        couponName,
        startTime,
        endTime,
        nearOverdue,
      },
    } = this.props;

    function getCategory() {
      let category = '';
      switch (scopeType) {
        // ALL: 0：全部商品
        // STORE_CATE: 3：店铺分类
        // SKU: 4：自定义货品（店铺可用）
        case 0:
          category = '限商品: 所有商品';
          break;
        case 3:
          category = '限店铺分类：' + storeCateNames;
          break;
        case 4:
          category = '限商品：部分商品';
          break;
        default:
          category = '限商品: 所有商品';
      }
      return category;
    }

    return (
      <View className="item">
        <View className="left">
          {this.props.status === 2 && nearOverdue && <Image src={overdue} className="will-overdue" />}
          <View className="price-wrap">
            &yen;
            <Text className="price">{denomination.toFixed()}</Text>
          </View>
          <View className="condition">{fullBuyType ? `满${fullBuyPrice.toFixed()}可用` : `无门槛`}</View>
        </View>
        <View className="info">
          <View className="name">{couponName}</View>
          <View className="category">{getCategory()}</View>
          <View className="time">{`${this.getTime(startTime)}~${this.getTime(endTime)}`}</View>
        </View>
      </View>
    );
  }
  getTime(time) {
    let arr = time.split(/[- : \/]/);
    let date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    return dayjs(new Date(date)).format('YYYY-MM-DD');
  }
}
