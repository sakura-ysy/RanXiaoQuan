const addCar = require('./addCar/index');
const deleteCar = require('./deleteCar/index');
const buyCar = require('./buyCar/index');
const getCar = require('./getCar/index');

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    switch(event.type){
        case 'addCar':
            return await addCar.main(event, context);
        case 'deleteCar':
            return await deleteCar.main(event, context);
        case 'buyCar':
            return await buyCar.main(event, context);
        case 'getCar':
            return await getCar.main(event,context);
    }
}