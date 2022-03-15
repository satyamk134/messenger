const rabbit = require('./config/connect');
const service = require('./services/common-service');
let channel;
async function connectToRabbit() {
    channel = await rabbit.connectToMq();
    console.log("Now coonection to rabbitmq is succefull");
    consumeInit();
    const  [tag1,tag2] = [await createConsumers('order_queue'),await createConsumers('order_queue'),
    await createConsumers('order_queue'),await createConsumers('order_queue'),await createConsumers('order_queue'),await createConsumers('order_queue')];
     console.log("tag 1 is",tag1);
     console.log("tag 2 is",tag2);
}
connectToRabbit();

const sendToQueue = async (req, res) => {
    try {
        var queue = 'order_queue'
        console.log("quue",req.body.queueName)
        const payload = req.body.payload;
        var msg = JSON.stringify({ payload: payload, time: Date.now() });
        channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);

        res.json({ "msg": "Data sent in queue" });
    } catch (err) {
        console.log("Error is", err);
    }
}
let acker = {};

const consumeInit = () => {
    var queue = 'order_queue';
    channel.assertQueue(queue, {
        durable: false
    });
    channel.prefetch(1);
    console.log("receiver connected");
}

let cosumeFunc = async (msg, name) => {
    console.log("[x] Received msg is", msg.fields.deliveryTag);
    let order = msg.content.toString();
    let orderObj = JSON.parse(order);
    let oderWithDeliveryTag = {
        ...orderObj,
        ...{deliveryTag:msg.fields.deliveryTag}
    }
    try{
        let resAfterAssign = await service.assignToDeliveryPartner(oderWithDeliveryTag);
        if(resAfterAssign.updated == 1){
            console.log("Delivery tag updated details are",resAfterAssign);

            //nack the message and send back to queue
        }else if(resAfterAssign.updated == 0){
                console.log("came inside else if ");
                channel.nack(msg);
        }
        //channel.ack(msg);
        console.log("order assigned",resAfterAssign)
    }
    catch(err){
        console.log("error is",err);
    }
    

    
}


const createConsumers = async (queue)=>{
    let tag = await channel.consume(queue, cosumeFunc, { noAck: false });
    return tag;
}
const consumeFromQueue = async (req, res) => {
    try {
        console.log("recevier called", req.body.queueName);
        res.json({ msg: "Cosnumers called "});
    } catch (err) {
        console.log("Error in receving", err);
    }
}

const getConsumers = async (req, res) => {
    let masters = await service.fetchAvailableWishmaster();
    res.json(masters.data);
}

let delay = () => {
    console.log("came for delay");
    const delay1 = ms => new Promise(resolve => setTimeout(resolve, ms))
    return delay1(5000) /// waiting 1 second.
}



let createOrder = async (res) => {
    req = {
        body: {
            queueName: "order_queue",
            payload: { "orderId": 0 }
        }
    }
    for (i = 0; i < 20; i++) {
        req.body.payload.orderId = i + 1;
        await sendToQueue(req, res);
    }
    throw new Error("error occured")
    //r//es.json("All messages are sent");
}

let ack = (req, res)=>{
    let id  = req.body.deliveryTag //delivery person id
    let obj = {
        fields: {
            deliveryTag:id
        }
    }
    console.log("obj",obj);
    try{
        channel.ack(obj);
    }catch(error){
        console.log("Error in ack of msg",error);
    }
    
    res.json({ msg: "ack done" });
}

let ackMsg = (req, res) => {
    let id  = req.body.id //delivery person id
    let obj = {
        a: {
            fields: {
                deliveryTag: acker[id]['fields']['deliveryTag']
            }
        }
    }
    try{
        channel.ack(obj.a);
    }catch(error){
        console.log("Error in ack of msg",error);

    }
    
    res.json({ msg: "ack done" });
}



module.exports = {
    sendToQueue,
    consumeFromQueue,
    getConsumers,
    createOrder,
    consumeInit,
    ackMsg,
    ack

}


