
const getOpenid = require('./getOpenid/index');
const isSeller = require('./isSeller/index');
const sellerRequest = require('./sellerRequest/index');
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    switch (event.type) {
        case 'getOpenid':
            return await getOpenid.main(event, context);
        case 'isSeller':
            return await isSeller.main(event, context);
        case 'sellerRequest':
            return await sellerRequest.main(event, context);
    }
}