// pages/upgood/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //tag选项
        array: ['时尚单品', '服饰搭配', '蜡染工具', '蜡染艺术'],
        //发布的时候在这里取标题和内容
        temp_title: "",
        temp_content: "",

        //已上传图片的临时路径
        images: [],
        // 类别
        categoey: "",
        //openid
        user_openid: "",
        //用户信息
        userInfo: {},
        //价格
        price: 0
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
            userInfo: app.globalData.userInfo,
            user_openid: app.globalData.user_openid
        })
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

    //返回按钮，不用改
    jump(e) {
        wx.navigateBack({
            delta: 1,
            success: (res) => {},
            fail: (res) => {},
            complete: (res) => {},
        })
    },

    //添加图片
    add_img(e) {
        var old = this.data.images;
        var pg = this;
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album'],
            success(res) {
                console.log(res.tempFiles[0].tempFilePath)
                old.push(res.tempFiles[0].tempFilePath);
                pg.setData({
                    images: old
                });
            }
        })
    },

    //获取输入的标题
    in_title(e) {
        var title = e.detail.value;
        this.setData({
            temp_title: title
        });
    },

    //获取输入的内容
    in_content(e) {
        var content = e.detail.value;
        this.setData({
            temp_content: content
        });
    },

    //输入商品价格
    in_price(e) {
        var price = e.detail.value;
        this.setData({
            price: price
        });
    },


    //发布的动作
    async publish(e) {
        wx.showLoading({
            title: '加载中',
        })
        var user_openid = this.data.user_openid
        var title = this.data.temp_title; //获得标题
        var content = this.data.temp_content; //获得内容
        var localImages = this.data.images
        var cloudImags = []

        // 先把本地图片上传至云存储
        for (let i = 0; i < localImages.length; i++) {
            await wx.cloud.uploadFile({
                cloudPath: 'goodsImage/' + new Date().getTime() + "_" + Math.floor(Math.random() * 1000) + ".jpg",
                filePath: localImages[i],
            }).then(res => {
                console.log("上传成功", res.fileID)
                cloudImags.push(res.fileID)
            })
        }
        console.log(cloudImags)
        var goodsInfo = {
            "name": title,
            "describe": content,
            "image": cloudImags,
            "tag": [""], // toDo
            "category": this.data.categoey, // 四个选项让用户选
            "seller_openid": this.data.user_openid,
            "user_avatar": this.data.userInfo.avatarUrl,
            "user_nickname": this.data.userInfo.nickName,
            "detail": {},
            "note": "",
            "price": this.data.price,
            "res_num": 200
        }

        console.log(goodsInfo)
        wx.cloud.callFunction({
            name: "goodsFunctions",
            data: {
                type: "addGoodsProfile",
                goodInfo: goodsInfo,
                user_openid: user_openid
            },
            success: res => {
                console.log(res)
                wx.hideLoading({})

                wx.showModal({
                    title: '提示',
                    content: '发布成功',
                    success(res) {
                        if (res.confirm) {
                            wx.navigateBack({
                                delta: 1,
                                success: (res) => {},
                                fail: (res) => {},
                                complete: (res) => {},
                            })
                        } else if (res.cancel) {
                            wx.navigateBack({
                                delta: 1,
                                success: (res) => {},
                                fail: (res) => {},
                                complete: (res) => {},
                            })
                        }
                    }
                })
            },
            fail: err => {
                console.error(err)
            }
        })

    },

    //选择类别的动作
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
        this.setData({
            categoey: this.data.array[this.data.index]
        })
    },
})