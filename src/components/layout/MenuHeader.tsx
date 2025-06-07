import React from "react";

const apiUrl = process.env.REACT_APP_API_URL;

interface MenuHeaderProps {
    handleMenuLinks: any;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({handleMenuLinks}) => {
    function logout() {
        fetch(apiUrl + '/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: localStorage.getItem('refresh') })
        }).then(() => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.location.assign('/login');
        });
    }

    return (
        <div className="menu">
            <ul role="list" className="menu_ul" onClick={handleMenuLinks}>
                <li className="menu_li">
                    <a className="menu_li_link" href="/">Подобрать игру</a></li>
                {localStorage.getItem("access") === null &&
                  <>
                    <li className="menu_li">
                      <a className="menu_li_link" href="/login">Войти</a>
                    </li>
                    <li className="menu_li">
                      <a className="menu_li_link" href="/registration">Зарегистрироваться</a>
                    </li>
                  </>
                }
                {localStorage.getItem("access") !== null &&
                  <>
                    <li className="menu_li">
                      <span className="menu_li_link" onClick={logout}>Выйти</span>
                    </li>
                  </>
                }
            </ul>
        </div>
    )
}
export default MenuHeader;