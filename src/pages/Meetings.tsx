import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import '../styles/meetings.css';

type Meeting = {
    id: string;
    name: string;
    tags: string[];
    datetime: string;
    photoUrl: string;
};

const ITEMS_PER_PAGE = 9;

const allTags = [
    { value: 'music', label: 'Музыка' },
    { value: 'sport', label: 'Спорт' },
    { value: 'culture', label: 'Культура' },
    { value: 'food', label: 'Еда' },
    { value: 'education', label: 'Образование' }
];

const Meetings: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [selectedTags, setSelectedTags] = useState<{ value: string; label: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchMeetings = async (tags: string[] = []) => {
        try {
            const query = tags.length > 0 ? `?tags=${tags.join(',')}` : '';

            // const res = await fetch(`/api/meetings${query}`);
            // const data = await res.json();

            // === MOCK DATA START ===
            const mockData = getMockMeetings();

            // фильтрация по тегам
            const filteredData = tags.length
                ? mockData.filter(meeting =>
                    tags.every(tag => meeting.tags.includes(tag))
                )
                : mockData;

            const data = { meetings: filteredData };
            // === MOCK DATA END ===

            setMeetings(data.meetings || []);
            setCurrentPage(1);
        } catch (error) {
            console.error('Ошибка при загрузке мероприятий:', error);
        }
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    useEffect(() => {
        const tagValues = selectedTags.map((tag) => tag.value);
        fetchMeetings(tagValues);
    }, [selectedTags]);

    const totalPages = Math.ceil(meetings.length / ITEMS_PER_PAGE);
    const currentMeetings = meetings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="meetings-container">
            <h1 className="meetings-title">Мероприятия</h1>

            <div className="filters">
                <label className="filters-title">Фильтр по тегам:</label>
                <Select
                    isMulti
                    options={allTags}
                    value={selectedTags}
                    onChange={(options) => setSelectedTags(options as any)}
                    placeholder="Выберите теги..."
                />
            </div>

            <div className="meetings-grid">
                {currentMeetings.map((meeting) => {
                    const dateObj = new Date(meeting.datetime);
                    const dateStr = dateObj.toLocaleDateString();
                    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div key={meeting.id} className="meeting-card" style={{ backgroundImage: `url(${meeting.photoUrl})` }}>
                            <div className="meeting-overlay">
                                <div className="meeting-summary">
                                    <h2 className="meeting-title">{meeting.name}</h2>
                                    <span className="meeting-date">{dateStr} в {timeStr}</span>
                                </div>
                                <div className="meeting-details">
                                    <div className="meeting-tags">
                                        {meeting.tags.map((tag, idx) => (
                                            <span key={idx} className="meeting-tag">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Назад
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Вперёд
                    </button>
                </div>
            )}
        </div>
    );
};

const getMockMeetings = (): Meeting[] => [
    {
        id: '1',
        name: 'Концерт на крыше',
        tags: ['music'],
        datetime: '2025-06-20T19:00:00',
        photoUrl: 'https://cdn5.vedomosti.ru/image/2022/4l/nebxz/original-ubn.jpg'
    },
    {
        id: '2',
        name: 'Забег на 5 км',
        tags: ['sport'],
        datetime: '2025-06-18T08:30:00',
        photoUrl: 'https://img.freepik.com/free-photo/healthy-lifestyle-running-outdoors_23-2151847285.jpg?semt=ais_items_boosted&w=740'
    },
    {
        id: '3',
        name: 'Кулинарный мастер-класс',
        tags: ['food', 'education'],
        datetime: '2025-06-22T17:00:00',
        photoUrl: 'https://more-radosti.ru/wp-content/uploads/2019/07/more-radosti.ru_2019-07-25_09-05-31.jpg'
    },
    {
        id: '4',
        name: 'Выставка современного искусства',
        tags: ['culture'],
        datetime: '2025-06-25T15:00:00',
        photoUrl: 'https://media.1777.ru/images/images_processing/561/5617585774441534.jpeg'
    },
    {
        id: '5',
        name: 'Фестиваль уличной еды',
        tags: ['food'],
        datetime: '2025-06-30T12:00:00',
        photoUrl: 'https://www.gloss.ee/wp-content/uploads/2025/05/q-34.jpg'
    },
    {
        id: '6',
        name: 'Открытая лекция по истории',
        tags: ['education', 'culture'],
        datetime: '2025-06-27T14:00:00',
        photoUrl: 'https://static.tildacdn.com/tild3338-6263-4635-a533-616564386639/shutterstock_2028608.jpg'
    },
    {
        id: '7',
        name: 'Йога на свежем воздухе',
        tags: ['sport'],
        datetime: '2025-06-19T07:00:00',
        photoUrl: 'https://образжизни.москва/wp-content/uploads/2018/06/34199518_2130098540557810_8485605807700836352_o.jpg'
    },
    {
        id: '8',
        name: 'Концерт классической музыки',
        tags: ['music', 'culture'],
        datetime: '2025-06-21T20:00:00',
        photoUrl: 'https://www.deims.ru/etiquette/assets/images/6855563518950675386574c8625f-2-1150x766.jpg'
    },
    {
        id: '9',
        name: 'Фестиваль народного творчества',
        tags: ['culture', 'music'],
        datetime: '2025-06-23T10:00:00',
        photoUrl: 'https://img.freepik.com/premium-photo/friends-enjoying-music-festival-stage_1280275-147181.jpg?semt=ais_hybrid&w=740'
    },
    {
        id: '10',
        name: 'Бег с препятствиями',
        tags: ['sport'],
        datetime: '2025-06-29T09:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxvYnN0YWNsZXxlbnwwfHx8fDE2NTcyNjQ3NjQ&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '11',
        name: 'Мастер-класс по живописи',
        tags: ['art', 'education'],
        datetime: '2025-07-01T16:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxwYWludGluZ3xlbnwwfHx8fDE2NTcyNjQ3NjQ&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '12',
        name: 'Фестиваль музыки и искусств',
        tags: ['music', 'culture'],
        datetime: '2025-07-05T18:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxmdW5rJTIwZm9vZCUyMGZpbGxlfGVufDB8fHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '13',
        name: 'Кулинарный фестиваль',
        tags: ['food', 'culture'],
        datetime: '2025-07-10T12:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxjdWxpbmFyeSUyMGZpbGxlfGVufDB8fHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '14',
        name: 'Спортивные соревнования по плаванию',
        tags: ['sport'],
        datetime: '2025-07-15T09:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxwbGF2aW5nfGVufDB8fHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '15',
        name: 'Выставка фотографий',
        tags: ['culture', 'art'],
        datetime: '2025-07-20T17:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxwaG90b3N8ZW58MHx8fHwxNjU3MjY0NzY0&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '16',
        name: 'Фестиваль уличного искусства',
        tags: ['art', 'culture'],
        datetime: '2025-07-25T14:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHx1bHRyaW5lJTIwYXJ0fGVufDB8fHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '17',
        name: 'Курс по фотографии',
        tags: ['education', 'art'],
        datetime: '2025-08-01T10:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxwaG90b3JhcHklMjBjb3Vyc3xlbnwwfHx8fDE2NTcyNjQ3NjQ&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '18',
        name: 'Спортивный фестиваль',
        tags: ['sport', 'culture'],
        datetime: '2025-08-05T15:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxyZW5vdmF0aW9ufGVufDB8fHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '19',
        name: 'Кулинарный фестиваль местной кухни',
        tags: ['food', 'culture'],
        datetime: '2025-08-10T12:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxtZWRpdGVyJTIwY3VpbmUlMjBmb29kfGVufDB8fHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '20',
        name: 'Выставка старинных автомобилей',
        tags: ['culture', 'sport'],
        datetime: '2025-08-15T10:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxhY3Rpb258ZW58MHx8fHwxNjU3MjY0NzY0&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '21',
        name: 'Фестиваль поэзии',
        tags: ['culture', 'education'],
        datetime: '2025-08-20T18:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxyZW5vdmF0aW9ufGVufDB8fHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '23',
        name: 'Курс по кулинарии для начинающих',
        tags: ['food', 'education'],
        datetime: '2025-09-01T17:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '24',
        name: 'Выставка современного дизайна',
        tags: ['culture', 'art'],
        datetime: '2025-09-05T15:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '25',
        name: 'Фестиваль уличного искусства',
        tags: ['art', 'culture'],
        datetime: '2025-09-10T14:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '26',
        name: 'Спортивный турнир по футболу',
        tags: ['sport'],
        datetime: '2025-09-15T10:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '27',
        name: 'Фестиваль здоровья',
        tags: ['sport', 'education'],
        datetime: '2025-09-25T09:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '28',
        name: 'Выставка кулинарного искусства',
        tags: ['food', 'culture'],
        datetime: '2025-09-30T12:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '29',
        name: 'Спортивный фестиваль для молодежи',
        tags: ['sport', 'education'],
        datetime: '2025-10-05T10:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '30',
        name: 'Кулинарный конкурс',
        tags: ['food', 'culture'],
        datetime: '2025-10-10T12:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '31',
        name: 'Фестиваль науки',
        tags: ['education', 'science'],
        datetime: '2025-10-25T14:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    },
    {
        id: '32',
        name: 'Выставка достижений молодежи',
        tags: ['culture', 'education'],
        datetime: '2025-10-30T12:00:00',
        photoUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxlY2F0aW5nJTIwY29va2luZ3xlbnwwfHx8MTY1NzI2NDc2NA&ixlib=rb-1.2.1&q=80&w=800'
    }
];



export default Meetings;
