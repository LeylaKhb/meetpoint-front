import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import './styles/App.css';
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import "./styles/fonts.css";
import Test from "./pages/Test";
import PersonalAccount from "./pages/PersonalAccount";
import CurrentMeetings from "./pages/CurrentMeetings";
import MeetingsHistory from "./pages/MeetingsHistory";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home/>}/>

                    <Route path="/registration" element={
                        localStorage.getItem("access") === null
                            ? <Registration/>
                            : <Navigate to="/" replace/>
                    }/>

                    <Route path="/login" element={
                        localStorage.getItem("access") === null
                            ? <Login/>
                            : <Navigate to="/" replace/>
                    }/>

                    <Route path="/test" element={
                        localStorage.getItem("access") === null
                            ? <Navigate to="/login" replace/>
                            : <Test/>
                    }/>
                    <Route path="/personal_account" element={
                        localStorage.getItem("access") === null
                            ? <Navigate to="/login" replace/>
                            : <PersonalAccount/>
                    }/>
                    <Route path="/current_meetings" element={
                        localStorage.getItem("access") === null
                            ? <Navigate to="/login" replace/>
                            : <CurrentMeetings/>
                    }/>
                    <Route path="/meetings_history" element={
                        localStorage.getItem("access") === null
                            ? <Navigate to="/login" replace/>
                            : <MeetingsHistory/>
                    }/>

                    <Route path="*" element={<PageNotFound/>}/>
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;