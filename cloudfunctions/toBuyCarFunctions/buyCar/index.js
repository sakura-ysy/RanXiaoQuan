const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const goodsorderdb = db.collection('goods_order'); //订单数据库
const goodsdb = db.collection('goods'); //商品数据库
const cardb = db.collection('tobuy_car');
/**
 * 结算购物车内的所有商品(发布消息)
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    var user_openid = event.user_openid
    // 通过user_openid将购物车一键结算
    var carinfo = await cardb.where({
            user_openid: user_openid
        })
        .get().then(res => {
            return res
        })

    if (carinfo.data.length == 0)
        return {
            "code": -1,
            "msg": "购物车为空"
        };

    //清空该用户的购物车
    await cardb.where({
        user_openid: user_openid
    }).remove();

    //订单
    for (var i = 0; i < carinfo.data.length; ++i) {
        //首先查找存量
        var gid = carinfo.data[i].good_id;
        var uid = carinfo.data[i].user_openid;
        var goods_info = await goodsdb.where({
            _id: gid
        }).get().then(res => {
            return res;
        })
        if (goods_info.data.length == 0) continue;
        //if(flag == 0)continue;
        //if(goods_info.result.data.lenth == 0)continue;
        if (goods_info.data[0].res_num < carinfo.data[i].num)
            return {
                "code":-1,
                "msg": "商品："+ gid + "缺货"
            };
        var new_res = goods_info.data[0].res_num - 1;
        var new_sold = goods_info.data[0].sold_num + 1;
        //修改商品存量
        await goodsdb.where({
            _id: gid
        }).update({
            data: {
                res_num: new_res,
                sold_num: new_sold
            }
        }).then(res => {
            return res;
        })
        //增加订单信息
        await goodsorderdb.add({
            // data 字段表示需新增的 JSON 数据
            data: {
                user_openid: uid,
                goods_id: gid,
                status: "已联系卖家",
                create_time: new Date(),
            },
            success: function (res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                return res;
            }
        })
    }
    return {
        "code": 200
    }
};