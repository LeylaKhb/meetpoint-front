import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/meeting-details.css';
import star from "../static/star_fill_1.svg";
import {Meeting} from "../models/Meeting";

const apiUrl = process.env.REACT_APP_API_URL;

interface MeetingDetailsProps {
    isPast?: boolean;
    isUpcoming?: boolean;
}

const MeetingDetails: React.FC<MeetingDetailsProps> = (props) => {
    const location = useLocation();
    const state = location.state as { isPast?: boolean; isUpcoming?: boolean } | null;
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = new URLSearchParams(location.search);
    const meetingId = params.get('meetingId');

    console.log("props.isPast", props.isPast);
    const isPast = props.isPast ?? state?.isPast ?? false;
    console.log(isPast);
    const isUpcoming = props.isUpcoming ?? state?.isUpcoming ?? false;

    const isAuthenticated = Boolean(localStorage.getItem('access'));

    const renderActionButton = () => {
        if (isPast) {
            return (
                <button className="meeting-details-join-button">
                    Оставить отзыв
                </button>
            );
        }

        if (isUpcoming) {
            return (
                <button className="meeting-details-join-button">
                    Отменить запись
                </button>
            );
        }

        if (!isPast && !isUpcoming && isAuthenticated) {
            return (
                <button className="meeting-details-join-button">
                    Записаться на мероприятие
                </button>
            );
        }

        return null;
    };

    useEffect(() => {
        const fetchMeetingDetails = async () => {
            if (!meetingId) {
                setError('ID мероприятия не указан.');
                return;
            }

            try {
                const res = await fetch(`${apiUrl}/meeting?meetingId=${meetingId}`);
                if (!res.ok) throw new Error('Ошибка при получении данных');
                const data = await res.json();
                setMeeting(data.meeting);

            } catch (err) {
                setError('Не удалось загрузить мероприятие.');
            } finally {
                setLoading(false);
            }
        };

        fetchMeetingDetails();
    }, [meetingId]);

    if (loading) return <div className="meeting-details-loading">Загрузка...</div>;
    if (error) return <div className="meeting-details-error">{error}</div>;
    if (!meeting) return null;

    const dateObj = new Date(meeting.datetime);
    const dateStr = dateObj.toLocaleDateString();
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="meeting-details-container">
            <div
                className="meeting-details-banner"
                style={{ backgroundImage: `url(${meeting.photoUrl})` }}
            >
                <div className="meeting-details-overlay">
                    <h1 className="meeting-details-title">{meeting.name}</h1>
                    <div className="meeting-details-rating-block">
                        <img className="meeting-details-rating-star" src={star} alt="Rating star"/>
                        <span className="meeting-details-rating">{meeting.rating.toFixed(1)}</span>
                    </div>

                </div>
            </div>

            <div className="meeting-details-content">
                <div className="meeting-details-tags">
                    {meeting.tags.map((tag, idx) => (
                        <span key={idx} className="meeting-details-tag">#{tag}</span>
                    ))}
                </div>

                <p className="meeting-details-datetime">
                    <b>Дата:</b> {dateStr} в {timeStr}
                </p>

                <p className="meeting-details-location">
                    <b>Место проведения: </b> {meeting.location}
                </p>

                <p className="meeting-details-members">
                    <b>Участники: </b>{meeting.membersCount} / {meeting.maxMembers}
                </p>

                <p className="meeting-details-description">
                    <b>Описание: </b>{meeting.description}
                </p>

                {renderActionButton()}
            </div>
        </div>
    );
}

export default MeetingDetails;