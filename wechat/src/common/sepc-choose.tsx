import {View, Input, Image, Text} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';
import './style/spec-choose.less';
import {GoodsSpecDetailVO, GoodsSpecVO} from '@/webapi/GoodsBaseController';

type SpecDetailId = number;
export interface IGoodsInfo {
  /**
   * 商品SKU编号
   */
  goodsInfoId?: string;
  /**
   * 扁平化多个商品规格值ID
   */
  specDetails: number[];

  [name: string]: any;
}

export interface ISpecChooseProps {
  /**
   * 商品规格值列表
   */
  goodsSpecDetails: GoodsSpecDetailVO[];
  /**
   * 商品规格列表
   */
  goodsSpecs: GoodsSpecVO[];
  /**
   * 可选的商品sku
   */
  goodsSkuable: IGoodsInfo[];

  onChange?: (choosedSpecs: GoodsSpecDetailVO[], goodsSkuInfo?: IGoodsInfo) => void;

  [name: string]: any;
}

export interface ISpecChooseState {
  choosedSpecs?: SpecDetailId[];
  [name: string]: any;
}

export default class SpecChoose extends Component<Partial<ISpecChooseProps>, ISpecChooseState> {
  constructor(props: ISpecChooseProps) {
    super(props);
    let choosedSpecs = [];

    if (props.goodsSkuable && props.goodsSkuable[0]) {
      choosedSpecs = props.goodsSkuable[0].specDetails;
    }

    this.state = {
      choosedSpecs: choosedSpecs,
    };

    this.state.choosedSpecs && this.state.choosedSpecs.length > 0 && this._notify();
  }

  render() {
    let {choosedSpecs} = this.state;
    let specComps = (this.props.goodsSpecs || []).map((goodsSepc) => {
      let item = this.props.goodsSpecDetails.filter((specDetail) =>
        goodsSepc.specDetailIds.includes(specDetail.specDetailId),
      );
      return (
        <View className="goodsSpec" key={Math.random()}>
          <Text className="spec-title">{goodsSepc.specName}</Text>
          <View className="goodsSpecItems">
            {item.map((item, detailIndex) => {
              let isChooseAble = this._checkChooseable(goodsSepc.specId, item.specDetailId);
              let isActive = choosedSpecs.includes(item.specDetailId);
              return (
                <View
                  key={item.specDetailId}
                  className={(isActive ? 'specItem active' : 'specItem') + (isChooseAble ? '' : ' disable')}
                  data-index={detailIndex}
                  data-specdetailid={item.specDetailId}
                  data-specid={goodsSepc.specId}
                  onClick={isChooseAble ? this._chooseSpecDetail : null}
                >
                  <Text className="spec-text">{item.detailName}</Text>
                </View>
              );
            })}
          </View>
        </View>
      );
    });

    return <View>{specComps}</View>;
  }

  /**
   * 验证当前项 是否可选;
   * 计算方法: 去除本规格组中规格项, 添加此规格值 , 看商品 是否可用, 如果可用则可选,不可用则不可选
   * @private
   */
  _checkChooseable = (specid: number, specDetailId: number): boolean => {
    let _specDetails = [];
    for (let i = 0, iLen = this.props.goodsSpecs.length; i < iLen; i++) {
      let goodsSpec = this.props.goodsSpecs[i];
      if (goodsSpec.specId === specid) {
        _specDetails = goodsSpec.specDetailIds;
        break;
      }
    }

    //新组合出来的规格值;
    let targetSpecsIds: number[] = this.state.choosedSpecs
      .filter((item) => !_specDetails.includes(item))
      .concat([specDetailId]);

    for (let i = 0, iLen = this.props.goodsSkuable.length; i < iLen; i++) {
      let goodsSkuable = this.props.goodsSkuable[i];
      let isExist = true;
      for (let j = 0, jLen = targetSpecsIds.length; j < jLen; j++) {
        if (!goodsSkuable.specDetails.includes(targetSpecsIds[j])) {
          isExist = false;
        }
      }
      if (isExist) {
        return isExist;
      }
    }
    return false;
  };

  _getSkuInfo = (specDetailIds: number[]): IGoodsInfo => {
    for (let i = 0, iLen = this.props.goodsSkuable.length; i < iLen; i++) {
      let goodsSkuable = this.props.goodsSkuable[i];
      let hit = 0;
      for (let j = 0, jLen = specDetailIds.length; j < jLen; j++) {
        if (goodsSkuable.specDetails.includes(specDetailIds[j])) {
          hit++;
        }
      }
      if (hit === specDetailIds.length) {
        return goodsSkuable;
      }
    }
    return null;
  };

  /**
   * 选中规格商品.
   * @param event
   * @private
   */
  _chooseSpecDetail = (event) => {
    let {index, specid, specdetailid} = event.currentTarget.dataset;
    specdetailid = parseInt(specdetailid);
    specid = parseInt(specid);
    let {choosedSpecs} = this.state;
    let specDetailIds = this.props.goodsSpecs.filter((item) => item.specId === specid)[0].specDetailIds;

    if (choosedSpecs.includes(specdetailid)) {
      this.setState({choosedSpecs: choosedSpecs.filter((item) => item != specdetailid)}, this._notify);
    } else {
      this.setState(
        {
          choosedSpecs: choosedSpecs.filter((item) => !specDetailIds.includes(item)).concat([specdetailid]),
        },
        this._notify,
      );
    }
  };

  _notify = () => {
    let choosedSpecs = this.state.choosedSpecs;
    let choosed = this.props.goodsSpecDetails.filter((item) => choosedSpecs.includes(item.specDetailId));
    this.props.onChange && this.props.onChange(choosed, this._getSkuInfo(choosedSpecs));
  };
}
