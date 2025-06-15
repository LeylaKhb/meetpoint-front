import React, { useEffect, useState } from 'react';
import MeetingsGrid from '../components/layout/MeetingsGrid';
import TagFilter from '../components/layout/TagFilter';
import { Meeting } from '../models/Meeting';
import '../styles/meetings.css';

const apiUrl = process.env.REACT_APP_API_URL;

const Meetings: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    const fetchMeetings = async (tagIds: string[] = []) => {
        const query = tagIds.length ? `?tagIds=${tagIds.join(',')}` : '';
        const res = await fetch(`${apiUrl}/meetings${query}`);
        const data = await res.json();
        setMeetings(data.meetings || []);
    };

    useEffect(() => {
        fetchMeetings(); // начальная загрузка всех мероприятий
    }, []);

    return (
        <div className="meetings-container">
            <h1 className="meetings-title">Мероприятия</h1>
            <TagFilter onChange={fetchMeetings} />
            <MeetingsGrid meetings={meetings} />
        </div>
    );
};

export default Meetings;
