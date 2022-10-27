// pages/detail/index.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //商品id
        goods_id: "",
        //商品图片
        pic: [],
        //商品名称
        title: "",
        //商品简介
        content: "",
        //售出数量
        out_num: 0,
        //库存数量
        in_store: 0,
        //卖家昵称
        seller_nickname: "",
        //卖家头像
        seller_avatar:"",
        //当前地址
        addr_id: "",
        // 手机号
        mobile: "",
        // 姓名
        name: "",
        // 地址
        address: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var goods_id = options.id
        this.setData({
            goods_id: goods_id
        })
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
        var user_openid = app.globalData.user_openid
        var addr_id = app.globalData.addr_id
        this.setData({
            user_openid: user_openid,
            addr_id: addr_id
        })
        this.getProfile()
        this.getAddressInfo()
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

    //返回上一个界面
    jump(e) {
        wx.navigateBack({
            delta: 1
        });
    },

    //加入购物车
    goin_cart(e) {
        var pg = this
        var user_openid = this.data.user_openid
        console.log(user_openid)
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
        var goods_id = this.data.goods_id
        // 加入购物车
        wx.cloud.callFunction({
            name: "toBuyCarFunctions",
            data: {
                type: "addCar",
                user_openid: user_openid,
                good_id: goods_id,
            },
            success: res => {
                wx.showModal({
                    title: '提示',
                    content: '成功加入购物车',
                    success(res) {
                        if (res.confirm) {
                            pg.login()
                        }
                    }
                })
            }
        })

    },

    //立即订购
    async now_order(e) {
        var pg = this
        var user_openid = this.data.user_openid
        console.log(user_openid)
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

        var addr_id = this.data.addr_id
        if (addr_id == undefined || addr_id == null || addr_id == "") {
            wx.showModal({
                title: '提示',
                content: '请先选择地址',
            })
            return
        }
        
        this.sendBuyNotice()
        var goods_id = this.data.goods_id

        await wx.cloud.callFunction({
            name: "goodsOrderFunctions",
            data: {
                type: "buyGoods",
                user_openid: user_openid,
                goods_id: goods_id,
                address_id: addr_id
            },
        })
    },

    //获取信息
    async getProfile(e) {
        var goods_id = this.data.goods_id
        await wx.cloud.callFunction({
            name: "goodsFunctions",
            data: {
                type: "findGoodsProfile",
                goods_id: goods_id
            }
        }).then(res => {
            var data = res.result.res[0]
            console.log(data)
            this.setData({
                pic: data.image,
                title: data.name,
                content: data.describe,
                out_num: data.sold_num,
                in_store: data.res_num,
                seller_nickname: data.seller[0].nickname,
                seller_avatar: data.seller[0].avatar
            })
        })
    },

    async getAddressInfo() {
        // 获取地址和电话信息
        var addr_id = this.data.addr_id
        console.log(addr_id)
        await wx.cloud.callFunction({
            name: "addressFunctions",
            data: {
                type: "getAddressById",
                id: addr_id
            }
        }).then(res => {
            var data = res.result.res.data[0]
            this.setData({
                mobile: data.mobile,
                name: data.name,
                address: data.address
            })
        })
        
    },

    async sendBuyNotice() {
        var mobile = this.data.mobile
        var name = this.data.name
        var address = this.data.address
        console.log(name)
        // 获取订阅的权限
        wx.requestSubscribeMessage({
            tmplIds: ['hnbKQDILfQGvqJ4-aXiQswJ82_GKkVeupfqx7YLBicw'],
            success(res) {
                wx.cloud.callFunction({
                    name: 'sendNotice',
                    data: {
                        name: name,
                        mobile: mobile,
                        address: address
                    },
                    success: res => {

                    },
                    fail: err => {
                        console.error(err)
                    }
                })

                wx.navigateBack({
                    delta: 0,
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

    }
})