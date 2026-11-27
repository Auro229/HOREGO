const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/tripsController');

router.get('/', c.list);
router.get('/stats', c.stats);
router.get('/mine', auth, c.mine);   // avant /:id
router.get('/:id', c.one);
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;