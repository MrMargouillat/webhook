// // A simple hello world microservice 
// // Service will respond to HTTP requests with a string
// module['exports'] = function helloWorld (hook) {
// //   // hook.req is a Node.js http.IncomingMessage
// //   var host = hook.req.host;
// //   // hook.res is a Node.js httpServer.ServerResponse
// //   // Respond to the request with a simple string
// //   hook.res.json(hook.params);
//     response = "This is a sample response from your webhook!" //Default response from the webhook to show it's working


//     hook.res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
//     hook.res.json({ "speech": response, "displayText": response 
//     //"speech" is the spoken version of the response, "displayText" is the visual version
//   });

// };


// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
const http = require('http');
const host = 'api.worldweatheronline.com';
const wwoApiKey = '440a0a4c421143dc962202554180203';
exports.weatherWebhook = (hook) => {
  // Get the city and date from the request
  let city = hook.req.body.result.parameters['geo-city']; // city is a required param
  // Get the date for the weather forecast (if present)
  let date = '';
  if (hook.req.body.result.parameters['date']) {
    date = hook.req.body.result.parameters['date'];
    console.log('Date: ' + date);
  }
  // Call the weather API
  callWeatherApi(city, date).then((output) => {
    // Return the results of the weather API to Dialogflow
    hook.res.setHeader('Content-Type', 'application/json');
    hook.res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
  }).catch((error) => {
    // If there is an error let the user know
    hook.res.setHeader('Content-Type', 'application/json');
    hook.res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
  });
};
function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
    console.log('API Request: ' + host + path);
    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];
        // Create response
        let output = `Current conditions in the ${location['type']} 
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
        ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
        ${forecast['date']}.`;
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}