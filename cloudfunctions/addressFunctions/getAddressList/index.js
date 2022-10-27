const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const addressdb = db.collection('address');

/**
 * 获取用户地址列表
 * @param {*} event     
 * @param {*} context 
 */
exports.main = async (event, context) => { 
  const wxContext = cloud.getWXContext()
    var user_openid = event.user_openid
    return await addressdb.where({
        user_openid: user_openid
    }).get().then(res => {
        return {
            "code": 200,
            "res": res
        }
    })
};
