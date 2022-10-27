const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const goodsdb = db.collection('goods');

/**
 * 根据商品的id，查找对应的商品
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => { 
  const wxContext = await cloud.getWXContext();
  var goods_id = event.goods_id
    //var userid = event.userid;
    console.log('test');
    return await goodsdb.aggregate().match({
        _id: goods_id
    }).lookup({
        from: 'sellers',
        localField: 'seller_openid',
        foreignField: 'openid',
        as: 'seller',
    }).end().then(res => {
        console.log(res.list)
        return {
            "code": 200,
            "res": res.list
        }
    }).catch(err => {
        return {
            "code":-1,
            "res": err
        }
    })
};
