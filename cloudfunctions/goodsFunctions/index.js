const addGoodsProfile = require('./addGoodsProfile/index');
const deleteGoodsProfile = require('./deleteGoodsProfile/index');
const changeGoodsProfile = require('./changeGoodsProfile/index');
const findGoodsProfile = require('./findGoodsProfile/index');
const getGoodsListByCat = require('./getGoodsListByCat/index');
const searchGoods = require('./searchGoods/index')

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    switch (event.type) {
        case 'addGoodsProfile':
            return await addGoodsProfile.main(event, context);
        case 'deleteGoodsProfile':
            return await deleteGoodsProfile.main(event, context);
        case 'changeGoodsProfile':
            return await changeGoodsProfile.main(event, context);
        case 'findGoodsProfile':
            return await findGoodsProfile.main(event, context);
        case 'getGoodsListByCat':
            return await getGoodsListByCat.main(event, context);
        case 'searchGoods':
            return await searchGoods.main(event, context);
    }
}