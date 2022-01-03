import fetch from "node-fetch";

export interface Pagination{
    limit: number;
    page: number;
    total: number;
    next_page: number;
}

export interface Property{
    public_id: string,
    title: string,
    title_image_full: string,
    title_image_thumb: string,
    property_type: string,
    location: string,
}

export interface PropertyList {
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

    getPropertyList(page: number = 1, limit: number = 20): Promise<PropertyList>{
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

    
    async getAllProperties(): Promise<Array<Property>>{
        let hasAllProperties = false;
        let properties: Array<Property> = [];
        let currentPage = 1;
        
        while(!hasAllProperties){
            let response = await this.getPropertyList(currentPage, 50);

            properties = [...properties, ...response.content];

            if(response.pagination.next_page === null){
                hasAllProperties = true;
            } else {
                currentPage++;

            }
        }

        return properties;
    }
}
