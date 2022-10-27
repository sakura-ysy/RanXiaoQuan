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
 * 点赞帖子
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var user_openid = event.user_openid
    var post_id = event.post_id
    // 首先判断帖子是否存在
    var existPost = await postdb.where({
        _id: post_id
    }).get().then( res => {
        return res.data
    })
    if(existPost.length == 0){
        return {
            code: -1,
            msg: "帖子不存在"
        }
    }
    var exist = await userLikedb.where({
        user_openid: user_openid,
        post_id: post_id
    }).get().then(res => {
        return res.data
    })
    if (exist.length != 0){  // 用户已点赞
        return {
            code: -1,
            msg: '不可重复点赞'
        }
    }else{ 
        // 插入点赞表
        return userLikedb.add({
            data:{
                user_openid: user_openid,
                post_id: post_id,
                create_time: new Date()
            }
        }).then(res =>{
            // 帖子赞数加1
            return postdb.doc(post_id).update({
                data: {
                    like_num: _.inc(1)
                }
            }).then(res => {
                return {
                    code: 200,
                    res: res
                }
            })
        })
    }
}