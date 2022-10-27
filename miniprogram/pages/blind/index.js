// pages/blind/index.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //点击按钮开始动画
        is_move: 0,
        //控制小球
        is_ball: 0,
        //控制弹窗
        is_modal: 0,
        //盲盒库
        store: [],
        //当前随机到的盲盒的id
        good_id: 99,
        // 用户openid
        user_openid: ""
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
        this.getBlindList()
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

    jump(e) {
        wx.navigateBack({
            delta: 1,
            success: (res) => {},
            fail: (res) => {},
            complete: (res) => {},
        })
    },

    //点击开始扭蛋
    start(e) {
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

        this.setData({
            is_move: 1
        });

        setTimeout(() => {
            this.setData({
                is_move: 0,
                is_ball: 1
            });
        }, 3000);
    },

    //获取扭蛋出来的物品
    get_good(e) {
        var temp = Math.floor(Math.random() * this.data.store.length); //获取随机数
        this.setData({
            good_id: temp,
            is_modal: 1
        });
    },

    //取消
    cancel(e) {
        this.setData({
            is_modal: 0,
            is_ball: 0
        });
    },

    //加入购物车
    in_cart(e) {
        var user_openid = this.data.user_openid
        var goods = this.data.store[this.data.good_id]
        console.log(goods)
        wx.cloud.callFunction({
            name: "toBuyCarFunctions",
            data: {
                type: "addCar",
                user_openid: user_openid,
                good_id: goods._id,
            },
            success: res => {
                wx.navigateBack({
                    delta: 1,
                })
            }
        })
    },

    getBlindList() {
        var category = "盲盒"
        wx.cloud.callFunction({
            name: "goodsFunctions",
            data: {
                type: "getGoodsListByCat",
                category: category
            }
        }).then(res => {
            console.log(res)
            var data = res.result.res
            this.setData({
                store: data
            })
        })
    },

    // 登录
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

    }
})