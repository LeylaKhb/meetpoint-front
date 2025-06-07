export class Person {
    email: string;
    password: string;
    birthdate?: Date;
    name?: string;
    surname?: string;

    constructor(email: string, password: string, birthdate?: Date, name?: string, surname?: string) {
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.name = name;
        this.surname = surname;
    }
}
