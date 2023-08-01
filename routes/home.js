const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('index.hbs', {
        title: 'Home',
        isHome: true
    })
})

module.exports = router


