let express = require('express');
let router = express.Router();

router.post('/import', function (req, res, next) {
  res.json({
    code: 0,
    data: {
      msg: 'success'
    }
  })
});

module.exports = router;
