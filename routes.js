const express = require('express');
const router = express.Router();
const controller = require('./controllers');

router.route('/send').post(controller.sendToQueue);
router.route('/receive').post(controller.consumeFromQueue);
router.route('/push-order').post(controller.sendToQueue);
router.route('/receive-order').post(controller.consumeFromQueue);
router.route('/getWishmasters').get(controller.getConsumers);
router.route('/createOrder').post(controller.createOrder);
router.route('/ack').post(controller.ack);
router.route('/ackmsg').post(controller.ackMsg);



module.exports = router;