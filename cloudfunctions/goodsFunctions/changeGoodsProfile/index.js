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
    //var userid = event.userid;
    console.log('test');
    return await goodsdb.where({
        _id: event.goodsid
    }).update({
        data:{
        name: event.name,
          price: event.price,
          image: event.image,
          describe: event.describe,
          category:event.category,
          tag: event.tag,
          note: event.note,
          detail: event.detail,
          sold_num:event.sold_num,
          res_num: event.res_num,
          create_time: event.create_time,
          modify_time: event.modify_time
        }
    }).then(res => {
        console.log('更新成功',res)//将返回值存到res里
        //console.log(res.data[0]);
        return res;
        //return 123;
    }).catch(err => {
        console.log('更新失败',err)//失败提示错误信息
        return err.data;
    })
};
