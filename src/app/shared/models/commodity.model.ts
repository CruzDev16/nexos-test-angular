import { User } from "./user.model";

export class Commodity {

    constructor( public id: number,
                public name?: string,
                public product?: string,
                public quantity?: number,
                public dateOfAdmission?: Date,
                public creatorUser?: User ) { }

}