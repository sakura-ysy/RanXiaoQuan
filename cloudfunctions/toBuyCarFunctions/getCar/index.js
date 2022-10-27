const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const goodsorderdb = db.collection('goods_order');//订单数据库
const goodsdb = db.collection('goods');//商品数据库
const cardb = db.collection('tobuy_car');
/**
 * 根据输入的商品ID，用户openid
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => { 
    const wxContext = cloud.getWXContext()
    var user_openid = event.user_openid
    return await cardb.aggregate().match({
        user_openid: user_openid
    }).lookup({
        from:"goods",
        localField: 'good_id',
        foreignField: '_id',
        as: 'good',
    }).end().then(res => {
        return {
            "code": 200,
            "res": res
        }
    })
  };
  