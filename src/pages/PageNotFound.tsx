import React from "react";

const PageNotFound : React.FC = () => {
    return (
        <div className="page_content">
            <div style={{marginTop: 130, display: 'flex', flexFlow: 'column', fontSize: 50,
                fontWeight: 'normal', alignItems: 'center', height: '75vh', textAlign: 'center'}}>
                Страница не найдена
                <a href="/" style={{fontSize: 25, marginTop: 30, marginBottom: 60}}>Перейти на главную</a>
            </div>
        </div>
    )
}

export default PageNotFound;