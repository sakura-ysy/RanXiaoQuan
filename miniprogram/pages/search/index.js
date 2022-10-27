// pages/search/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //搜索出来的项目
        search_item:[],
        //搜索框内容
        content:"",
        //
        search_input: ""
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

    jump(e) {
        wx.navigateBack({
          delta: 1,
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
    },

    //搜索框内容更新
    search_one(e) {
        this.setData({
            content:e.detail.value
        });
    },

    //点击搜索
    async point(e) {
        var keywd = this.data.content
        var old = []
        var posts = await wx.cloud.callFunction({
            name: "postFunctions",
            data:{
                type: "searchPost",
                keywd: keywd
            }
        }).then(res => {
            var data = res.result.res.data
            return data
        })

        for (let i = 0; i < posts.length; i++) {
            posts[i]['cate'] = "圈子"
            old.push(posts[i])
        }

        var goods = await wx.cloud.callFunction({
            name: "goodsFunctions",
            data:{
                type: "searchGoods",
                keywd: keywd
            }
        }).then(res => {
            var data = res.result.res.list
            return data
        })

        for (let i = 0; i < goods.length; i++) {
            goods[i]['cate'] = "商品"
            old.push(goods[i])
        }


        this.setData({
            search_item: old
        })

        console.log(this.data.search_item)
    },

    //点击跳转界面
    go_in(e) {
        var data = e.currentTarget.dataset.item
        console.log(data)
        if(data.cate === '圈子'){
            // 进入单个帖子
            var id = data._id
            console.log(id)
            wx.navigateTo({
                url:"/pages/singlePost/index?id="+id
              })
        }
        if(data.cate === '商品'){
            // 进入单个商品
            var id = data._id
            console.log(id)
            wx.navigateTo({
                url:"/pages/singleGoods/index?id="+id
              })
        }
    },
    
    clear(){
        this.setData({
            search_input: ""
        }
        )
    }
})