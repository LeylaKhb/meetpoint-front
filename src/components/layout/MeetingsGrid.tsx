import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Meeting } from "../../models/Meeting";

interface Props {
    meetings: Meeting[];
    isPast?: boolean;
    isUpcoming?: boolean;
}

const ITEMS_PER_PAGE = 12;

const MeetingsGrid: React.FC<Props> = ({ meetings, isPast, isUpcoming }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const navigate = useNavigate();

    const totalPages = Math.ceil(meetings.length / ITEMS_PER_PAGE);
    const currentMeetings = meetings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <>
            <div className="meetings-grid">
                {currentMeetings.map((meeting) => {
                    const dateObj = new Date(meeting.datetime);
                    const dateStr = dateObj.toLocaleDateString();
                    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                        <div
                            key={meeting.id}
                            className="meeting-card"
                            onClick={() => navigate(`/meeting?meetingId=${meeting.id}`, {
                                state: { isPast, isUpcoming }
                            })}
                            style={{ backgroundImage: `url(${meeting.photoUrl})`, cursor: "pointer" }}
                        >
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
        </>
    );
};

export default MeetingsGrid;
