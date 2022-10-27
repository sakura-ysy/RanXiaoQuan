const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const goodsdb = db.collection('goods');

/**
 * 根据商品的id，删除对应的商品
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => { 
  const wxContext = await cloud.getWXContext();
    //var userid = event.userid;
    console.log('test');
    return await goodsdb.where({
        _id: event.goodsid
    }).remove().then(res => {
        console.log('删除成功',res)//将返回值存到res里
        return res;
    }).catch(err => {
        console.log('删除',err)//失败提示错误信息
        return err.data;
    })
};
