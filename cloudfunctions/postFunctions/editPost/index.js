const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const postdb = db.collection('post');

/**
 * 编辑帖子，输入帖子id 和 帖子实体
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var id = event.id
    var postInfo = event.postInfo
    return postdb.where({
        _id: id
    }).get().then(res => {
        // 帖子不存在
        if (res.data.length == 0){
            return {
                code: -1,
                msg: "帖子不存在"
            }
        }
        // 用户非作者
        if (res.data[0].user_openid != postInfo.user_openid){
            return {
                code: -1,
                msg: "非作者"
            }
        }
        var existPost = res.data[0]
        var title = (postInfo.title == "" ? existPost.title : postInfo.title)
        var content = (postInfo.content == "" ? existPost.content : postInfo.content)
        var image = (postInfo.image == "" ? existPost.image : postInfo.image)
        var category = (postInfo.category == "" ? existPost.category : postInfo.category)
        var tag = (postInfo.tag == "" ? existPost.tag : postInfo.tag)
        // 更新帖子
        return postdb.doc(id).update({
            data:{
                title: title,
                content: content,
                image: image,
                category: category,
                tag: tag
            }
        }).then(res => {
            return {
                code: 200,
                res: res
            }
        })
    })
}