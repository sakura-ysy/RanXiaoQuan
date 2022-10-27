const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const orderdb = db.collection('goods_order');
/**
 * 获取用户全部订单
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => { 
    const wxContext = cloud.getWXContext();
    var user_openid = event.user_openid
    var order_id = event.order_id
    orderdb.where({
        user_openid: user_openid,
        order_id: order_id
    }).update({
        status: "退订审核中"
    })
};
