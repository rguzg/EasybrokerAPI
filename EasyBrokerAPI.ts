import fetch from "node-fetch";

interface Pagination{
    limit: number;
    page: number;
    total: number;
    next_page: number;
}

interface Property{
    title: string,
}

interface PropertyList {
    pagination: Pagination,
    content: Property[]
}

export default class EasyBrokerAPI{
    readonly #baseUrl: string = "https://api.stagingeb.com/v1/";
    #apiKey: string;

    constructor(apiKey: string){
        this.#apiKey = apiKey;

        if(!this.#apiKey){
            throw new Error("No API key provided");
        }
    }

    getProperties(page: number = 1, limit: number = 20): Promise<PropertyList>{
        if(limit > 50){
            throw new Error("Limit cannot be greater than 50");
        }

        const url = `${this.#baseUrl}properties?page=${page}&limit=${limit}`;

        return new Promise<PropertyList>(async (resolve, reject) => {
            const response = await fetch(url, {
                headers: {
                    "X-Authorization": this.#apiKey,
                    "aacept": "application/json",
                    "content-type": "application/json"
                }
            });

            
            if(response.ok) {
                const json = await response.json() as PropertyList;

                resolve(json);
            } else {
                const json = await response.json();

                reject(json);
            }
        });
    }
}
