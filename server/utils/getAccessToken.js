const rp = require('request-promise')
const fs = require('fs')
const path = require('path')
const config = require('../config.js')

const APPID = config.appid
const APPSECRET = config.secret
// access_token 请求地址
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const fileName = path.resolve(__dirname, './access_token.json')

// access_token：小程序全局唯一后台接口调用凭据。

// 更新 access_token
const updateAccessToken = async() => {
  const resStr = await rp(URL)
  const res = JSON.parse(resStr)
  // 写文件
  if (res.access_token) {
    fs.writeFileSync(fileName, JSON.stringify({
      access_token: res.access_token,
      createTime: new Date()
    }))
  } else {
    await updateAccessToken()
  }
}

// 获取 access_token
const getAccessToken = async() => {
  // 读取文件
  try {
    const readRes = fs.readFileSync(fileName, 'utf8')
    const readObj = JSON.parse(readRes)
    const createTime = new Date(readObj.createTime).getTime()
    const nowTime = new Date().getTime()
    if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
      await updateAccessToken()
      await getAccessToken()
    }
    return readObj.access_token
  } catch (err) {
    await updateAccessToken()
    await getAccessToken()
  }
}

// access_token 的有效期目前为 2 个小时，需定时刷新
// access_token 的有效期通过返回的 expire_in 来传达，目前是7200秒之内的值，中控服务器需要根据这个有效时间提前去刷新。
// 提前五分钟(5 * 60)更新 access_token
setInterval(async() => {
  await updateAccessToken()
}, ((2 * 60 * 60) - (5 * 60)) * 1000)

module.exports = getAccessToken
