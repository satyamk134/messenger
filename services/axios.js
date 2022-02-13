const axios = require('axios');
const setup = {
    cart:{
        URL:process.env.CART_APP_URL
    },
    main:{
        URL:process.env.MAIN_APP_URL

    },
    order:{
        URL:process.env.ORDER_APP_URL
    }
}
const axiosObj = axios.create({
    baseURL: 'https://api.example.com'
});

const setBearerToken = (token) => {
    let headers = { Authorization:token };
    axiosObj.defaults.headers = headers
}

const getRequest = (url,params={})=>{
    return axiosObj.get(url,params);
}
const postRequest = (url,data)=>{
    return axiosObj.post(url,data);
}

const putRequest = (url,data)=>{
    return axiosObj.put(url,data);
}

const setConfig = ({app,token})=>{
    console.log("token is",token);
    setBearerToken(token);
    axiosObj.defaults.baseURL = setup[app]['URL'];
}

module.exports =   {
    setBearerToken,
    getRequest,
    postRequest,
    putRequest,
    setConfig
}


