
'''
在目标机器上执行.
sudo systemctl enable pigpiod
或sudo systemctl start pigpiod

# 手工执行
sudo pigpiod


 本地运行
  PIGPIO_ADDR=172.19.8.53 python3 index.py
  PIGPIO_ADDR=192.168.0.112 python3 index.py

  other:
pwa 相关资料:
  https://gpiozero.readthedocs.io/en/stable/api_output.html#pwmoutputdevice
'''
from gpiozero import Device,Motor, LED, PWMLED,PWMOutputDevice
from time import sleep
from gpiozero.pins.mock import MockFactory
import configparser

from gpiozero.pins.pigpio import PiGPIOFactory
factory = PiGPIOFactory(host='192.168.0.112', port=8888)


Device.pin_factory = MockFactory()

#
# red = LED(17, factory)
# #
# # while True:
# if True:
#     print('next')
#     red.on()
#     sleep(1)
#     red.off()
#     sleep(1)
#


class FourWheelDriveCar():
    # Define the number of all the GPIO that will used for the 4wd car

    def __init__(self):
        '''
        1. Read pin number from configure file
        2. Init all GPIO configureation
        '''
        config = configparser.ConfigParser()
        config.read("config.ini")

        freFrequency = 30
        backFrequency = 30

        self.lfMotor = Motor(config.getint("car", "LEFT_FRONT_1"), config.getint("car", "LEFT_FRONT_2"), pin_factory=factory)
        self.rfMotor = Motor(config.getint("car", "RIGHT_FRONT_1"), config.getint("car", "RIGHT_FRONT_2"), pin_factory=factory)
        self.rfPwa = PWMOutputDevice(config.getint("car", "RIGHT_FRONT__PWA"), frequency=freFrequency, pin_factory=factory)
        self.lfPwa = PWMOutputDevice(config.getint("car", "LEFT_FRONT__PWA"), frequency=freFrequency, pin_factory=factory)
        self.forwardFire = LED(config.getint("car", "FORWARD_STBY"), pin_factory=factory)


        self.lbMotor = Motor(config.getint("car", "LEFT_BEHIND_1"), config.getint("car", "LEFT_BEHIND_2"), pin_factory=factory)
        self.rbMotor = Motor(config.getint("car", "RIGHT_BEHIND_1"), config.getint("car", "RIGHT_BEHIND_2"), pin_factory=factory)
        self.rbPwa = PWMOutputDevice(config.getint("car", "RIGHT_BEHIND__PWA"), frequency=backFrequency,  pin_factory=factory)
        self.lbPwa = PWMOutputDevice(config.getint("car", "LEFT_BEHIND__PWA"), frequency=backFrequency, pin_factory=factory)
        self.behindFire = LED(config.getint("car", "BEHIND_STBY"), pin_factory=factory)

        self.fire_on()

    def fire_on(self):
        self.forwardFire.on()
        self.behindFire.on()

        self.lfPwa.on()
        self.rfPwa.on()
        self.lbPwa.on()
        self.rbPwa.on()

    def fire_off(self):
        self.lfPwa.off()
        self.rfPwa.off()
        self.lbPwa.off()
        self.rbPwa.off()
        self.forwardFire.off()
        self.behindFire.off()

    def reset(self):
        # Rest all the GPIO as LOW

        self.lfPwa.off()
        self.rfPwa.off()
        self.lbPwa.off()
        self.rbPwa.off()

        self.lfMotor.stop()
        self.rfMotor.stop()
        self.lbMotor.stop()
        self.rbMotor.stop()

        self.fire_on()

    def __forword(self):
        '''
        前进
        :return:
        '''
        self.reset()
        #
        self.lfMotor.forward()
        self.lfPwa.pulse()

        self.rfMotor.forward()
        self.rfPwa.pulse()

        self.lbMotor.forward()
        self.lbPwa.pulse()
        #
        self.rbMotor.forward()
        self.rbPwa.pulse()

    def __backword(self):
        '''
        后退
        :return:
        '''
        self.reset()

        self.lfMotor.backward()
        self.lfPwa.pulse()

        self.rfMotor.backward()
        self.rfPwa.pulse()

        self.lbMotor.backward()
        self.lbPwa.pulse()

        self.rbMotor.backward()
        self.rbPwa.pulse()

    def __turnLeft(self):
        '''
        向左转
        To turn left, the LEFT_FRONT wheel will move backword
        All other wheels move forword
        '''
        self.reset()
        self.lfMotor.backward()
        self.rfMotor.forward()
        self.lbMotor.forward()
        self.rbMotor.backward()


    def __turnRight(self):
        '''
        向右转
        To turn right, the RIGHT_FRONT wheel move backword
        All other wheels move forword
        '''
        self.reset()
        self.lfMotor.forward()
        self.rfMotor.backward()
        self.lbMotor.backward()
        self.rbMotor.forward()

    def __backLeft(self):
        '''
        To go backword and turn left, the LEFT_BEHIND wheel move forword
        All other wheels move backword
        '''
        self.reset()
        print('TODO __backLeft')

    def __backRight(self):
        '''
        To go backword and turn right, the RIGHT_BEHIND wheel move forword
        All other wheels move backword
        '''
        self.reset()
        print('TODO __backRight')

    def __stop(self):
        self.reset()

    def carMove(self, direction):
        '''
        Car move according to the input paramter - direction
        '''
        if direction.lower() == 'w':
            self.__forword()
        elif direction.lower() == 's':
            self.__backword()
        # elif direction.lower() == 'a':
        #     self.__turnLeft()
        # elif direction.lower() == 'd':
        #     self.__turnRight()
        # elif direction.lower() == 'BL':
        #     self.__backLeft()
        # elif direction.lower() == 'BR':
        #     self.__backRight()
        elif direction.lower() == 'stop':
            self.__stop()
        elif direction.lower() == 'clear':
            self.__stop()
            self.fire_off()
        else:
            print("The input direction is wrong! You can just input: F, B, L, R, BL,BR or S, current is ", direction)


if __name__ == "__main__":
    raspCar = FourWheelDriveCar()
    while (True):
        direction = input("Please input direction: ")
        raspCar.carMove(direction)