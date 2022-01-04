/**
 This file includes functions that serialize options type objects into the URL portions that they are representing.

 All of these functions take an options object as an argument and return a string. This functions don't need to worry about adding '&' or '?' to the URL, as that is handled by the calling function.
*/

import type { StatusOptions } from "./EasyBrokerAPI";

export function SerializeStatusOptions(statusOptions: Set<StatusOptions>): string{
    let serializedOptions = "";
    let optionsCount = 1;

    statusOptions.forEach((statusOption) => {
        serializedOptions += `search[statuses][]=${statusOption}`;

        if(optionsCount < statusOptions.size){
            serializedOptions += "&";
            optionsCount++;
        }
    });

    return serializedOptions;
}