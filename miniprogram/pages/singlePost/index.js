// pages/single/index.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //帖子id
        post_id: "",
        //登录用户id
        user_openid: "",
        //点赞数
        like: 0,
        //浏览量
        browse: 0,
        //收藏量
        collect: 0,
        //是否喜欢
        is_like: false,
        //是否收藏
        is_collect: false,
        //展示的图片
        pic: [],
        //标题
        title: "",
        //内容
        content: "",
        //作者昵称
        auth_nickname: "",
        //作者头像
        auth_avatar: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const app = getApp()
        var user_openid = app.globalData.user_openid
        var post_id = options.id
        console.log(post_id)
        this.setData({
            user_openid: user_openid,
            post_id: post_id
        })
        console.log(user_openid)
        this.getPostDetail()
        this.isLike()
        this.isCollect()
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

    //返回上一个界面
    jump(e) {
        wx.navigateBack({
            delta: 1
        });
    },

    // 点赞或取消点赞该圈子
    like_it(e) {
        var pg = this
        var post_id = this.data.post_id
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
        if (!this.data.is_like) {
            //点赞
            wx.cloud.callFunction({
                name: "postFunctions",
                data: {
                    type: "likePost",
                    user_openid: user_openid,
                    post_id: post_id
                },
            }).then(res => {
                var code = res.result.code
                if (code == 200) {
                    this.setData({
                        is_like: true,
                        like: this.data.like + 1
                    });
                    wx.showModal({
                        title: '提示',
                        content: '点赞成功',
                    })
                }
            })
            return
        } else if (this.data.is_like) {
            //取消点赞
            wx.cloud.callFunction({
                name: "postFunctions",
                data: {
                    type: "cancelLike",
                    user_openid: user_openid,
                    post_id: post_id
                },
            }).then(res => {
                var code = res.result.code
                if (code == 200) {
                    this.setData({
                        is_like: false,
                        like: this.data.like - 1
                    });
                    wx.showModal({
                        title: '提示',
                        content: '取消点赞成功',
                    })
                }
            })
            return
        }
    },

    //收藏该圈子
    collect_it(e) {
        var pg = this
        var post_id = this.data.post_id
        var user_openid = this.data.user_openid
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
        console.log(123456)
        if (!this.data.is_collect) {
            // 收藏
            wx.cloud.callFunction({
                name: "postFunctions",
                data: {
                    type: "collectPost",
                    user_openid: user_openid,
                    post_id: post_id
                },
            }).then(res => {
                var code = res.result.code
                if (code == 200) {
                    this.setData({
                        is_collect: true,
                        collect: this.data.collect + 1
                    });
                    wx.showModal({
                        title: '提示',
                        content: '收藏成功',
                    })
                }
            })
        } else if (this.data.is_collect) {
            // 取消收藏
            wx.cloud.callFunction({
                name: "postFunctions",
                data: {
                    type: "cancelCollect",
                    user_openid: user_openid,
                    post_id: post_id
                },
            }).then(res => {
                var code = res.result.code
                if (code == 200) {
                    this.setData({
                        is_collect: false,
                        collect: this.data.collect - 1
                    });
                    wx.showModal({
                        title: '提示',
                        content: '取消收藏成功',
                    })
                }

            })
        }
    },

    //获取帖子详情
    getPostDetail() {
        var id = this.data.post_id
        console.log(123456)
        wx.cloud.callFunction({
            name: "postFunctions",
            data: {
                type: "getPostDetail",
                id: id
            },
        }).then(res => {
            var data = res.result.res.data
            this.setData({
                like: data.like_num,
                browse: data.view,
                collect: data.collect_num,
                pic: data.image,
                title: data.title,
                content: data.content,
                auth_nickname: data.user_nickname,
                auth_avatar: data.user_avatar
            })
            console.log(123)
            console.log(this.data.auth_nickname, this.data.auth_avatar)
        })
    },

    // 判断是否点赞
    isLike() {
        var user_openid = this.data.user_openid
        var post_id = this.data.post_id
        wx.cloud.callFunction({
            name: "postFunctions",
            data: {
                type: "isLike",
                user_openid: user_openid,
                post_id: post_id
            },
        }).then(res => {
            this.setData({
                is_like: res.result.res
            })
        })
    },

    // 判断用户是否收藏
    isCollect() {
        var user_openid = this.data.user_openid
        var post_id = this.data.post_id
        console.log(user_openid, post_id)
        wx.cloud.callFunction({
            name: "postFunctions",
            data: {
                type: "isCollect",
                user_openid: user_openid,
                post_id: post_id
            },
        }).then(res => {
            this.setData({
                is_collect: res.result.res
            })
            console.log(this.data.is_collect)
        })
    },

    chuo() {
        wx.showModal({
            title: '提示',
            content: '请求已接收，后台会帮您转发',
            success(res) {}
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
                this.isLike()
                this.isCollect()
            }
        })

    }
})