import React, { useEffect, useState } from 'react';
import Loading from '../Loading';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { loginEmployee } from '../../redux/actions/employee/login.action';
import { authEmployee } from '../../redux/actions/employee/auth.action';

const AuthPage = () => {
  const defaultValues = {
    login: '',
    password: '',
  };
  const [errorAuth, setErrorAuth] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.app);
  const {
    loginEmployee: { data, loading, error },
  } = useSelector((state) => state.employee);
  const {
    authEmployee: { loading: loadingAuth },
  } = useSelector((state) => state.employee);
  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = watch((value, { name, type }) => setErrorAuth(false));
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (error?.error === 'LOGIN_ERROR' && !loading) {
      setErrorAuth(true);
    }
  }, [error]);

  useEffect(() => {
    if (data && !error) {
      dispatch(authEmployee());
      navigate('/');
    }
  }, [data]);

  useEffect(() => {
    return () => {};
  }, []);

  const onSubmit = (data) => {
    dispatch(loginEmployee(data));
  };

  return (
    auth === null && (
      <div class="authorization">
        <div class="authorization__wrap">
          <img class="authorization__img" src="/img/header/logo.png" alt="" width="30" height="35" />

          <form autoComplete="off" class="authorization__form" onSubmit={handleSubmit(onSubmit)}>
            <input type="login" placeholder="Телефон" {...register('login', { required: true })} />
            <input type="password" placeholder="Пароль" {...register('password', { required: true })} />
            <span class="text-error">{errors?.login || errors?.password ? 'Заполните все поля' : errorAuth ? 'Неправильный логин или пароль' : ''}</span>
            <button class="authorization__btn" type="submit">
              <a>Вход</a>
            </button>
          </form>
        </div>
        {(loading || loadingAuth) && <Loading empty />}
      </div>
    )
  );
};

export default AuthPage;
