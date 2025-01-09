// TODO: create here a typescript interface for an olympic country
/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/

import { Participation } from "./Participation";

export class Olympic {
    id: string;

    constructor(public country: string) {
        this.id = crypto.randomUUID().substring(0, 8);
    }
    /*constructor(public country: string,
                public participations: Participation[]) {
        this.id = crypto.randomUUID().substring(0, 8);
    }

    countMedals(): number{
        let res: number = 0;
        for(let i=0 ; i<this.participations.length ; i++){
            res += this.participations[i].medalsCount;
        }
        return res;
    }*/
}