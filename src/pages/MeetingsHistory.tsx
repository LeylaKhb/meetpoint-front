import React from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';

const MeetingsHistory: React.FC<{}> = () => {
    return (
        <div style={{width: '100%'}}>
            <HelmetProvider>
                <Helmet
                    title="История мероприятий"
                />
            </HelmetProvider>
            <div className="home_block">
            </div>
        </div>
    )
}

export default MeetingsHistory;

