// index.js
// const app = getApp()

Page({
    data: {
        //首页模式
        swap: 1,
        //小轮播图展示的图片
        nav: 0,
        //首页帖子列表
        postList: [],
        //偶数列表
        evenList: [],
        //奇数列表
        oddList: []
    },

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
        var id = this.data.nav;
        var category = "技艺"
        if (id == 0) category = "技艺";
        if (id == 1) category = "工具";
        if (id == 2) category = "作品";
        if (id == 3) category = "历史";
        this.getPostListByCat(category);
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
    onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    //转换首页模式
    change_mode(e) {
        if (this.data.swap === 1) {
            this.setData({
                swap: 0
            })
        } else if (this.data.swap === 0) {
            this.setData({
                swap: 2
            })
        } else {
            this.setData({
                swap: 0
            })
        }
    },

    //转换图片和帖子列表
    changePicAndPost(e) {
        var id = parseInt(e.currentTarget.id);
        this.setData({
            nav: id
        });
        console.log(id);
        var category;
        if (id == 0) category = "技艺";
        if (id == 1) category = "工具";
        if (id == 2) category = "作品";
        if (id == 3) category = "历史";
        this.getPostListByCat(category);
    },

    swipe(e){
        let id = e.detail.current
        this.setData({
            nav: id
        });
        var category;
        if (id == 0) category = "技艺";
        if (id == 1) category = "工具";
        if (id == 2) category = "作品";
        if (id == 3) category = "历史";
        this.getPostListByCat(category);
    },
    //跳到搜索界面
    jump(e) {
        wx.navigateTo({
            url: '../search/index',
            success: function (res) {},
            fail: function (res) {},
            complete: function (res) {},
        });
    },

    // 获取对应分类下的帖子列表
    async getPostListByCat(cat) {
        console.log(cat)
        wx.cloud.callFunction({
            name: "postFunctions",
            data: {
                type: "getPostListByCat",
                category: cat
            },
            success: res => {
                var data = res.result.res.data
                var len = data.length
                if (len <= 20) {
                    this.setData({
                        postList: data
                    })
                } else {
                    var tmp = []
                    // 20个不一样的随机数, 范围是[0~19]
                    var num = [];
                    for (var i = 0; i < 20; i++) {
                        num[i] = Math.floor(Math.random() * 20); 
                        for (var j = 0; j < i; j++) {
                            if (num[i] == num[j]) {
                                i--
                            }
                        }
                    }
                    for (let i = 0; i < num.length; i++) {
                        const index = num[i];
                        tmp.push(data[index])
                    }
                    this.setData({
                        postList: tmp
                    })
                }
                console.log(this.data.postList)
                var even = []
                var odd = []
                
                for(let i = 0; i < this.data.postList.length; i++){
                    if(i%2 == 0){
                        even.push(this.data.postList[i])
                    }else{
                        odd.push(this.data.postList[i])
                    }
                }
                this.setData({
                    evenList: even,
                    oddList: odd
                })
                console.log(this.data.evenList)
                console.log(this.data.oddList)
                
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

    // 说明
    to_explain(e) {
        wx.navigateTo({
            url: '../explain/index',
        })
    }
});