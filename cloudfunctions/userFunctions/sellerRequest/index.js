const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const srdb = db.collection('seller_request');

/**
 * 申请成为卖家
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => { 
  const wxContext = cloud.getWXContext()
    var name = event.requestInfo.name
    var mobile = event.requestInfo.mobile
    var wx_id = event.requestInfo.wx_id
    var describe = event.requestInfo.describe
    var user_openid = event.user_openid

    // 查看该用户是否已申请过
    return srdb.where({
        user_openid: user_openid
    })
    .get().then(res => {
        // 不存在则插入
        if (res.data.length == 0){
            return srdb.add({
                data: {
                    name: name,
                    mobile: mobile,
                    wx_id: wx_id,
                    describe: describe,
                    user_openid: user_openid
                },
                success: function(res) {
                    console.log(res)
                    return {
                        code: 200,
                        res: res
                    }
                }
                })
        }
        // 存在则更新
        else{
            srdb.where({
                user_openid: user_openid
            }).update({
                data:{
                    name: name,
                    mobile: mobile,
                    wx_id: wx_id,
                    describe: describe
                },
                success: function(res) {
                        console.log(res)
                        return res;
                        }
                })
        }
    })
};
