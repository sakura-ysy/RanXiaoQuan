// pages/photo/index.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //上传或者拍照下来的照片
        img: "",
        //弹窗是否出现
        is_modal: 0,
        // 图片临时路径
        tmp_path: "",
        // 用户openid
        user_openid: "",
        // 传云后的图片
        cloud_img: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        const app = getApp()
        this.setData({
            user_openid: app.globalData.user_openid
        })
        console.log(this.data.user_openid)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    //返回的函数
    jump(e) {
        wx.navigateBack({
            delta: 1,
            success: (res) => {},
            fail: (res) => {},
            complete: (res) => {},
        })
    },

    //拍照
    get_pic(e) {
        var pg = this
        var user_openid = this.data.user_openid
        if (user_openid == undefined || user_openid == null || user_openid == "") {
            wx.showModal({
                title: '提示',
                content: '请先登录',
                success(res) {
                    if (res.confirm) {
                        pg.login()
                        console.log(res)
                        pg.setData({
                            cloud_img: res
                        })
                    }
                }
            })
            return
        }

        var pg = this;
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['camera'],
            camera: 'back',
            success(res) {
                pg.setData({
                    img: res.tempFiles[0].tempFilePath
                });

                var temp = res.tempFiles[0].tempFilePath;
                // 发送给java server处理
                wx.showModal({
                    title: '提示',
                    content: '确定要上传该图片吗？\n',
                    success(res) {
                        if (res.confirm) {
                            console.log(temp)
                            wx.cloud.callContainer({
                                config: {
                                    env: 'prod-0gacx0q23b7a27cf', // 微信云托管的环境ID
                                  },
                                path: '/api/grey', // 填入业务自定义路径
                                header: {
                                  'X-WX-SERVICE': 'rxq', // 填入服务名称
                                  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                                },
                                data: {
                                    url:"https://636c-cloud1-3gv71ub62b32f113-1312049560.tcb.qcloud.la/postImage/1656531036567_614.jpg?sign=9e3a47ba66910e2941d3ed183773a731&t=1657817624", // todo
                                },
                                method: 'POST',
                                success(res) {
                                    console.log(res)
                                }
                              })

                            // const res = await wx.cloud.callContainer({
                            //     config: {
                            //       env: '填入云环境ID', // 微信云托管的环境ID
                            //     },
                            //     path: '/xxx', // 填入业务自定义路径和参数，根目录，就是 / 
                            //     method: 'POST', // 按照自己的业务开发，选择对应的方法
                            //     header: {
                            //       'X-WX-SERVICE': 'xxx', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称），在上述实践中是 demo
                            //     }
                            //     // 其余参数同 wx.request
                            //   });
                            // wx.uploadFile({
                            //     url: '47.102.200.30:8000/api/grey', 
                            //     filePath: temp,
                            //     name: 'file',
                            //     header: {
                            //         'content-type': 'multipart/form-data'
                            //       },
                            //     success(res) {
                            //         console.log(res)
                            //         pg.setData({
                            //             cloud_img: res
                            //         })
                            //         //do something
                            //     }
                            // })
                        }
                    }
                })

                // if (res.tempFiles[0].size < 10000) {
                //     wx.showModal({
                //         title: '提示',
                //         content: '确定要上传该图片吗？\n',
                //         success(res) { //对其进行黑白化处理
                //             if (res.confirm) {
                //                 pg.setData({
                //                     is_modal: 1
                //                 });
                //                 var ctx = wx.createCanvasContext('drawing')
                //                 wx.getImageInfo({
                //                     src: `${temp}`,
                //                     success: function (res) {
                //                         const poster = res.path
                //                         ctx.drawImage(poster, 0, 0, res.width, res.height)
                //                         ctx.draw();
                //                         setTimeout(function () {
                //                             wx.canvasGetImageData({
                //                                 canvasId: 'drawing',
                //                                 x: 0,
                //                                 y: 0,
                //                                 width: res.width,
                //                                 height: res.height,
                //                                 success(res) {
                //                                     var data = res.data
                //                                     var i, len, red, green, blue, alpha, average;
                //                                     ctx.clearRect(0, 0, res.width, res.height)
                //                                     for (i = 0, len = data.length; i < len; i += 4) {
                //                                         red = data[i];
                //                                         green = data[i + 1];
                //                                         blue = data[i + 2];
                //                                         alpha = data[i + 3];
                //                                         average = Math.floor((red + green + blue) / 3);
                //                                         var resBackground;
                //                                         if (average < 128) resBackground = 'rgb(15,15,76)'
                //                                         else resBackground = 'rgb(255,255,255)'
                //                                         ctx.setFillStyle(resBackground)
                //                                         let x = (i / 4) / res.width + 45;
                //                                         let y = (i / 4) % res.width + 90;
                //                                         ctx.fillRect(y, x, 1, 1);
                //                                         ctx.draw(true);
                //                                     }
                //                                     wx.canvasToTempFilePath({
                //                                         width: res.width,
                //                                         height: res.height,
                //                                         canvasId: "drawing",
                //                                         success: function (res) { //保存的图片的路径
                //                                             console.log(res.tempFilePath);
                //                                             pg.setData({
                //                                                 tmp_path: res.tempFilePath
                //                                             })
                //                                             // 放入购物车
                //                                             pg.in_cart()
                //                                         },
                //                                         fail: function (res) {}
                //                                     }, this);
                //                                 },
                //                             })
                //                         }, 500);
                //                     },
                //                     fail() {}
                //                 })
                //             } else if (res.cancel) {}
                //         }
                //     });
                // } else {
                //     wx.showModal({
                //         title: '提示',
                //         content: '图片过大，上传失败',
                //         success(res) {
                //             if (res.confirm) {} else if (res.cancel) {}
                //         }
                //     })
                // }
            }
        });
    },

    //上传
    get_upload(e) {
        var pg = this
        var user_openid = this.data.user_openid
        if (user_openid == undefined || user_openid == null || user_openid == "") {
            wx.showModal({
                title: '提示',
                content: '请先登录',
                success(res) {
                    if (res.confirm) {
                        pg.login()
                    }
                }
            })
            return
        }

        var pg = this;
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album'],
            success(res) {
                pg.setData({
                    img: res.tempFiles[0].tempFilePath
                });
                var temp = res.tempFiles[0].tempFilePath;
                // 发送给java server处理
                wx.showModal({
                    title: '提示',
                    content: '确定要上传该图片吗？\n',
                    success(res) {
                        if (res.confirm) {
                            console.log(temp)
                            wx.uploadFile({
                                url: '47.102.200.30:8000/api/grey', //仅为示例，非真实的接口地址
                                filePath: temp,
                                name: 'file',
                                success(res) {
                                    console.log(res)
                                    //do something
                                }
                            })
                        }
                    }
                })

                // if (res.tempFiles[0].size < 10000) {
                //     wx.showModal({
                //         title: '提示',
                //         content: '确定要上传该图片吗？\n',
                //         success(res) { //对其进行黑白化处理
                //             if (res.confirm) {
                //                 pg.setData({
                //                     is_modal: 1
                //                 });
                //                 var ctx = wx.createCanvasContext('drawing')
                //                 wx.getImageInfo({
                //                     src: `${temp}`,
                //                     success: function (res) {
                //                         const poster = res.path
                //                         ctx.drawImage(poster, 0, 0, res.width, res.height)
                //                         ctx.draw();
                //                         setTimeout(function () {
                //                             wx.canvasGetImageData({
                //                                 canvasId: 'drawing',
                //                                 x: 0,
                //                                 y: 0,
                //                                 width: res.width,
                //                                 height: res.height,
                //                                 success(res) {
                //                                     var data = res.data
                //                                     var i, len, red, green, blue, alpha, average;
                //                                     ctx.clearRect(0, 0, res.width, res.height)
                //                                     for (i = 0, len = data.length; i < len; i += 4) {
                //                                         red = data[i];
                //                                         green = data[i + 1];
                //                                         blue = data[i + 2];
                //                                         alpha = data[i + 3];
                //                                         average = Math.floor((red + green + blue) / 3);
                //                                         var resBackground;
                //                                         if (average < 128) resBackground = 'rgb(15,15,76)'
                //                                         else resBackground = 'rgb(255,255,255)'
                //                                         ctx.setFillStyle(resBackground)
                //                                         let x = (i / 4) / res.width + 45;
                //                                         let y = (i / 4) % res.width + 90;
                //                                         ctx.fillRect(y, x, 1, 1);
                //                                         ctx.draw(true);
                //                                     }
                //                                     wx.canvasToTempFilePath({
                //                                         width: res.width,
                //                                         height: res.height,
                //                                         canvasId: "drawing",
                //                                         success: function (res) { //保存的图片的路径
                //                                             console.log(res.tempFilePath);
                //                                             pg.setData({
                //                                                 tmp_path: res.tempFilePath
                //                                             })

                //                                         },
                //                                         fail: function (res) {}
                //                                     }, this);
                //                                 },
                //                             })
                //                         }, 500);
                //                     },
                //                     fail() {}
                //                 })
                //             } else if (res.cancel) {}
                //         }
                //     });
                // } else {
                //     wx.showModal({
                //         title: '提示',
                //         content: '图片过大，上传失败',
                //         success(res) {
                //             if (res.confirm) {} else if (res.cancel) {}
                //         }
                //     })
                // }
            }
        });
    },

    //取消
    cancel(e) {
        this.setData({
            is_modal: 0
        });
    },

    //发送至购物车
    async in_cart(e) {
        var user_openid = this.data.user_openid
        var tmpPath = this.data.tmp_path
        var cloudPath = ""
        console.log(tmpPath)
        // 图片存云
        await wx.cloud.uploadFile({
            cloudPath: 'diyPhotoImage/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg",
            filePath: tmpPath,
        }).then(res => {
            console.log("上传成功")
            cloudPath = res.fileID
        })
        console.log(cloudPath)
        // 加入购物车
        wx.cloud.callFunction({
            name: "toBuyCarFunctions",
            data: {
                type: "addCar",
                user_openid: user_openid,
                is_diy: true,
                diy_image: cloudPath
            },
            success: res => {
                wx.showModal({
                    title: '提示',
                    content: '已加入购物车',
                    success(res) {
                        if (res.confirm) {} else if (res.cancel) {}
                    }
                })
            }
        })
    },

    async login(e) {
        // 云函数登录
        var pg = this
        await wx.cloud.callFunction({
            name: 'userFunctions',
            data: {
                type: 'getOpenid',
            },
            success: function (res) {
                app.globalData.user_openid = res.result.openid
                pg.setData({
                    user_openid: app.globalData.user_openid
                })
            },
        })

        // 授权获取信息
        wx.getUserProfile({
            desc: 'desc',
            success: (res) => {
                app.globalData.userInfo = res.userInfo
                app.globalData.user_signature = res.signature
                app.globalData.isLogin = true
                this.setData({
                    userInfo: app.globalData.userInfo,
                    signature: app.globalData.user_signature,
                    isLogin: true,
                    openid: app.globalData.user_openid
                })

            }
        })

    },
})