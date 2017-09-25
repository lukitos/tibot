module.exports = {
  "pizza.order": (params, fulfillment) => {
    // console.log('pizza.order params >>> ', params);
    // console.log('pizza fulfillment >>> ', fulfillment);
    return fulfillment.speech;
  },
  "pizza.topping": (params, fulfillment) => {
    console.log('pizza.topping selected >>> ', params.pizza_topping);
    console.log('pizza fulfillment >>> ', fulfillment);
    return fulfillment.speech;
  }
};
