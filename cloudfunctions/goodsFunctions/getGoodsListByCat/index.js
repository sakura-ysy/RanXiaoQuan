const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const goodsdb = db.collection('goods');
const sellersdb = db.collection('sellers');
/**
 * 得到对应类别的商品列表
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = await cloud.getWXContext();
    var category = event.category
    return await goodsdb.aggregate().match({
        category: category
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