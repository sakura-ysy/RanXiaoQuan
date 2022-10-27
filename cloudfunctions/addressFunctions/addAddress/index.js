const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const addressdb = db.collection('address');

/**
 * 新增地址
 * @param {*} event     
 * @param {*} context 
 */
exports.main = async (event, context) => { 
  const wxContext = cloud.getWXContext()
    var addressInfo = event.addressInfo
    var user_openid = event.user_openid
    return await addressdb.add({
        data:{
            user_openid:user_openid,
            address: addressInfo.address,
            province: addressInfo.province,
            city: addressInfo.city,
            district: addressInfo.district,
            mobile: addressInfo.mobile,
            name: addressInfo.name,
            create_time:new Date()
        },
    }).then(res => {
        return {
            "code": 200,
            "res": res
        }
    })
};
