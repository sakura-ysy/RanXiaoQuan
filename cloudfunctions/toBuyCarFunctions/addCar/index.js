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
    var is_diy = event.is_diy
    var diy_image = event.diy_image
    if(is_diy){
        // diy 专属购物车
        return cardb.add({
            data: {
                user_openid: user_openid,
                is_diy: true,
                diy_image: diy_image
            },
            success: function(res) {
                console.log(res)
                return {
                    "code": 200,
                    "res": res
                }
            }
            })
    }
      // 通过user_openid和good_id查找当前产品是否已经在购物车里了
      await cardb.where({
          good_id: good_id,
          user_openid: user_openid
      })
      .get().then(res => {
          // 不存在则插入
          if (res.data.length == 0){
              cardb.add({
                  data: {
                      user_openid: user_openid,
                      good_id: good_id,
                  },
                  success: function(res) {
                      console.log(res)
                      return {
                          "code": 200,
                          "res": res
                      }
                  }
                  })
          }
          // 存在则拒绝插入
          else{
              return {
                  "code": -1,
                  "msg": "已加入购物车，不允许重复加入"
              }
          }
      })
      return {"code": 200}
  };
  