import clsx from 'clsx';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { getEmployee } from '../redux/actions/employee/getEmployee.action';
import { getEmployeeUser } from '../redux/actions/employee/getEmployeeUser.action';
import CalendarStudy from './CalendarStudy';
import Header from './Header';
import Info from './Info';
import Menu from './Menu';
import ModalFeedback from './modals/ModalFeedback';
import ModalThank from './modals/ModalThank';
import ArticleFilter from './ArticleFilter';
import ArticleSearch from './ArticleSearch';

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  useEffect(() => {
    dispatch(getEmployeeUser());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const { activeModal } = useSelector((state) => state.app);
  return (
    <div class="page">
      <Header />
      <div class="section">
        <div class="container">
          <div class="content__inner">
            <Menu />
            <div className={clsx('content', pathname.substring(0, 6) === '/admin' && 'content-admin')}>
              {pathname.substring(0, 6) !== '/admin' && pathname.includes('/knowledgeBase') && <ArticleSearch />}
              {children}
            </div>
            <div className="" style={{ display: 'flex', flexDirection: 'column' }}>
              {pathname.substring(0, 6) !== '/admin' && <Info />}
              {pathname.substring(0, 6) !== '/admin' && pathname.includes('/knowledgeBase') && <ArticleFilter />}
            </div>
          </div>
        </div>
      </div>
      {activeModal === 'modal-feedback' && <ModalFeedback />}
      {activeModal === 'modal-feedback-thank' && <ModalThank />}
    </div>
  );
};

export default MainLayout;
