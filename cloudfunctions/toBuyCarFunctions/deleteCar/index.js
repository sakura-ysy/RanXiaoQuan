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
    var good_id = event.good_id
    if(good_id == undefined){
        return
    }
      // 通过user_id和goods_id查找当前产品是否已经在购物车里了
      return await cardb.where({
          good_id: good_id,
          user_openid: user_openid
      })
      .get().then(res => {
          // 不存在则不做处理
          if (res.data.length == 0){
                return {
                    "code": -1,
                    "msg": "记录不存在"
                };
          }
          // 存在则删除
          else{
            cardb.where({
                good_id: good_id,
                user_openid: user_openid
                }).remove().then(res => {
                    return {
                        "code": 200,
                        "res": res
                    };
                });
          }
      })
  };
  