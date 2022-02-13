const axiosObj = require('./axios');

let fetchAvailableWishmaster = async (req)=>{
    axiosObj.setConfig({app:'main',token:""});
    return await axiosObj.getRequest('/auth/getAvailableWishmasters'); 
}

let fetchOneWishmaster = async (req)=>{
    axiosObj.setConfig({app:'main',token:""});
    let res = await axiosObj.getRequest('/auth/getAvailableWishmasters?result=1');
    return res.data;
}

let bookDeliveryPartner = async(req)=>{
    axiosObj.setConfig({app:'main',token:""});
    try{
        let res = await axiosObj.postRequest('/auth/bookDeliveryPartner',req);
        return res.data;
    }catch(err){
        return err.response;
        //return err;
    }
    
}

let updateOrder = async (data)=>{
    axiosObj.setConfig({app:'order',token:""});
    return await axiosObj.postRequest('order/assign-delivery-partner',data);
    
} 

let updateDeliveryPartner = async (data)=>{
    axiosObj.setConfig({app:'main',token:""});
    return await axiosObj.putRequest('/auth/deliveryPartner',data);
}

let updateDeliveryTag = async (data)=>{
    /**
     * Delivery partners are already asssigned for these orders, 
     * only updating the delivery tags
    */
     axiosObj.setConfig({app:'order',token:""});
     return await axiosObj.putRequest('/order/deliveryTag',data);
    
}

let assignToDeliveryPartner = async (req)=>{
    /**
     * ree.payload:{
     *      orderId:"3"
     * }
     */
    console.log("assignto partner called",req);
    let updateOrderParam = {
        ...req.payload,
        ...{tokenCheck:false},
        ...{deliveryTag:req.deliveryTag}
    }
  

    
    
    let deliveryPartner = await bookDeliveryPartner(updateOrderParam);

    /**
     * send nack when no delivery parnet is found
     */
    if(deliveryPartner.status == 404){
        //when no delivery partner is found when means, this should not happen in the first place.
        //channel was closed or server has been restarted it seems, so start auto pilot protocol
        updateOrderParam = {...updateOrderParam,...{tokenCheck:false}}
        let updateRes = await updateDeliveryTag(updateOrderParam);
        
        return updateRes.data;

    }
  

    /**
     * after delivery partner is booked, update the order status as book
    */
     updateOrderParam = {
        ...updateOrderParam,
        ...deliveryPartner.data,
        ...{wishmasterId:deliveryPartner.data.id}
    }
    //console.log("updateOrderParam",updateOrderParam);
    let updateRes = await updateOrder(updateOrderParam);
    
    
    //let partnerUpdateRes = await updateDeliveryPartner(updateDeliveryParam);
    //console.log("partner response is",deliveryPartner);
    //console.log("update response is",updateRes.data);
    return {id:updateOrderParam.id,orderId:updateOrderParam.orderId};
}

module.exports = {
    assignToDeliveryPartner,

}