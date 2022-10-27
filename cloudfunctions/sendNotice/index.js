
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'cloud1-3gv71ub62b32f113'
});

// 云函数入口函数
exports.main = async (event, context) => {
    var name = event.name
    var buyer_mobile = event.mobile
    var date = new Date()
    var Year =date.getFullYear()
    var Month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    var Day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var Hour = date.getHours();
    var Min = date.getMinutes();
    var time = Year+"年"+Month+"月"+Day+"日"+" "+Hour+":"+Min
    var msg = "您的订单已收到，我们会尽快将其交由手艺人"

    try {
        const result = await cloud.openapi.subscribeMessage.send({
        touser: cloud.getWXContext().OPENID, // 通过 getWXContext 获取 OPENID
        page: 'index',
        data: {
          time1: {
            value: time
          },
          thing2: {
            value: name
          },
          phone_number3: {
            value: buyer_mobile
          },
          thing4: {
            value: msg
          }
        },
        templateId: 'hnbKQDILfQGvqJ4-aXiQswJ82_GKkVeupfqx7YLBicw',
      })
      // result 结构
      // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
      return result
    } catch (err) {
      // 错误处理
      // err.errCode !== 0
      throw err
    }
  }