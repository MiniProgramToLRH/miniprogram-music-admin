const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const config = require('./config.js')

const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')

const app = new Koa()
const router = new Router()
const ENV = config.env

// 跨域
app.use(cors({
  origin: ['http://localhost:9528'],
  credentials: true
}))

// 解析接收的post参数
app.use(koaBody({
  multipart: true
}))

app.use(async(ctx, next) => {
  ctx.state.env = ENV
  await next()
})

router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())
router.use('/blog', blog.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('服务端启动成功！(端口：3000)')
})
