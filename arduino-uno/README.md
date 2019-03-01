# arduino-uno

This folder contains code that has been tested with Arduino UNO connected to a Raspberry Pi Zero W over USB, node.js v10.15.1 and npm v6.4.1. All input and output devices are connected to Arduino GPIOs.

The examples in this folder use the following modules:

* johnny-five
* express
* bootstrap
* socket.io
* firmata *
* serialport *

_* Installing firmata and serialport modules are required when running a server from macOS but not when running from a Raspberry Pi device. johnny-five requires them and they are installed when building for the Raspberry Pi ARM processor. Just remove the dependencies from package.json if running `npm install` from a Raspberry Pi device._