import React, {useEffect, useState} from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import "../styles/home.css";
import MeetingsGrid from "../components/layout/MeetingsGrid";
import {Meeting} from "../models/Meeting";

const apiUrl = process.env.REACT_APP_API_URL;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

const Home: React.FC<{}> = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        const fetchMeetings = async () => {
            const token = localStorage.getItem('token');

            let res;
            if (token) {
                res = await fetch(`${apiUrl}/meetings/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                res = await fetch(`${apiUrl}/meetings`);
            }

            const data = await res.json();
            setMeetings(data.meetings || []);
        };

        fetchMeetings();
    }, []);

    return (
        <div style={{width: '100%'}}>
            <HelmetProvider>
                <Helmet
                    title="Главная"
                />
            </HelmetProvider>

            <div className="home_block">
                <div className="home-container">
                    <h1 className="home_title">Добро пожаловать</h1>
                    <MeetingsGrid meetings={meetings}/>
                </div>
            </div>
        </div>
    )
}

export default Home;

