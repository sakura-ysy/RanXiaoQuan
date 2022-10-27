const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const goodsdb = db.collection('goods');
const selledsdb = db.collection('sellers');
/**
 * 将商品信息插入到goods表中
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => { 
    const wxContext = cloud.getWXContext();
    var goodInfo = event.goodInfo;
    var seller_openid = event.user_openid;
    //var userid = event.userid;
    console.log('test');
    // 首先判断发布者是否为商家
    var isSeller = await selledsdb.where({
        openid: seller_openid
    }).get().then(res => {
        if(res.data.length == 0){
            return false;
        } else {
            return true;
        }
    })
    console.log(isSeller)
    if (!isSeller){
        return {
            "code": -1,
            "msg": "非卖家"
        }
    }
    return await goodsdb.add({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          name: goodInfo.name,
          price: goodInfo.price,
          image: goodInfo.image,
          describe: goodInfo.describe,
          category:goodInfo.category,
          tag: goodInfo.tag,
          note: goodInfo.note,
          detail: goodInfo.detail,
          sold_num:0,
          res_num: goodInfo.res_num,
          seller_openid: seller_openid,
          create_time: new Date(),
          modify_time: new Date()
        },
        success: function(res) {
          return {
              "code": 200,
              "res": res
          };
        }
      })
   
};
