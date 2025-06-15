export class Meeting {
    id: string;
    name: string;
    tags: string[];
    datetime: string;
    photoUrl: string;
    description: string;
    membersCount: number;
    maxMembers: number;
    location: string;
    rating: number;


    constructor(id: string, name: string, tags: string[], datetime: string, photoUrl: string, description: string, membersCount: number, maxMembers: number, location: string, rating: number) {
        this.id = id;
        this.name = name;
        this.tags = tags;
        this.datetime = datetime;
        this.photoUrl = photoUrl;
        this.description = description;
        this.membersCount = membersCount;
        this.maxMembers = maxMembers;
        this.location = location;
        this.rating = rating;
    }
}