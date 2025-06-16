import React, {useEffect, useState} from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import MeetingsGrid from "../components/layout/MeetingsGrid";
import {Meeting} from "../models/Meeting";
import {useLocation} from "react-router-dom";

const CurrentMeetings: React.FC<{}> = () => {
    const location = useLocation();
    const state = location.state as { meetings?: Meeting[] } | null;

    const meetings = state?.meetings ?? [];

    return (
        <div style={{ width: '100%' }}>
            <HelmetProvider>
                <Helmet title="Текущие мероприятия" />
            </HelmetProvider>
            <div className="home_block">
                <div className="home-container">
                    <h1 className="home_title">Текущие мероприятия</h1>
                    <MeetingsGrid
                        isUpcoming={true}
                        meetings={meetings}
                    />
                </div>
            </div>
        </div>
    );
}

export default CurrentMeetings;

