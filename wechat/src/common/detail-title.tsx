import { View, Button, Text, Image } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import collectionOne from '@/assets/image/collection-one.png';
import collectionTwo from '@/assets/image/collection-two.png';
import './detail-title.less';

interface goodTitleProps {
  price: number,
  goodsName: string,
  isCollect: boolean,
  goodType?: 'service' | 'good',
  goodDetail: string
  changeCollect?: any
}

export default class DetailTitle extends Component<goodTitleProps, any> {
  constructor(props) {
    super(props);
  }

  render() {
    //goodType为good时有收藏功能 需传changeCollect方法
    const { price, goodsName, goodType, goodDetail, isCollect, changeCollect } = this.props;

    return (
      <View style={{ backgroundColor: '#fff', marginBottom: '20px' }}>
        <View className='price-header'>
          <Text className='priceLog'>¥</Text>
          <Text className='priceNum'>{price}</Text>
          {/*收藏*/}
          {/* {
            goodType && goodType === 'good' &&(
              <View className='good-collect'
                onClick={changeCollect}
              >
                <Image
                  src={isCollect ? collectionTwo : collectionOne} style={{width:'15px',height:'15px',paddingLeft:'10px'}}
                />
                <Text style={{color:'#FF6600',fontSize:'11px',paddingLeft:'5px',paddingRight:'10px'}}>收藏</Text>
              </View>
            )
          }*/}
        </View>
        <View>
          <Text className='goodName'>{goodsName}</Text>
        </View>
        <View>
          {
            goodDetail && <Text className='goodDetail'>{goodDetail}</Text>

          }
        </View>
        <View style={{ height: '15px' }}/>
      </View>
    );
  }
}

