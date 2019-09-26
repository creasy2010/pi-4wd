import {View, Image, Text} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import './goods-list.less';
import add from '@/assets/image/+_ico@2x.png';
import goodsNotImg from '@/assets/image/goods.png';
import GoodsChoose from '@/common/goods-choose';
import api from 'api';
import {isLogin} from '@/service/auth';

export interface IGoodsListProps {
  data: any;
  getSkuId?: any;
  openInfo: any;
  spaceData: [];
}

export interface IGoodsListState {
  visible: boolean;
  goodsInfo: {};
}

export default class GoodsList extends Component<Partial<IGoodsListProps>, IGoodsListState> {
  constructor(props: IGoodsListProps) {
    super(props);
    this.state = {
      visible: false,
      goodsInfo: {},
    };
  }

  render() {
    let {} = this.props;
    let {visible, goodsInfo} = this.state;
    return (
      <View>
        {this.props.data.length > 0 &&
          this.props.data.map((item) => {
            //服务分类价格
            let projectPrice: any;
            if (item.moreFlag) {
              if (item.minPrice == item.maxPrice) {
                projectPrice = `¥${item.minPrice}`;
              } else {
                projectPrice = `¥${item.minPrice}~¥${item.maxPrice}`;
              }
            } else {
              projectPrice = `¥${item.projectPrice}`;
            }
            //商品分类价格
            let goodsPrice: any;
            if (item.goodsInfos) {
              goodsPrice = `¥${item.goodsInfos[0].salePrice}`;
            }
            console.log(goodsPrice);
            //服务分类图片
            let img: any;
            if (item.projectImg && item.projectImg != '') {
              let images = item.projectImg.split(',');
              img = images[0]; //服务列表图
            } else {
              img = goodsNotImg;
            }
            let goodsImg: any;
            if (item.goodsInfos && item.goodsInfos[0].goodsInfoImg) {
              goodsImg = item.goodsInfos[0].goodsInfoImg; //商品列表图
            } else {
              goodsImg = goodsNotImg;
            }
            return (
              <View
                className="goods-list"
                onClick={this._openInfo.bind(this, item.projectId ? item.projectId : item.goodsInfos[0].goodsInfoId)}
              >
                <Image className="head-img" src={item.projectId ? img : goodsImg} />
                <View className="goods-info">
                  <View className="goods-title" style={item.projectId && {marginBottom: '32px'}}>
                    <Text className="text">
                      {item.projectName ? item.projectName : item.goodsInfos[0].goodsInfoName}
                    </Text>
                  </View>
                  {item.goodsInfos && item.goodsInfos[0].specText && (
                    <View className="goods-spec">
                      {item.goodsInfos[0].spec.map((list, b) => (
                        <View className="spec" key={b}>
                          <Text className="spec-text">{list}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {item.goodsInfos && item.goodsInfos[0].couponLabels.length > 0 && (
                    <View className="coupon">
                      {item.goodsInfos[0].couponLabels.map((val, i) => (
                        <View id={val.couponInfoId} key={i} className="coupon-labels">
                          <Text className="coupon-labels-text">{val.couponDesc}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <View className="goods-price">
                    <Text className="text">{item.projectId ? projectPrice : goodsPrice}</Text>
                    {!item.projectId && <Image className="add" src={add} onClick={this._getSkuId.bind(this, item)} />}
                  </View>
                </View>
              </View>
            );
          })}
        {this.props.spaceData.length == 0 && <View className="not-data-style">————＞ω＜我是有底线的————</View>}
        {visible && (
          <GoodsChoose
            data={goodsInfo}
            visible={visible}
            renSpec={visible}
            isSaveLocal={true}
            changeSpecVisible={() => this.changeSpecVisible()}
          />
        )}
      </View>
    );
  }

  changeSpecVisible = () => {
    this.setState({
      visible: false,
    });
  };
  _getSkuId = async (item, e) => {
    e.stopPropagation();
    this.setState({
      goodsInfo: {},
    });
    const detailType = isLogin() ? 'detail' : 'unLoginDetail';
    let newGoodsInfos = item.goodsInfos.filter((item) => item.addedFlag === 1);
    let goodsData = await api.goodsBaseController[detailType](newGoodsInfos[0].goodsInfoId);
    if (item.goodsInfos) {
      this.props.getSkuId(item);
    }
    this.setState({
      goodsInfo: goodsData,
      visible: true,
    });
  };
  //打开详情
  _openInfo = (id, e) => {
    e.stopPropagation();
    this.props.openInfo(id);
  };
}
