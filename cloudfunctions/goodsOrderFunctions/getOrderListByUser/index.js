const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const goodsdb = db.collection('goods');
const selledsdb = db.collection('sellers');
const orderdb = db.collection('goods_order');
/**
 * 获取用户全部订单
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => { 
    const wxContext = cloud.getWXContext();
    var user_openid = event.user_openid
    var orders =  await orderdb.aggregate().match({
        user_openid: user_openid
    }).lookup({
        from: 'goods',
        localField: 'goods_id',
        foreignField: '_id',
        as: 'goods',
    }).end().then(res => {
        return res.list
    })
    console.log(orders)
    // 获取卖家信息
    for(var i=0; i<orders.length; i++){
        if(orders[i].is_diy){
            continue
        }
        var goods = orders[i].goods[0]
        console.log(goods)
        await selledsdb.where({
            openid: goods.seller_openid
        }).get().then(res => {
            orders[i].goods[0]['seller'] = res.data[0]
            console.log(orders[i].goods[0])
        })
    }
    return {
        "code": 200,
        "res": orders
    }
};
