// pages/cart/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //已加入购物车的商品
        good: [],
        //已选择的商品数量
        choose_num: 0,
        //总共的商品数量
        all_num: 2,
        // 用户id
        user_openid: "",
        // 地址id
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
            user_openid: app.globalData.user_openid,
            addr_id: app.globalData.addr_id
        })
        this.getCar()
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

    //全选
    chooseAll(e) {
        var old = this.data.good;
        for (var i = 0; i < this.data.good.length; i++) {
            old[i]['choose'] = true;
        }
        this.setData({
            good: old,
            choose_num: this.data.all_num
        });
    },

    //全部取消
    cancelAll(e) {
        var old = this.data.good;
        for (var i = 0; i < this.data.good.length; i++) {
            old[i]['choose'] = false;
        }
        this.setData({
            good: old,
            choose_num: 0
        });
    },

    //单个选择或取消
    chooseOne(e) {
        var old = this.data.good;
        var id = e.currentTarget.dataset.id;
        if (old[id]['choose'] === true) {
            old[id]['choose'] = false;
            this.setData({
                good: old,
                choose_num: this.data.choose_num - 1
            });
        } else {
            old[id]['choose'] = true;
            this.setData({
                good: old,
                choose_num: this.data.choose_num + 1
            });
        }
    },

    //单个删除
    deleteOne(e) {
        var old = this.data.good;
        var id = e.currentTarget.dataset.id;
        var good_id = old[id].good_id
        var user_openid = this.data.user_openid

        // 移除购物车
        wx.cloud.callFunction({
            name: "toBuyCarFunctions",
            data: {
                type: "deleteCar",
                user_openid: user_openid,
                good_id: good_id,
            }
        }).then(res => {
            if (old[id]['choose'] === true) {
                this.setData({
                    choose_num: this.data.choose_num - 1
                });
            }
            this.getCar()
        })
    },

    //返回
    jump(e) {
        wx.navigateBack({
            delta: 1,
            success: (res) => {},
            fail: (res) => {},
            complete: (res) => {},
        })
    },

    getCar() {
        var user_openid = this.data.user_openid
        console.log(user_openid)
        wx.cloud.callFunction({
            name: "toBuyCarFunctions",
            data: {
                type: "getCar",
                user_openid: user_openid
            }
        }).then(res => {
            console.log(res)
            var data = res.result.res.list
            for (var i = 0; i < data.length; i++) {
                data[i]['choose'] = false
            }
            this.setData({
                good: data
            })
            console.log(this.data.good)
        })
    },

    // 发布订购消息
    async publish() {
        var addr_id = this.data.addr_id
        console.log(addr_id)
        if (addr_id == undefined || addr_id == null || addr_id == "") {
            wx.showModal({
                title: '提示',
                content: '请先选择地址',
            })
            return
        }
        console.log(this.data.good.length)
        var num = 0
        for(var i = 0; i < this.data.good.length; i++) {
            var good = this.data.good[i]
            if (good.choose == true){
                num += 1
                break
            }
        }
        if(num == 0){
            return
        }
        this.sendBuyNotice()
        var user_openid = this.data.user_openid

        console.log(addr_id)
        for (var i = 0; i < this.data.good.length; i++) {
            var good = this.data.good[i]
            if (good.choose == true) {
                // 普通商品加入订单
                if (!good.is_diy) {
                    await wx.cloud.callFunction({
                        name: "goodsOrderFunctions",
                        data: {
                            type: "buyGoods",
                            user_openid: user_openid,
                            goods_id: good.good_id,
                            address_id: addr_id
                        }
                    })
                }
                // diy拍一拍加入订单
                else {
                    await wx.cloud.callFunction({
                        name: "goodsOrderFunctions",
                        data: {
                            type: "buyGoods",
                            user_openid: user_openid,
                            diy_image: good.diy_image,
                            address_id: addr_id,
                            is_diy: true
                        }
                    })
                }
            }
        }

        this.sendBuyNotice()
    },

    async getAddressInfo() {
        // 获取地址和电话信息
        var addr_id = this.data.addr_id
        if(addr_id == undefined || addr_id == "" || addr_id == null){
            return
        }
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

    // 进入单个商品
    view(e) {
        console.log(e)
        var data = e.currentTarget.dataset.item
        console.log(data)
        var id = data.good_id
        console.log(id)
        wx.navigateTo({
            url: "/pages/singleGoods/index?id=" + id
        })
    }
})