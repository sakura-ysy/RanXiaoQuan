const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const postdb = db.collection('post');
const _ = db.command

/**
 * 查看某一帖子详情，传入帖子id
 * @param {*} event 
 * @param {*} context
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var id = event.id
    return postdb.doc(id).get().then(res => {
        if(res.data.length != 0){
            postdb.doc(id).update({
                data:{
                    view: _.inc(1)
                }
            })
            return {
                code: 200,
                res: res
            }
        }else{
            return {
                code: -1,
                msg: "帖子不存在"
            }
        }

    })
}