const OrderModel = require("../models/Order");
const Product = require('../models/Medicine')
const SSLCommerzPayment = require('sslcommerz-lts');
const { ObjectId } = require('mongodb');
const tran_id = new ObjectId().toString();
// Create new Order
exports.newOrder = async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;
    const data = {
        total_amount: req.body.totalPrice,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `https://api-hospital-backend.onrender.com/api/order/payment/success/${tran_id}`,
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'name',
        cus_email: 'email',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: 'phone',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, false);
    sslcz.init(data).then(apiResponse => {
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send({ url: GatewayPageURL });
    });
    const order = await OrderModel.create({
        shippingInfo,
        orderItems,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        user: req.user._id,
        trans_id:tran_id,
    });
    order.orderItems.forEach(async (o) => {
        await updateStock(o._id, o.cartQuantity);
    });

};
async function updateStock(id, qnty) {
    const product = await Product.findById(id);
    product.quantity -= qnty;
    await product.save({ validateBeforeSave: false });
}
exports.orderPaymentSuccessful=async(req,res,next)=>{
    const order=await OrderModel.updateOne({trans_id:req.params.tranId},{
      $set:{
        paidStatus:true
      }
    });
    if(order.modifiedCount>0){
    //   res.redirect(`https://diu-health-bridge.netlify.app/order/payment/successfull/${req.params.tranId}`);
      res.redirect(`http://localhost:3000/order/payment/successfull/${req.params.tranId}`);

    }
}
  // get logged in user  Orders je login ache 
  exports.myOrders = async (req, res, next) => {
    const orders = await OrderModel.find({ user: req.user._id });
  
    res.status(200).json({
      success: true,
      orders,
    });
  };
  // get all Orders -- Admin
exports.getAllOrders = async (req, res, next) => {
    const orders = await OrderModel.find();
    let totalAmount = 0;
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  };