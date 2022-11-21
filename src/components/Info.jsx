import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { getAccount } from '../redux/actions/employee/getAccount.action';
import { getEmployeeUser } from '../redux/actions/employee/getEmployeeUser.action';
import { uploadAvatar } from '../redux/actions/employee/uploadAvatar.action';
import { getNewsCalendar } from '../redux/actions/news/getNewsCalendar.action';
import { setNextEventCalendar } from '../redux/slices/news.slice';
import CalendarEvent from './CalendarEvent';
import CalendarStudy from './CalendarStudy';
import { Link } from 'react-router-dom';
const Info = () => {
  const {
    getEmployeeUser: { data: employee },
    uploadAvatar: { data: uploadAvatarData },
    getAccount: { data: dataAccount, loading: loadingAccount },
  } = useSelector((state) => state.employee);
  const {
    getNewsCalendar: { data: calendarData },
    nextEventCalendar,
  } = useSelector((state) => state.news);
  const dispatch = useDispatch();
  const onImageChange = (e) => {
    const [file] = e.target.files;
    const formData = new FormData();
    formData.append('image', file);
    dispatch(uploadAvatar(formData));
  };
  const { pathname } = useLocation();
  useEffect(() => {
    dispatch(getEmployeeUser());
  }, [uploadAvatarData]);
  useEffect(() => {
    dispatch(getNewsCalendar());
    // dispatch(getAccount());
  }, []);
  useEffect(() => {
    if (employee?.idService) {
      dispatch(getAccount({ idService: employee?.idService, date: moment().format('YYYY-MM-DD') }));
    }
  }, [employee]);

  useEffect(() => {
    if (calendarData) {
      const allDates = calendarData?.map((dateItem) => {
        return { date: dateItem?.dateStart, id: dateItem?.dateStart };
      });

      let findDate = getNextDate(allDates, new Date());
      console.log(findDate);
      let findEvent = findSameDate(calendarData, findDate);
      dispatch(setNextEventCalendar(findEvent));
    }
  }, [calendarData]);

  const findSameDate = (list, mainDate) => {
    let findDate = null;
    for (let item of list) {
      const checkSame = moment(item?.dateStart).isSame(mainDate);
      if (checkSame) {
        return item;
      }
    }
  };

  const getNextDate = (arrayOfDates, findDate) => {
    try {
      let nearestDate, momentsDate;
      if (moment(findDate).isValid()) {
        momentsDate = arrayOfDates
          .filter((dt) => moment(dt?.date).isSameOrAfter(findDate))
          .map(({ date }) => {
            if (moment(date).isValid()) {
              date = moment(date);
              const diff = moment(date).diff(moment(findDate), 'seconds');
              if (diff >= 0) {
                if (nearestDate) {
                  if (moment(date).diff(moment(nearestDate), 'seconds') < 0) {
                    nearestDate = date;
                  }
                } else {
                  nearestDate = date;
                }
              }
            } else {
              date = false;
            }

            return date;
          })
          .filter((isValid) => isValid);
      }

      if (!nearestDate) {
        nearestDate = moment.max(momentsDate);
      }
      return nearestDate.format('YYYY-MM-DD HH:mm:ss');
    } catch (error) {
      console.error(`Error In findNearestDate ${error}`);
      return false;
    }
  };

  const hiddenFileInput = React.useRef(null);
  const onClickUpload = () => {
    hiddenFileInput.current.click();
  };
  console.log(pathname);
  return (
    employee && (
      <div class="info">
        <div class="personal">
          <div class="personal__avatar">
            <a onClick={onClickUpload}>
              <img src={employee?.image ? `${process.env.REACT_APP_SERVER_URL}/images/${employee?.image}` : '/img/account.jpg'} alt="" style={{ height: '60px', width: '60px', objectFit: 'cover' }} />
              <input type="file" onChange={onImageChange} style={{ display: 'none' }} ref={hiddenFileInput} />
            </a>
          </div>
          <div class="personal__name">{`${employee?.firstName} ${employee?.lastName}`}</div>
          <div class="personal__post">{employee?.post}</div>
          <div class="personal__city">{employee?.subdivision}</div>
          {pathname !== '/account' && (
            <>
              {(dataAccount || loadingAccount) && (
                <Link style={{ pointerEvents: !loadingAccount ? 'auto' : 'none' }} class="personal__btn" to={'/account'}>
                  {loadingAccount ? <div className="loading-account">Идет загрузка...</div> : 'Личный кабинет'}
                </Link>
              )}
            </>
          )}
        </div>
        {calendarData && (
          <div class="calendar-wrap">
            <CalendarStudy data={calendarData} />
            {nextEventCalendar && <CalendarEvent data={nextEventCalendar} />}
          </div>
        )}
      </div>
    )
  );
};

export default Info;
