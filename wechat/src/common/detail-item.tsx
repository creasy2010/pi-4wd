import { View, Button, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import moreIcon from '@/assets/image/more-icon.png';
import './detail-item.less';
import { isLogin, saveToken } from '@/service/auth';
import Login from './login';

import api from 'api';

import closeIcon from '@/assets/image/close-icon.png';
import GoodsChoose from '@/common/goods-choose';
import CouponList from '@/pages/coupon/list/common-coupon-index';

interface goodTitleProps {
  itemType: '规格' | '促销' | '领劵',
  // changeScroll?: (boolean) => void  //控制最外层是否能滚动
  moreTitle?: string,
  goodsInfo?: any     //itemType:'规格'的情况
  renderContent?: () => any, //detail-item中间渲染的内容 返回一个组件
  renderMore?: any    //点击更多显示的组件  返回一个组件
  submitSpec?: Function,    // 提交的方法 只限规格
  [name: string]: any
}

export default class DetailItem extends Component<goodTitleProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      showBottomMask: false,
      couponViews: null,
      visible: false, //itemType为规格的情况
      goodsInfo: {}
    };
  }

  render() {

    let { itemType, moreTitle, goodsInfo, renderMore, renderContent, submitSpec, couponViews } = this.props;
    let { visible } = this.state;
    const showBottomMask = this.state.showBottomMask;
    const detailItem = itemType === '促销' ? 'detail-item detail-item-border' : 'detail-item ';

    return (
      <View>
        {
          itemType === '规格' && visible &&  //规格为特殊情况 调用额外的公共组件
          <GoodsChoose
            data={goodsInfo}
            visible={visible}
            renSpec={true}
            changeSpecVisible={() => this.changeSpecVisible()}
            submitSpec={submitSpec}/>
        }
        {
          showBottomMask
            ? (<View //遮罩
              className="mask-bj">
              <View className="mask-container">
                <View className='mask-title'>
                  {
                    <Text className='mask-title'>{moreTitle}</Text>
                  }
                  <View className='mask-close'
                        onClick={() => {
                          this.setState({ showBottomMask: false });
                        }}>
                    <Image
                      src={closeIcon} style={{ width: '16px', height: '16px' }}
                    />
                  </View>
                </View>
                <View>
                  {moreTitle === '领劵' && <Text className='wait-coupon'>可领取的优惠券</Text>}
                </View>

                {/*内容 */}
                {
                  <ScrollView
                    className="list"
                    scrollY
                  >
                    {this.props.renderMore}
                  </ScrollView>
                }

              </View>
            </View>)
            : (<View
              style={itemType === '规格' ? { marginBottom: '20px' } : null}
              className={detailItem}>
              <Text className='itemTitle'>{itemType}</Text>

              {/*传入的中间组件*/}
              {this.props.renderContent}

              <View className='item-more'
                    onClick={() => {
                      itemType === '规格' ?  //规格为特殊情况 调用额外的公共组件
                        this.setState({
                          visible: true
                        }) :
                        this.showBottomMask();
                    }}>
                <Image
                  src={moreIcon} style={{ width: '20px', height: '20px' }}
                />
              </View>

            </View>)
        }

        {this.state.showPopup && (
          <Login
            hideLoginPopup={this.hideLoginPopup}
            afterLogin={async () => {
              this.setState({
                showPopup: false,
                isLogin: true
              });
              await this._entryStore();
            }}
          />
        )}

      </View>
    );
  }

  hideLoginPopup = () => {
    this.setState({
      showPopup: false
    });
  };

  _entryStore = async () => {
    let res = Taro.getStorageSync('pet:storeInfo');
    let storeCode = res.storeCode;
    try {
      const res = await api.storeCustomerController.entryWithLogin(storeCode);
      let token = res.token;
      saveToken(token);
      
    } catch (e) {
      throw e;
    }
    //Taro.reLaunch({ url: "/pages/coupon/list/index" });
  };

  changeSpecVisible = () => {
    this.setState({
      visible: false
    });
  };

  async showBottomMask() {
    this.setState({
      showBottomMask: true
    });
  }
}

