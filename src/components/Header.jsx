import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authEmployee } from '../redux/actions/employee/auth.action';
import { useSearchParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router';
import { setSearchTerm } from '../redux/slices/search.slice';
import { globalSearch } from '../redux/actions/search/globalSearch.action';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { adminMenu, userMenu } from './Menu';
import { setActiveModal } from '../redux/slices/app.slice';
import { resetGetAccount } from '../redux/slices/employee.slice';
const Header = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [menuList, setMenuList] = useState();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const onLogout = () => {
    localStorage.removeItem('token');
    dispatch(authEmployee());
    dispatch(resetGetAccount());
  };
  const {
    auth: { role },
  } = useSelector((state) => state.app);
  useEffect(() => {
    if (searchParams.get('term')) {
      dispatch(globalSearch({ term: searchParams.get('term') }));
    }
  }, [searchParams.get('term')]);

  const [searchText, setSearchText] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log('search CALL');
      if (searchText !== undefined) {
        navigate(`/search?term=${searchText}`);
      }
      // dispatch(setSearchTerm(searchText));
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);
  useEffect(() => {
    if (pathname.substring(0, 6) === '/admin') {
      setMenuList(adminMenu);
    } else {
      setMenuList(userMenu);
    }
  }, [pathname]);
  return (
    <>
      <header class="header">
        <div class="container">
          <div class="header__wrap">
            <div class="logo" onClick={() => navigate('/')}>
              <div>
                <div>
                  <img class="logo__img" src=" /img/header/logo.png" alt="" />
                </div>
              </div>
              <div class="logo__inner">
                <div class="logo__title">Ценалом</div>
                <div class=" logo__name">Образовательный</div>
              </div>
            </div>

            <div class="header__box">
              <div class="search" style={{ marginRight: '35px' }}>
                {pathname.substring(0, 6) !== '/admin' && (
                  <form class="search__form">
                    <input class="search__input" id="search" type="search" placeholder="Поиск ..." onChange={(e) => setSearchText(e.target.value)} />
                    <button class="search__btn" type="submit">
                      <a href="">
                        <img src="/img/header/search.png" alt="" />
                      </a>
                    </button>
                  </form>
                )}
              </div>
              <button style={{ marginRight: 'auto' }} onClick={() => dispatch(setActiveModal('modal-feedback'))}>
                <img src="/img/like.svg" />
              </button>
              <div class="exit" onClick={onLogout}>
                <div class="exit__name">
                  <a>Выход</a>
                </div>
                <div class="exit__img">
                  <a>
                    <img src="/img/header/exit.png" alt="" />
                  </a>
                </div>
              </div>
            </div>

            <button class="burger" type="button" onClick={() => setMenuActive(true)}>
              <img class="burger__icon" src="/img/burger/burger03.png" alt="" />
            </button>
          </div>
        </div>
      </header>
      <div class={clsx('overlay', menuActive && 'overlay--active')} id="myNav">
        <a href="javascript:void(0)" class="closebtn" onClick={() => setMenuActive(false)}>
          <img src="/img/burger/close.png" alt="" />
        </a>

        <div class="overlay-content">
          <div class="overlay__link">
            <a class="motivation__ico" href="/personal__motivation.html">
              <img src="/img/header/logo_white.png" alt="" />
            </a>
            {menuList?.map((menuItem) => (
              <Link to={menuItem?.path} onClick={() => setMenuActive(false)}>
                {menuItem?.name}
              </Link>
            ))}
            {/* 
            <Link to="/study" onClick={() => setMenuActive(false)}>
              Обучение
            </Link>
            <Link to="/testing" onClick={() => setMenuActive(false)}>
              Тестирование
            </Link> */}
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setMenuActive(false);
                onLogout();
              }}>
              Выход
            </a>
            {role === 'admin' ? (
              pathname.substring(0, 6) !== '/admin' ? (
                <Link to="/admin/news" style={{ color: '#ff0d0d' }} onClick={() => setMenuActive(false)}>
                  Админ
                </Link>
              ) : (
                <Link to="/" style={{ color: '#FDEC31' }} onClick={() => setMenuActive(false)}>
                  Сайт
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
