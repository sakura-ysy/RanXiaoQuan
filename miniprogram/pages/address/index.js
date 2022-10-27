// pages/address/index.js
const bmap = require('../../utils/bmap-wx/bmap-wx.js')
var app
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //获取输入框中的数据
        temp_name: "",
        temp_phone: "",
        temp_id: 0,
        temp_province: "",
        temp_city: "",
        temp_district: "",
        temp_addr: "", // 详细地址
        region: [],
        //初始化隐藏模态输入框
        add_mode: 0,
        edit_mode: 0,
        addr: [],
        //将要编辑的地址id
        edit_id: "",
        //用户openid
        user_openid: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        app = getApp()
        this.setData({
            user_openid: app.globalData.user_openid
        })
        this.getAddressList()
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

    add_addr(e) {
        this.setData({
            add_mode: 1
        });
    },

    edit_addr(e) {
        var index = e.currentTarget.dataset.id
        var id = this.data.addr[index]._id
        this.setData({
            edit_mode: 1,
            edit_id: id
        });
    },

    edit_cancel(e) {
        this.setData({
            edit_mode: 0,
            temp_province: "",
            temp_city: "",
            temp_district: "",
            temp_addr: "",
            region: [],
            temp_name: "",
            temp_phone: ""
        });
    },

    add_cancel(e) {
        this.setData({
            add_mode: 0,
            temp_province: "",
            temp_city: "",
            temp_district: "",
            temp_addr: "",
            region: [],
            temp_name: "",
            temp_phone: ""
        });
    },

    in_addr(e) {
        this.setData({
            temp_addr: e.detail.value
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

    add_confirm(e) {
        var user_openid = this.data.user_openid;

        var addressInfo = {
            "address": this.data.temp_addr,
            "mobile": this.data.temp_phone,
            "name": this.data.temp_name,
            "province": this.data.temp_province,
            "city": this.data.temp_city,
            "district": this.data.temp_district
        }
        wx.cloud.callFunction({
            name: "addressFunctions",
            data: {
                type: "addAddress",
                user_openid: user_openid,
                addressInfo: addressInfo
            }
        }).then(res => {
            this.getAddressList()
            this.setData({
                add_mode: 0,
                temp_province: "",
                temp_city: "",
                temp_district: "",
                temp_addr: "",
                region: [],
                temp_name: "",
                temp_phone: ""
            })
            wx.showModal({
                title: '提示',
                content: '地址添加成功',
            })
        })
    },

    edit_confirm(e) {
        var user_openid = this.data.user_openid;
        var edit_id = this.data.edit_id;
        var addressInfo = {
            "address": this.data.temp_addr,
            "mobile": this.data.temp_phone,
            "name": this.data.temp_name,
            "province": this.data.temp_province,
            "city": this.data.temp_city,
            "district": this.data.temp_district
        }
        wx.cloud.callFunction({
            name: "addressFunctions",
            data: {
                type: "editAddress",
                user_openid: user_openid,
                id: edit_id,
                addressInfo: addressInfo
            }
        }).then(res => {
            this.getAddressList()
            this.setData({
                edit_mode: 0,
                temp_province: "",
                temp_city: "",
                temp_district: "",
                temp_addr: "",
                region: [],
                temp_name: "",
                temp_phone: ""
            })
            wx.showModal({
                title: '提示',
                content: '地址修改成功',
            })
        })
    },

    //删除地址
    delete(e) {
        var user_openid = this.data.user_openid
        var old = this.data.addr;
        var id = parseInt(e.currentTarget.dataset.id);
        var addr_id = this.data.addr[id]._id
        var temp = this;
        console.log(addr_id)
        wx.showModal({
            title: '注意',
            content: '确定要删除该地址吗？',
            success(res) {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: "addressFunctions",
                        data: {
                            type: "deleteAddress",
                            id: addr_id,
                            user_openid: user_openid
                        }
                    }).then(res => {
                        temp.getAddressList()
                    })

                } else if (res.cancel) {}
            }
        });
    },

    // 选取为当前地址
    select(e) {
        var addr_id = e.currentTarget.dataset.item._id
        console.log(addr_id)
        var that = this
        wx.showModal({
            title: '注意',
            content: '确定将该地址设为当前地址？',
            success(res) {
                if (res.confirm) {
                    app.globalData.addr_id = addr_id
                    that.setData({
                        addr_id: addr_id
                    })
                    console.log(that.data.addr_id)
                } else if (res.cancel) {}
            }
        });


    },

    // 获取地址列表
    getAddressList() {
        var user_openid = this.data.user_openid
        wx.cloud.callFunction({
            name: "addressFunctions",
            data: {
                type: "getAddressList",
                user_openid: user_openid,
            }
        }).then(res => {
            this.setData({
                addr: res.result.res.data
            });
            console.log(this.data.addr)
        })
    },

    getUserProvince: function (e) {
        console.log(e.detail.value)
        var region = e.detail.value
        this.setData({
            temp_province: region[0],
            temp_city: region[1],
            temp_district: region[2],
            region: region
        })
        console.log(this.data.province)
    },

    // 定位
    locate: function () {
        var pg = this
        var BMap = new bmap.BMapWX({
            ak: '28mCPQ4CRz8eUZi8rHsIiAuXsL7uQ3ua'
        });
        console.log(123)
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                const latitude = res.latitude
                const longitude = res.longitude
                const speed = res.speed
                const accuracy = res.accuracy
                console.log(latitude, longitude)
                BMap.regeocoding({
                    location: latitude + ',' + longitude,
                    success: function (res) {
                        var data = res.originalData.result.addressComponent
                        console.log(data)
                        pg.setData({
                            temp_province: data.province,
                            temp_city: data.city,
                            temp_district: data.district,
                            region: [data.province, data.city, data.district],
                            temp_addr: data.street + data.street_number
                        })
                    },
                    fail: function (err) {
                        console.log(err)
                    },
                })
            }
        })
    }
})