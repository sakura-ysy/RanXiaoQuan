// pages/bmaptest/index.js
const bmap = require('../../utils/bmap-wx/bmap-wx.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loactionString: "",
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

    test(){
        var that = this;
        var BMap = new bmap.BMapWX({
            ak: '28mCPQ4CRz8eUZi8rHsIiAuXsL7uQ3ua'
          });
          console.log(123)
          wx.getLocation({
            type: 'wgs84',
            success (res) {
              const latitude = res.latitude
              const longitude = res.longitude
              const speed = res.speed
              const accuracy = res.accuracy
              console.log(latitude,longitude)
              BMap.regeocoding({
                location: latitude + ',' + longitude,
                success: function(res) {
                    console.log(res.originalData.result.formatted_address)
                },
                fail: function (err) {
                    console.log(err)
                   },
              })
            }
            
           })
    }
})