const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const addressdb = db.collection('address');

/**
 * 根据id获取地址
 * @param {*} event     
 * @param {*} context 
 */
exports.main = async (event, context) => { 
  const wxContext = cloud.getWXContext()
    var id = event.id
    return await addressdb.where({
        _id: id
    }).get().then(res => {
        return {
            "code": 200,
            "res": res
        }
    })
};
