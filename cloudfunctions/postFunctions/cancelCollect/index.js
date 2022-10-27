const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const postdb = db.collection('post');
const userdb = db.collection('user');
const userCollectdb = db.collection('user_collect');
const _ = db.command;

/**
 * 取消收藏
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var user_openid = event.user_openid
    var post_id = event.post_id
    var exist = await userCollectdb.where({
        user_openid: user_openid,
        post_id: post_id
    }).get().then(res => {
        return res.data
    })
    if (exist.length == 0){
        return {
            code: -1,
            msg: "用户未收藏"
        }
    } else {
        // 从收藏表中移除
        return userCollectdb.where({
            user_openid: user_openid,
            post_id: post_id
        }).remove().then( res => {
            // 帖子收藏数减一
            return postdb.where({
                _id: post_id
            }).update({
                data:{
                    collect_num: _.inc(-1)
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