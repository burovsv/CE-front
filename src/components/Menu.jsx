import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
export const userMenu = [
  { name: 'Главная', path: '/', icon: '/img/nav/main.png' },
  { name: 'Обучения', path: '/study', icon: '/img/nav/training.png' },
  { name: 'Тестирование', path: '/testing', icon: '/img/nav/testing.png' },
];
export const adminMenu = [
  { name: 'Новости', path: '/admin/news', icon: '/img/nav/main.png' },
  { name: 'Обучение', path: '/admin/news/?study=true', icon: '/img/nav/main.png' },
  { name: 'Тестирование', path: '/admin/training', icon: '/img/nav/training.png' },

  { name: 'Пользователи', path: '/admin/users', icon: '/img/nav/testing.png' },
  { name: 'Отчеты', path: '/admin/reports', icon: '/img/list.svg' },
];
const Menu = () => {
  const [menuList, setMenuList] = useState();
  const { pathname, search } = useLocation();
  const {
    auth: { role },
  } = useSelector((state) => state.app);

  useEffect(() => {
    if (pathname.substring(0, 6) === '/admin') {
      setMenuList(adminMenu);
    } else {
      setMenuList(userMenu);
    }
  }, [pathname]);
  return (
    <div class="main__menu">
      <div class="nav">
        {menuList?.map(({ name, path, icon }) => (
          <div class={clsx('nav__item', path == pathname + search && 'nav__active')}>
            <Link to={path}>
              <img src={icon} alt="" />
              <span>{name}</span>
            </Link>
          </div>
        ))}
      </div>
      {role === 'admin' && (
        <div style={{ borderTop: '1px solid #CECECE', marginTop: '20px' }}>
          <Link className="nav__admin" to={'/admin/news'}>
            <img src="/img/admin.svg" />
            <p>Админ</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
