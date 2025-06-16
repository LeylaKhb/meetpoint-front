import React from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {Meeting} from "../models/Meeting";
import {useLocation} from "react-router-dom";
import MeetingsGrid from "../components/layout/MeetingsGrid";

const MeetingsHistory: React.FC<{}> = () => {
    const location = useLocation();
    const state = location.state as { meetings?: Meeting[] } | null;

    const meetings = state?.meetings ?? [];

    return (
        <div style={{ width: '100%' }}>
            <HelmetProvider>
                <Helmet title="История мероприятий" />
            </HelmetProvider>
            <div className="home_block">
                <div className="home-container">
                    <h1 className="home_title">Текущие мероприятия</h1>
                    <MeetingsGrid
                        isPast={true}
                        meetings={meetings}

                    />
                </div>
            </div>
        </div>
    );
}

export default MeetingsHistory;

