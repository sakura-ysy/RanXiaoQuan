// pages/circle/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

        //帖子列表
        myPostList: [],
        //用户信息
        userInfo: {},
        //openid
        user_openid: "",
        //签名
        user_signature: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const app = getApp()
        this.setData({
            userInfo: app.globalData.userInfo,
            user_signature: app.globalData.user_signature,
            user_openid: app.globalData.user_openid
        })
        this.getMyPostList()
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

    //跳转到搜索界面
    search(e) {
        wx.navigateTo({
            url: '../search/index',
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
        })
    },

    getMyPostList() {
        var user_openid = this.data.user_openid
        console.log(user_openid)

        wx.cloud.callFunction({
            name: "postFunctions",
            data: {
                type: "getPostListByUser",
                user_openid: user_openid
            },
            success: res => {
                var data = res.result.res.data
                this.setData({
                    myPostList: data
                })
                console.log(this.data.myPostList)
            },
            fail: err => {
                console.error(err)
            }
        })
    },

    // 进入单个帖子
    viewPost(e) {
        var id = e.currentTarget.dataset.item._id
        console.log(id)
        wx.navigateTo({
            url: "/pages/singlePost/index?id=" + id
        })
    },

    deletPost(e) {
        var user_openid = this.data.user_openid
        var data = e.currentTarget.dataset.item
        var post_id = data._id
        console.log(data)
        var pg = this
        wx.showModal({
            title: '提示',
            content: '确认删除？该操作不可逆',
            success(res) {
                if (res.confirm) {
                    wx.cloud.callFunction({
                        name: "postFunctions",
                        data: {
                            type: "deletePost",
                            post_id: post_id,
                            user_openid: user_openid
                        }
                    }).then(res => {
                        pg.getMyPostList()
                    })
                } else if (res.cancel) {}
            }
        })
    }
})