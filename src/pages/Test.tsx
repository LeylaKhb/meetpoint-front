import React from "react";
import {HelmetProvider} from "react-helmet-async";
import {Helmet} from "react-helmet";

const Test: React.FC<{}> = () => {
    return (
        <div className="page_content" style={{ height: '90vh'}}>
            <HelmetProvider>
                <Helmet
                    title="Тест"
                />
            </HelmetProvider>
        </div>
    )
}

export default Test;