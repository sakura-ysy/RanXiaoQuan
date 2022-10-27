const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const postdb = db.collection('post');
const userdb = db.collection('user');
const userLikedb = db.collection('user_like');
const _ = db.command;

/**
 * 取消点赞
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var user_openid = event.user_openid
    var post_id = event.post_id
    var exist = await userLikedb.where({
        user_openid: user_openid,
        post_id: post_id
    }).get().then(res => {
        return res.data
    })
    if (exist.length == 0){
        return {
            code: -1,
            msg: "用户未点赞"
        }
    } else {
        // 从点赞表中移除
        return userLikedb.where({
            user_openid: user_openid,
            post_id: post_id
        }).remove().then( res => {
            // 帖子点赞数减一
            return postdb.where({
                _id: post_id
            }).update({
                data:{
                    like_num: _.inc(-1)
                }
            }).then( res => {
                return {
                    code: 200,
                    res: res
                }
            })
        })
    }
}