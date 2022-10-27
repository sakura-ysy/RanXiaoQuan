// pages/order/index.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //订单信息，已联系，已发货，已送达
        order:[],
        // 用户openid
        user_openid: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const app = getApp()
        this.setData({
            user_openid: app.globalData.user_openid
        })
        this.gerOrderList()
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

    //弹窗
    show_msg(e) {
        wx.showModal({
            title: '提示',
            content: '已经发出对该卖家的申诉',
          });
    },

    gerOrderList(){
        var user_openid = this.data.user_openid
        wx.cloud.callFunction({
            name: "goodsOrderFunctions",
            data:{
                type: "getOrderListByUser",
                user_openid:user_openid
            }
        }).then(res => {
            var data = res.result.res
            console.log(res)
            this.setData({
                order: data
            })
        })
    }
})