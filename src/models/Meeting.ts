export class Meeting {
    id: string;
    name: string;
    tags: string[]
    datetime: Date;
    photoUrl: string;


    constructor(id: string, name: string, tags: string[], datetime: Date, photoUrl: string) {
        this.id = id;
        this.name = name;
        this.tags = tags;
        this.datetime = datetime;
        this.photoUrl = photoUrl;
    }
}