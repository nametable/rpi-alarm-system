"use strict";
const {google} = require('googleapis');
let config = require('./config.json');
let sheet_maker=require('./sheet_maker.js');

let privatekey = require("./google-apis-test-04121b34e74e.json");

//from http://isd-soft.com/tech_blog/accessing-google-apis-using-service-account-node-js/
// configure a JWT auth client
let jwtClient = new google.auth.JWT(
       privatekey.client_email,
       null,
       privatekey.private_key,
       ['https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
 if (err) {
   console.log(err);
   return;
 } else {
   console.log("Successfully connected!");
 }
});
var resp=sheet_maker.mk_control_sheet(jwtClient, {sheetId:"11EDYwgZH5qx9sybk0V0RAC9CSkXvzvYhy0HBTZ8IxdA"});
var resp_value;
resp.then(function(response){
  resp_value=response;
});
