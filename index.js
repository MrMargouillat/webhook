// A simple hello world microservice 
// Service will respond to HTTP requests with a string
module['exports'] = function helloWorld (hook) {
//   // hook.req is a Node.js http.IncomingMessage
//   var host = hook.req.host;
//   // hook.res is a Node.js httpServer.ServerResponse
//   // Respond to the request with a simple string
//   hook.res.json(hook.params);
    response = "This is a sample response from your webhook!" //Default response from the webhook to show it's working


    hook.res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
    hook.res.send(JSON.stringify({ "speech": response, "displayText": response 
    //"speech" is the spoken version of the response, "displayText" is the visual version
  }));

};