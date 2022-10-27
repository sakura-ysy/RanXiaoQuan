const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const addressdb = db.collection('address');

/**
 * 删除地址
 * @param {*} event     
 * @param {*} context 
 */
exports.main = async (event, context) => { 
    const wxContext = cloud.getWXContext()
    var id = event.id
    var user_openid = event.user_openid
    if (id == undefined){
        return 
    }
    return await addressdb.where({
        _id: id,
        user_openid, user_openid
    }).remove().then(res => {
        return {
            "code": 200,
            "res": res
        }
    })
};
