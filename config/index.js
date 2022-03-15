module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return require('dotenv').config({path:'./.env.dev'});
        case 'production':
            return require('dotenv').config({path:'./.env.prod'});
        default:
            return require('dotenv').config({path:'./.env'});
    }
};
