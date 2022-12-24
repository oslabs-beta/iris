const { param } = require('express-validator')
const { BASE_PATH } = require('config')

const router = require('express').Router()

router.get('/health', (req, res) => {
  res.sendStatus(200)
})

