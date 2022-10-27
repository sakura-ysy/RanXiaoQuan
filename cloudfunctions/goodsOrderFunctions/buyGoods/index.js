const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const goodsdb = db.collection('goods');
const selledsdb = db.collection('sellers');
const orderdb = db.collection('goods_order');
/**
 * 发起订单
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    var goods_id = event.goods_id
    var user_openid = event.user_openid
    var address_id = event.address_id
    var is_diy = event.is_diy
    // diy商品加入订单
    if (is_diy) {
        var diy_image = event.diy_image
        return await orderdb.add({
            data: {
                is_diy: true,
                diy_image: diy_image,
                user_openid: user_openid,
                address_id: address_id,
                status: "刚刚提交",
                create_time: new Date()
            }
        }).then(res => {
            return {
                "code": 200,
                "res": res
            }
        })
    }
    // 普通商品
    // 判断该商品是否存在
    var existGoods = await goodsdb.where({
        _id: goods_id
    }).get().then(res => {
        return res.data
    })

    if (existGoods.length == 0) {
        return {
            "code": -1,
            "msg": "商品不存在"
        }
    }

    // 加入订单
    return await orderdb.add({
        data: {
            goods_id: goods_id,
            user_openid: user_openid,
            address_id: address_id,
            status: "刚刚提交",
            create_time: new Date()
        }
    }).then(res => {
        return {
            "code": 200,
            "res": res
        }
    })
};