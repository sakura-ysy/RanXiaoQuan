const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const postdb = db.collection('post');
const collectdb = db.collection('user_collect')
const _ = db.command

/**
 * 删除帖子
 * @param {*} event 
 * @param {*} context
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var post_id = event.post_id
    var user_openid = event.user_openid
    if(post_id == undefined){
        return
    }
    // 删除商品
    return await postdb.where({
        _id: post_id,
        user_openid: user_openid
    }).remove().then(res => {
        // 从收藏夹中删除
        collectdb.where({
            post_id: post_id
        }).remove().then(res => {
            return {
                "code": 200,
                "res": res
            }
        })
    })
}