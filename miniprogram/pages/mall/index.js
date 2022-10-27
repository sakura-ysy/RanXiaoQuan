// pages/mall/index.js
var app = getApp()
Page({
    data: {
        //进入选购界面
        is_in: 0,
        //当前被选择的菜单
        currentIndex: 0,
        //下方展示内容
        menu_goods: [],
        //选择物品件数
        num: 0,
        show_num: 0,
        user_openid: ""
    },
    menuAll: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // let menu_goods = this.menu_all[0];
        // this.setData({
        //     menu_goods
        // })
        // console.log(menu_goods);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        const app = getApp()
        this.setData({
            user_openid: app.globalData.user_openid,
        })
        console.log(this.data.user_openid)
        this.getGoodsList()
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

    //上方菜单的点击事件
    handleIndex(e) {
        var index = parseInt(e.currentTarget.dataset.index);
        this.setData({
            currentIndex: index,
        });
        this.getGoodsList()
    },

    //加入/移出购物车
    add_good(e) {
        var pg = this
        let user_openid = this.data.user_openid;
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
        let k = this.data.num;
        let old = this.data.menu_goods;
        let index = parseInt(e.currentTarget.dataset.id);
        let good_id = this.data.menu_goods[index]._id
        if (old[index]["is_add"] == true) {
            // 移除购物车
            wx.cloud.callFunction({
                name: "toBuyCarFunctions",
                data: {
                    type: "deleteCar",
                    user_openid: user_openid,
                    good_id: good_id,
                }
            }).then(res => {
                console.log(index)
                old[index]["is_add"] = false;
                k = k - 1;
                let temp_str = k + "";
                this.setData({
                    num: k,
                    show_num: temp_str,
                    menu_goods: old
                })
            })

        } else {
            // 加入购物车
            wx.cloud.callFunction({
                name: "toBuyCarFunctions",
                data: {
                    type: "addCar",
                    user_openid: user_openid,
                    good_id: good_id,
                }
            }).then(res => {
                console.log(index)
                old[index]["is_add"] = true;
                k = k + 1;
                let temp_str = k + "";
                this.setData({
                    num: k,
                    show_num: temp_str,
                    menu_goods: old
                })
            })
        }
    },


    // 从购物车移除
    minus_good(e) {
        let k = 0;
        let temp_str = k + "";
        let old = this.data.menu_goods;
        var user_openid = this.user_openid
        for (var i = 0; i < old.length; i++) {
            if (old[i]["is_add"] == true) {
                old[i]["is_add"] = false;
                var goods_id = old[i]._id
                console.log(goods_id)
                wx.cloud.callFunction({
                    name: "toBuyCarFunctions",
                    data: {
                        type: "deleteCar",
                        user_openid: user_openid,
                        good_id: goods_id,
                    }
                })
            }
        }
        this.setData({
            num: k,
            show_num: temp_str,
            menu_goods: old
        })
    },

    //跳转到搜索界面
    jump(e) {
        wx.navigateTo({
            url: '../search/index',
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
        });
    },

    //跳转到购物车界面
    cart(e) {
        var pg = this
        var user_openid = this.data.user_openid;
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
        wx.navigateTo({
            url: '../cart/index',
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
        })
    },

    //进入选购界面
    buy(e) {

        this.setData({
            is_in: 1
        });
    },

    // 商品列表
    getGoodsList() {
        var category
        if (this.data.currentIndex == 0) category = "时尚单品"
        if (this.data.currentIndex == 1) category = "服饰搭配"
        if (this.data.currentIndex == 2) category = "蜡染工具"
        if (this.data.currentIndex == 3) category = "蜡染艺术"

        wx.cloud.callFunction({
            name: "goodsFunctions",
            data: {
                type: "getGoodsListByCat",
                category: category
            },
            success: res => {
                var data = res.result.res
                for (var i = 0; i < data.length; i++) {
                    data[i]["is_add"] = false
                }
                this.setData({
                    menu_goods: data,
                    num: 0,
                    show_num: 0
                })
                console.log(this.data.menu_goods)
            }
        })
    },

    // 进入单个商品
    view(e) {
        var data = e.currentTarget.dataset.item
        var id = data._id
        console.log(id)
        wx.navigateTo({
            url: "/pages/singleGoods/index?id=" + id
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