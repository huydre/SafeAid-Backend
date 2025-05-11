const express = require('express');
const router  = express.Router({ mergeParams:true });
const auth    = require('../middlewares/auth');
const ctrl    = require('../controllers/newsCommentController');

router.post(   '/', auth, ctrl.createComment);
router.put(    '/:comment_id', auth, ctrl.updateComment);
router.delete( '/:comment_id', auth, ctrl.deleteComment);

module.exports = router;
