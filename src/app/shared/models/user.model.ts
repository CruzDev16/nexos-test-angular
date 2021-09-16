import { Position } from "./position.model";

export class User {

    constructor( public id: number,
                public name?: string,
                public age?: string,
                public position?: Position,
                public dateOfAdmission?: Date ) { }

}