import React, {useState} from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import "../styles/home.css";
import Popup from "../components/Popup";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const apiUrl = process.env.REACT_APP_API_URL;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

const Home: React.FC<{}> = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    return (
        <div style={{width: '100%'}}>
            <HelmetProvider>
                <Helmet
                    title="Главная"
                />
            </HelmetProvider>
            <div className="home_block">
            </div>
            {localStorage.getItem("access") === null &&
              <Popup isVisible={isPopupVisible}
                     setVisibleFalse={setIsPopupVisible}/>
            }
        </div>
    )

    function refreshAccessToken(): Promise<string> {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
            return Promise.reject(new Error("No refresh token found"));
        }

        return fetch(`${apiUrl}/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refresh: refreshToken})
        })
            .then(response => {
                if (!response.ok) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.assign('/');
                }
                return response.json();
            })
            .then((data: { access: string }) => {
                localStorage.setItem("access", data.access);
                return data.access;
            });
    }

    function fetchWithAuthRetry(url: string, options: FetchOptions = {}): Promise<Response> {
        const accessToken = localStorage.getItem("access") || "";

        const headers = {
            ...options.headers,
            'Authorization': 'Bearer ' + accessToken
        };

        return fetch(url, {
            ...options,
            headers,
        }).then(response => {
            if (response.status === 401) {
                return refreshAccessToken().then(newAccess => {
                    const retryHeaders = {
                        ...options.headers,
                        'Authorization': 'Bearer ' + newAccess
                    };
                    return fetch(url, {
                        ...options,
                        headers: retryHeaders
                    });
                });
            }
            return response;
        });
    }

}

export default Home;

