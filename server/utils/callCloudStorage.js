const rp = require('request-promise')
const fs = require('fs')
const getAccessToken = require('./getAccessToken.js')

const cloudStorage = {
  async download(ctx, fileList) {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
      uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
      method: 'POST',
      body: {
        env: ctx.state.env,
        file_list: fileList
      },
      json: true
    }
    return await rp(options)
      .then((res) => {
        return res
      })
      .catch((err) => {
        console.log('download err', err)
      })
  },

  async upload(ctx) {
    const ACCESS_TOKEN = await getAccessToken()
    const file = ctx.require.file.file
    const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
    const options = {
      uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
      method: 'POST',
      body: {
        path,
        env: ctx.state.env
      },
      json: true
    }
    const info = await rp(options)
      .then((res) => {
        return res
      })
      .catch((err) => {
        console.log('upload info err', err)
      })
    const params = {
      uri: info.url,
      headers: {
        'content-type': 'multipart/form-data'
      },
      method: 'POST',
      formData: {
        key: path,
        Signature: info.authorization,
        'x-cos-security-token': info.token,
        'x-cos-meta-fileid': info.cos_file_id,
        file: fs.createReadStream(file.path)
      },
      json: true
    }
    await rp(params)
    return info.file_id
  },

  async delete(ctx, fileid_list) {
    const ACCESS_TOKEN = await getAccessToken()
    const options = {
      uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
      method: 'POST',
      body: {
        env: ctx.state.env,
        fileid_list: fileid_list
      },
      json: true
    }
    return await rp(options)
      .then((res) => {
        return res
      })
      .catch((err) => {
        console.log('delete err', err)
      })
  }
}

module.exports = cloudStorage
