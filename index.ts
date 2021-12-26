import dotenv from "dotenv";
dotenv.config();

import EasyBrokerAPI from "./EasyBrokerAPI.js";


async function GetAllProperties(){
    if(!process.env.APIKEY){
        throw new Error("API key not provided. Check .env file.");
    }

    let EasyBroker = new EasyBrokerAPI(process.env.APIKEY);
    let hasPrintedAllProperties = false;
    let currentPage = 1;
    
    while(!hasPrintedAllProperties){
        let properties = await EasyBroker.getProperties(currentPage, 50);

        properties.content.forEach(property => {
            console.log(property.title);
        });

        if(properties.pagination.next_page === null){
            hasPrintedAllProperties = true;
        } else {
            currentPage++;

        }
    }
}

GetAllProperties();
