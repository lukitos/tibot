const axios = require('axios');

const ROOT_URL = 'http://localhost:8000/api';

module.exports = {

  "appt_action": (params, fulfillment) => {
    console.log('appt_action params >>> ', params);
    console.log('appt_action fulfillment >>> ', fulfillment);
    return fulfillment.speech;
  },

  "detailed_info_action": (params, fulfillment) => {
    console.log('detailed_info_action >>> ', params);
    console.log('detailed_info_action fulfillment >>> ', fulfillment);
    if (params.name !== '' && params.email !== '' && params.phone !== '') {
      let contact = {
        name: params.name,
        email: params.email,
        phone: params.phone
      };
      console.log('contact=', contact);
      axios.post(`${ROOT_URL}/contact`, contact).then(data => {
        console.log('data=', data);
      });
    }
    return fulfillment.speech;
  }

};
