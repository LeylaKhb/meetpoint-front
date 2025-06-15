import {Meeting} from "./Meeting";

export class Person {
    email: string;
    password: string;
    birthdate?: Date;
    name?: string;
    surname?: string;
    photoUrl? : string;
    rating?: number;
    leftMeetings?: Meeting[];
    nextMeetings?: Meeting[];

    constructor(email: string, password: string, birthdate?: Date, name?: string, surname?: string,
                photoUrl? : string, rating?: number, leftMeetings?: Meeting[], nextMeetings?: Meeting[],) {
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.name = name;
        this.surname = surname;
        this.photoUrl = photoUrl;
        this.rating = rating;
        this.leftMeetings = leftMeetings;
        this.nextMeetings = nextMeetings;
    }

    static createMockPerson(): Person {
        return new Person(
            "email@gmail.com",
            "Kotenok",
            new Date(),
            "Имя",
            "Фамилия",
            "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800",
            5.0,
            [new Meeting(
                '2',
                'Забег на 5 км',
                ['sport'],
                new Date(),
                'https://img.freepik.com/free-photo/healthy-lifestyle-running-outdoors_23-2151847285.jpg?semt=ais_items_boosted&w=740'
            )],
            [new Meeting(
                '3',
                'Кулинарный мастер-класс',
                ['food', 'education'],
                new Date(),
                'https://more-radosti.ru/wp-content/uploads/2019/07/more-radosti.ru_2019-07-25_09-05-31.jpg'
            )]
        );
    }
}
