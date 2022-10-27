const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const userLikedb = db.collection('user_like');
const _ = db.command

/**
 * 判断用户是否对某一帖子点赞
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
    if(exist.length != 0){
        return {
            code: 200,
            res: true,
            msg: "已点赞"
        }
    } else {
        return {
            code: 200,
            res: false,
            msg: "未点赞"
        }
    }
}