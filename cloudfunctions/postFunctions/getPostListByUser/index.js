const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const postdb = db.collection('post');

/**
 * 得到某一用户的所有帖子
 * @param {*} event
 * @param {*} context
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const user_openid = event.user_openid
    return postdb.where({
        user_openid: user_openid
    }
    ).get().then(res => {
        console.log(res)
        return {
            code: 200,
            res: res
        }
    })
}