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

interface EasyBrokerError{
    error: string
}

type EasyBrokerAPIResponse = PropertyList | EasyBrokerError;

export default class EasyBrokerAPI{
    readonly #baseUrl: string = "https://api.stagingeb.com/v1/";
    #apiKey: string;

    constructor(apiKey: string){
        this.#apiKey = apiKey;

        if(!this.#apiKey){
            throw new Error("No API key provided");
        }
    }

    async getProperties(page: number = 1, limit: number = 20): Promise<EasyBrokerAPIResponse>{
        if(limit > 50){
            throw new Error("Limit cannot be greater than 50");
        }

        const url = `${this.#baseUrl}properties?page=${page}&limit=${limit}`;

        const response = await fetch(url, {
            headers: {
                "X-Authorization": this.#apiKey,
                "aacept": "application/json",
                "content-type": "application/json"
            }
        });

        const json = await response.json() as EasyBrokerAPIResponse;

        return json;
    }
}
