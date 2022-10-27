const buyGoods = require('./buyGoods/index');
const getOrderListByUser = require('./getOrderListByUser/index');
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    switch(event.type){
        case 'buyGoods':
            return await buyGoods.main(event, context);
        case 'getOrderListByUser':
            return await getOrderListByUser.main(event, context);
    }
}