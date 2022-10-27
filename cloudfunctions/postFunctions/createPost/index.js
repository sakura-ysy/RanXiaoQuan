const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const postdb = db.collection('post');

/**
 * 发布帖子
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var postInfo = event.postInfo
    return postdb.add({
        data:{
            title: postInfo.title,
            tag: postInfo.tag,
            image: postInfo.image,
            content: postInfo.content,
            category: postInfo.category,
            user_openid: postInfo.user_openid,
            user_nickname: postInfo.user_nickname,
            user_avatar:postInfo.user_avatar,
            imitate: 0,
            like_num: 0,
            collect_num: 0,
            view: 1
        }
    }).then(res => {
        return {
            code: 200,
            res: res
        }
    })
}