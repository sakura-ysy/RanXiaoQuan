const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const postdb = db.collection('post');
const userCollectdb = db.collection('user_collect');
/**
 * 得到用户收藏的所有帖子
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var user_openid = event.user_openid
    // 联表查询
    return userCollectdb.aggregate().match({
        user_openid: user_openid
    }).lookup({
        from: 'post',
        localField: 'post_id',
        foreignField: '_id',
        as: 'postInfo',
    }).end().then(res => {
        return {
            code: 200,
            res: res.list
        }
    })
}