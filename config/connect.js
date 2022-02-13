const  amqp = require('amqplib');

module.exports.connectToMq = async ()=>{
    let connection = await amqp.connect('amqp://localhost');
    let channel = await connection.createChannel();
    channel.on( 'error', function(err) {
        //do something
        console.log('An error event occurred' + err);
      });
    return channel
    
}
