import {View} from '@tarojs/components';
import Taro, {Component} from '@tarojs/taro';

import {connect} from '@tarojs/redux';
import { AtButton } from 'taro-ui'
import './index.less';
import * as T from './types';
import actions from './actions';
import {store2Props} from './selectors';


@connect<Partial<T.IProps>>(
  store2Props,
  actions,
)
export default class Index extends Component<Partial<T.IProps>, any> {
  constructor(props) {
    super(props);
  }

  config = {
    navigationBarTitleText: '店铺首页',
    enablePullDownRefresh: true,
  };

  async componentDidMount() {
    this.props.actions.init();
  }
  async componentDidShow(){
  }

  componentWillUnmount() {
    this.props.actions.clean();
  }

  onPullDownRefresh() {
  }

  render() {
    return (
      <View className="index">
        <AtButton onClick={()=>{
          //@ts-ignore
          wx.openBluetoothAdapter({
            success: (res) =>{
              console.log(res)
              //@ts-ignore
              // wx.onBluetoothDeviceFound( (res)=> {
              //   var devices = res.devices;
              //   console.log('new device list has founded');
              //   console.dir(devices)
              //   console.log(ab2hex(devices[0].advertisData))
              // })

              //@ts-ignore
              wx.startBluetoothDevicesDiscovery({
                // services: ['FEE7'],
                success: (res) =>{
                  console.log(res);
                  this.getBluetoothDevices();

                  // wx.getBluetoothDevices({
                  //   success: function (res) {
                  //     console.log(res);
                  //     if (res.devices[0]) {
                  //       console.log(ab2hex(res.devices[0].advertisData))
                  //     }
                  //   }
                  // })

                },
                fail:(err)=> {
                  console.error('调用失败;',err);
                }
              })
            },fail(err){
              console.error(err);
            }
          })

        }}>搜索蓝牙</AtButton>
        <AtButton>前进</AtButton>
        <AtButton>后退</AtButton>
        <AtButton>左移</AtButton>
        <AtButton>右移</AtButton>
      </View>
    );
  }

  getBluetoothDevices=()=> {

    setTimeout(() => {
      //@ts-ignore
      wx.getBluetoothDevices({
        services: [],
        allowDuplicatesKey: false,
        interval: 0,
        success: function(res) {
          console.log('devices:',res);
          if (res.devices.length > 0) {
            if (JSON.stringify(res.devices).indexOf(that.deviceName) !== -1) {
              for (let i = 0; i < res.devices.length; i++) {
                if (that.deviceName === res.devices[i].name) {
                  /* 根据指定的蓝牙设备名称匹配到deviceId */
                  that.deviceId = that.devices[i].deviceId;
                  setTimeout(() => {
                    that.connectTO();
                  }, 2000);
                };
              };
            } else {
            }
          } else {
          }
        },
        fail(res) {
          console.log(res, '获取蓝牙设备列表失败=====')
        }
      })
    }, 2000)
  },
}


// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}
