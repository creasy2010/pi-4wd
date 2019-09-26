import {View, Image, Text, ScrollView} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import './style/goods-choose.less';
import closeIcon from '@/assets/image/close-icon.png';
import goodsNotImg from '@/assets/image/goods.png';
import SpecChoose from './sepc-choose';
import CartCount from './cart-count';
import {GoodsInfoVO, GoodsInfoVO2, GoodsSpecDetailVO, GoodsViewByIdResponse} from '@/webapi/GoodsBaseController';
import callFunction = Taro.cloud.callFunction;
import {isLogin} from '@/service/auth';
import api from 'api';

export interface IGoodsChooseProps {
  // 列表详情传来的spu商品数据
  data: GoodsViewByIdResponse;
  visible: boolean;
  // 是否临时render 选中的Spec
  renSpec: boolean;
  // 关闭弹窗的方法
  changeSpecVisible: Function;
  // 提交选择的sku
  submitSpec?: Function;
  // 值为true的时候存到本地
  isSaveLocal?: boolean;
  // 是否在商品详情页面
  isGoodDetail?:boolean;
}

export interface IGoodsChooseState {
  // sku商品库存
  stock?: number;
  // 购买数量
  count?: number;
  // sku商品价格
  price?: number;
  // spu商品是否多规格
  moreSpec?: boolean;
  // sku选中的商品规格
  specs?: string;
  // sku商品图片
  goodsImage?: string;
  skuID?: string;
  //规格是否全部选中
  isAll?: boolean;
}

export default class GoodsChoose extends Component<Partial<IGoodsChooseProps>, IGoodsChooseState> {
  constructor(props: IGoodsChooseProps) {
    super(props);
    this.state = {
      stock: 0,
      count: 1,
      price: 0,
      moreSpec: true,
      specs: '',
      goodsImage: '',
      skuID: '',
      isAll: true,
    };
  }

  render() {
    let {price, stock, specs, count, goodsImage, skuID, isAll} = this.state;
    let {data, changeSpecVisible, submitSpec, visible, renSpec, isSaveLocal , isGoodDetail} = this.props;
    // 0元商品在规格选择时展示sku的0.01元
    // 多规格情况和单规格情况下价格取值不同
    let goodPrice = data.goods.moreSpecFlag === 1
      ? price === 0
        ? price
        : price || data.goods.marketPrice || data.goodsInfos[0].marketPrice
      : price || data.goods.marketPrice || data.goodsInfos[0].marketPrice;
    let outStock =
      (stock || data.goods.stock || data.goodsInfos[0].stock) === 0 ||
      (stock || data.goods.stock || data.goodsInfos[0].stock) === null;
    return (
      <View className={visible ? 'modal' : 'modal modal-hidden'}>
        <View className="goods-choose">
          <Image className="close" src={closeIcon} onClick={() => changeSpecVisible()} />
          <View className="goods-info">
            <Image
              className="goods-img"
              src={goodsImage || data.goods.goodsImg || data.goodsInfos[0].goodsInfoImg || goodsNotImg}
            />
            <View className="goods-Name">
              <Text className="price">¥{goodPrice}</Text>
              <Text className="gec">库存 {stock || data.goods.stock || data.goodsInfos[0].stock || 0}</Text>
              {data.goods.moreSpecFlag && <Text className="gec">{specs}</Text>}
            </View>
          </View>

          <ScrollView scrollY className="scrollItem">
            {renSpec && (
              <SpecChoose
                goodsSkuable={data.goodsInfos
                  .filter((item) => item.addedFlag === 1)
                  .map((item) => {
                    return {
                      ...item,
                      specDetails: item.mockSpecDetailIds,
                    };
                  })}
                onChange={async (choosedSpecs: GoodsSpecDetailVO[], goodsSkuInfo?: GoodsInfoVO) => {
                  await this.specOnChange(choosedSpecs);
                }}
                goodsSpecs={data.goodsSpecs}
                goodsSpecDetails={data.goodsSpecDetails}
              />
            )}

            <View className="count">
              <Text>购买数量</Text>
              <CartCount
                count={count}
                getNum={(num) => {
                  this.setState({
                    count: num,
                  });
                }}
                inventory={stock || data.goods.stock}
                //库存传入步进器
              />
            </View>
          </ScrollView>

          <View
            className={
              outStock || !(count > 0)
                ? 'goods-btn goods-btn-disabled'
                : isAll
                ? 'goods-btn'
                : 'goods-btn goods-btn-disabled'
            }
            onClick={async () => {
              // submitSpec && submitSpec(skuID); //用于商品详情更新
              const goodsInfos = data.goodsInfos;
              const spuGood = [data.goods]; //用于判断sku商品图片问题
              const count = this.state.count;
              if (skuID === '') skuID = goodsInfos[0].goodsInfoId;
              const goods = goodsInfos.filter((item) => item.goodsInfoId === skuID)[0];
              goods.specText = specs ? specs : '';
              if (isLogin()) {
                await api.purchaseBaseController.mergePurchase({
                  purchaseMergeDTOList: [{goodsNum: count, goodsInfoId: skuID}],
                });
                const num = await api.purchaseBaseController.countGoods();
                if(!isGoodDetail){
                  num && (await Taro.setTabBarBadge({
                    index: 2,
                    text: num.toString(),
                  }));
                }
              } else {
                if (isSaveLocal) {
                  //存入本地
                  const data = Taro.getStorageSync('goodsToCart') || [];
                  Taro.setStorageSync('goodsToCart', [...data, {count, goods, spuGood, onOpened: false}]);
                  const goodsToCart = Taro.getStorageSync('goodsToCart');
                  if(!isGoodDetail){
                    if (goodsToCart.length) {
                      await Taro.setTabBarBadge({
                        index: 2,
                        text: goodsToCart.length.toString(),
                      });
                    }
                  }
                }
              }
              changeSpecVisible();
            }}
          >
            <Text className="text">确定</Text>
          </View>
        </View>
      </View>
    );
  }

  fn() {
    console.log(1);
  }

  // 切换规格时
  specOnChange = async (choosedSpecs) => {
    let _choosedId = choosedSpecs.map((item) => item.specDetailId);
    // 拼接商品规格
    let sellectedSpecs = choosedSpecs.map((item) => item.detailName).join(' ');

    let goodsInfoDetail: GoodsInfoVO2;
    this.props.data.goodsInfos.filter((goodsItem) => {
      if (goodsItem.mockSpecDetailIds) {
        let isAll = goodsItem.mockSpecDetailIds.length === _choosedId.length;

        goodsItem.mockSpecDetailIds.forEach((item) => {
          if (!_choosedId.includes(item)) {
            isAll = false;
          }
        });
        if (isAll) {
          goodsInfoDetail = goodsItem;
        }
      } else {
        goodsInfoDetail = goodsItem;
      }
      let isAll = goodsItem.mockSpecDetailIds.length === _choosedId.length;
      this.setState({
        isAll: isAll,
      });
    });

    if (goodsInfoDetail && goodsInfoDetail.marketPrice !== null) {
      this.setState({
        specs: sellectedSpecs,
        stock: goodsInfoDetail.stock,
        price: goodsInfoDetail.marketPrice,
        goodsImage: goodsInfoDetail.goodsInfoImg,
        skuID: goodsInfoDetail.goodsInfoId,
        // 切换规格后将购买数量置为1
        count: 1,
      });
    } else {
    }
  };
}
