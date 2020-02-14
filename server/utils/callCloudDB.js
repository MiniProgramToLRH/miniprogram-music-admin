const rp = require('request-promise')
const getAccessToken = require('./getAccessToken.js')

// 操作数据库
const callCloudDB = async(ctx, fnName, query = {}) => {
  const ACCESS_TOKEN = await getAccessToken()
  const options = {
    uri: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
    method: 'POST',
    body: {
      query,
      env: ctx.state.env
    },
    json: true
  }
  return await rp(options)
    .then((res) => {
      return res
    })
    .catch((err) => {
      console.log('callCloudDB err', err)
    })
}

module.exports = callCloudDB
