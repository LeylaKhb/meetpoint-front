import React from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';

const CurrentMeetings: React.FC<{}> = () => {
    return (
        <div style={{width: '100%'}}>
            <HelmetProvider>
                <Helmet
                    title="Текущие мероприятия"
                />
            </HelmetProvider>
            <div className="home_block">
            </div>
        </div>
    )
}

export default CurrentMeetings;

