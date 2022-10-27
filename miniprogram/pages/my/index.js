// pages/my/index.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //获取输入框中的数据
        temp_wx: "微信号",
        temp_brief: "简介",
        temp_name: "姓名",
        temp_phone: "电话",
        //初始化隐藏模态输入框
        hiddenmodalput: true,
        //展示模式
        swap: 1,
        // 收藏夹
        collectList: [],
        // 是否展示申请成为卖家的输入框
        req_mode: 0,
        // 登录信息
        //是否登录
        isLogin: false,
        //是否为卖家
        isSeller: false,
        //用户信息
        userInfo: {},
        //openid
        openid: "",
        //用户签名
        user_signature: ""
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
        console.log(app.globalData.user_openid)
        if(app.globalData.user_openid != undefined && app.globalData.user_openid != ""){
            this.setData({
                user_openid:app.globalData.user_openid,
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        }
        this.getCollectList()
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

    //改变展示模式
    change_mode(e) {
        if (this.data.swap == 1 || this.data.swap == 3) {
            this.setData({
                swap: 2
            })
        } else if (this.data.swap == 2) {
            this.setData({
                swap: 3
            })
        }
    },

    //输入卖家信息
    modalinput(e) {
        this.setData({
            req_mode: 1,
        });
    },

    modalcancel(e) {
        this.setData({
            req_mode: 0
        });
    },

    in_wx(e) {
        this.setData({
            temp_wx: e.detail.value
        });
    },

    in_name(e) {
        this.setData({
            temp_name: e.detail.value
        });
    },

    in_phone(e) {
        this.setData({
            temp_phone: e.detail.value
        });
    },

    in_brief(e) {
        this.setData({
            temp_brief: e.detail.value
        });
    },


    // 登录
    async login(e) {
        // 云函数登录
        await wx.cloud.callFunction({
            name: 'userFunctions',
            data: {
                type: 'getOpenid',
            },
            success: function (res) {
                app.globalData.user_openid = res.result.openid
            },
        })

        console.log([app.globalData.user_openid, app.globalData.userInfo])
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

                // 获取收藏列表
                this.getCollectList()
                // 判断是否为卖家
                this.isSeller()

            }
        })

    },

    isSeller() {
        var user_openid = app.globalData.user_openid
        wx.cloud.callFunction({
            name: "userFunctions",
            data: {
                type: "isSeller",
                user_openid: user_openid
            }
        }).then(res => {
            var data = res.result.res
            this.setData({
                isSeller: data
            })
        })
    },

    // 获取收藏列表
    getCollectList() {
        console.log(123)
        var user_openid =  app.globalData.user_openid
        wx.cloud.callFunction({
            name: 'postFunctions',
            data: {
                type: 'getCollectList',
                user_openid: user_openid
            },
        }).then(res => {
            var data = res.result.res
            console.log(data)
            this.setData({
                collectList: data
            })
            console.log(this.data.collectList)
        })
    },

    // 进入单个帖子
    viewPost(e) {
        console.log(e.currentTarget.dataset)
        var id = e.currentTarget.dataset.item.post_id
        console.log(id)
        wx.navigateTo({
            url: "/pages/singlePost/index?id=" + id
        })
    },

    //点击发布商品
    upload_good(e) {
        if (!this.data.isSeller) {
            return
        }
        wx.navigateTo({
            url: '../upgoods/index',
        })
    },

    // 申请成为卖家
    becomeSeller() {
        var user_openid = app.globalData.user_openid
        var temp_wx = this.data.temp_wx
        var temp_brief = this.data.temp_brief
        var temp_name = this.data.temp_name
        var temp_phone = this.data.temp_phone
        console.log(temp_wx,temp_brief,temp_name,temp_phone)
        var pg = this
        wx.showModal({
            title: '提示',
            content: '确定申请成为卖家？',
            success(res) {
                if (res.confirm) {
                    var requestInfo = {
                        "name": temp_name,
                        "mobile": temp_phone,
                        "wx_id": temp_wx,
                        "describe": temp_brief,
                    }
                    wx.cloud.callFunction({
                        name: "userFunctions",
                        data: {
                            type: "sellerRequest",
                            requestInfo: requestInfo,
                            user_openid: user_openid
                        },
                        success: res => {
                            wx.showModal({
                                title: '提示',
                                content: '已提交申请，请等待审核',
                                success(res) {
                                }
                            })
                            pg.setData({
                                req_mode: 0
                            })
                        }
                    })
                } else if (res.cancel) {}
            }
        })
    }
})