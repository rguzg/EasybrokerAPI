import dotenv from "dotenv";
dotenv.config();

import EasyBrokerAPI from "./EasyBrokerAPI.js"

if(!process.env.APIKEY){
    throw new Error("API key not provided. Check .env file.");
}

let EasyBroker = new EasyBrokerAPI(process.env.APIKEY);

EasyBroker.getAllProperties().then(properties => {
    properties.forEach(property => {
        console.log(property.title);
    });
});
