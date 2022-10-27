const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const goodsdb = db.collection('goods');
const _ = db.command;

/**
 * 按照名称或描述来搜索
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var keywd = '.*' + event.keywd;
    return await goodsdb.aggregate().match(_.or([
        {
            name:{
                $regex: keywd,
                $options: 'i'
            }
        },
        {
            describe:{
                $regex: keywd,
                $options: 'i'
            }
        },
    ])).lookup({
        from: 'sellers',
        localField: 'seller_openid',
        foreignField: 'openid',
        as: 'seller',
    }).end().then(res => {
        return {
            "code": 200,
            "res": res
        }
    }).catch(err => {
        return {
            "code":-1,
            "res": err
        }
    })
}