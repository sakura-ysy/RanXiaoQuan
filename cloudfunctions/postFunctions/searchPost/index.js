const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const postdb = db.collection('post');
const _ = db.command;

/**
 * 按照标题或内容搜索帖子
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var keywd = '.*' + event.keywd;
    return postdb.where(_.or([
        {
            title:{
                $regex: keywd,
                $options: 'i'
            }
        },
        {
            content:{
                $regex: keywd,
                $options: 'i'
            }
        }
    ])).get().then(res => {
        return {
            code: 200,
            res: res
        }
    })
}