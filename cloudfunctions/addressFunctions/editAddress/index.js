const cloud = require('wx-server-sdk');
cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

const db = cloud.database();
const addressdb = db.collection('address');

/**
 * 编辑地址
 * @param {*} event     
 * @param {*} context 
 */
exports.main = async (event, context) => { 
    const wxContext = cloud.getWXContext()
    var id = event.id
    var addressInfo = event.addressInfo
    var user_openid = event.user_openid
    if(id == undefined){
        return
    }
    return await addressdb.where({
        _id: id,
        user_openid, user_openid
    }).update({
        data:{
            province: addressInfo.province,
            city: addressInfo.city,
            district: addressInfo.district,
            address: addressInfo.address,
            mobile: addressInfo.mobile,
            name: addressInfo.name,
        },
        success: res => {
            return {
                "code": 200,
                "res": res
            }
        }
    })
};
