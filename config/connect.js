const  amqp = require('amqplib');

module.exports.connectToMq = async ()=>{
    try{
      let address = process.env.MQ_URL
      let user = process.env.MQ_USER;
      let password = process.env.MQ_PASSWORD
      let connection = await amqp.connect('amqp://'+user+':'+password+'@'+address);
      let channel = await connection.createChannel();
      channel.on( 'error', function(err) {
        //do something
        console.log('An error event occurred' + err);
      });
      return channel
      
    }catch(err){
      console.log("error is",err);
    }
    
    
    
}
