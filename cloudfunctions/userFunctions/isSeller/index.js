const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database({
    env:'cloud1-3gv71ub62b32f113'
});
const sellerdb = db.collection('sellers');

/**
 * 判断是否为卖家
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => { 
  const wxContext = cloud.getWXContext();
    var openid = event.user_openid;
    return await sellerdb.where({
        openid : openid
    }).get().then(res => {
        var data = res.data
        if(data.length == 0){
            return {
                "code": 200,
                "res": false
            }
        } else {
            return {
                "code": 200,
                "res": true
            }
        }
    })
};
