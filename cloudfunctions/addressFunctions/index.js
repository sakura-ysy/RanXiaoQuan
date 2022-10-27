
// 云函数入口文件
const cloud = require('wx-server-sdk')
const addAddress = require('./addAddress/index')
const deleteAddress = require('./deleteAddress/index')
const editAddress = require('./editAddress/index')
const getAddressList = require('./getAddressList/index')
const getAddressById = require('./getAddressById/index')

cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    switch(event.type){
        case 'addAddress':
            return await addAddress.main(event,context);
        case 'deleteAddress':
            return await deleteAddress.main(event,context);
        case 'editAddress':
            return await editAddress.main(event,context);
        case 'getAddressById':
            return await getAddressById.main(event,context);
        case 'getAddressList':
            return await getAddressList.main(event,context);
    }
}