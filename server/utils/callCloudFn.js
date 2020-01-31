const rp = require('request-promise')
const getAccessToken = require('./getAccessToken.js')

// 触发云函数
const callCloudFn = async(ctx, fnName, params) => {
  const ACCESS_TOKEN = await getAccessToken()
  const options = {
    uri: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.env}&name=${fnName}`,
    method: 'POST',
    body: { ...params },
    json: true
  }
  return await rp(options)
    .then((res) => {
      return res
    })
    .catch((err) => {
      console.log('callCouldFn err', err)
    })
}

module.exports = callCloudFn
