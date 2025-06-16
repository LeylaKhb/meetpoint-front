import React, {useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Test from "./pages/Test";
import Meetings from "./pages/Meetings";
import MeetingDetails from "./pages/MeetingDetails";
import PersonalAccount from "./pages/PersonalAccount";
import CurrentMeetings from "./pages/CurrentMeetings";
import MeetingsHistory from "./pages/MeetingsHistory";
import "./styles/App.css";
import "./styles/fonts.css";
import {fetchWithAuthRetry} from "./components/auth";

const apiUrl = process.env.REACT_APP_API_URL;

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({element}) => {
    return localStorage.getItem("access") ? element : <Navigate to="/login" replace/>;
};


const ProtectedRouteWithSheetCheck: React.FC<{ element: React.ReactElement }> = ({element}) => {
    const [isSheetValid, setIsSheetValid] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSheet = async () => {
            try {
                const response = await fetchWithAuthRetry(`${apiUrl}/sheet`, {
                    method: "GET"
                });

                const data = await response.json();
                setIsSheetValid(data.status);

                if (!data.status) {
                    navigate('/test');
                }
            } catch (error) {
                console.error('Sheet check error:', error);
                navigate('/test');
            }
        };

        if (localStorage.getItem("access")) {
            checkSheet();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    if (isSheetValid === null) {
        return <div>Loading...</div>; // Или компонент загрузки
    }

    return isSheetValid ? element : <Navigate to="/test" replace/>;
};

const GuestRoute: React.FC<{ element: React.ReactElement }> = ({element}) => {
    return !localStorage.getItem("access") ? element : <Navigate to="/" replace/>;
};

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Meetings/>}/>
                    <Route path="/meetings" element={<Meetings/>}/>
                    <Route path="/meeting" element={<MeetingDetails/>}/>

                    <Route path="/registration" element={<GuestRoute element={<Registration/>}/>}/>
                    <Route path="/login" element={<GuestRoute element={<Login/>}/>}/>

                    <Route path="/test" element={<ProtectedRoute element={<Test/>}/>}/>
                    <Route path="/personal_account"
                           element={<ProtectedRouteWithSheetCheck element={<PersonalAccount/>}/>}/>
                    <Route path="/current_meetings"
                           element={<ProtectedRouteWithSheetCheck element={<CurrentMeetings/>}/>}/>
                    <Route path="/meetings_history"
                           element={<ProtectedRouteWithSheetCheck element={<MeetingsHistory/>}/>}/>

                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;