import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
const SearchCard = ({ link, title, desc, linkBlank }) => {
  return (
    <>
      {linkBlank ? (
        <a class="alert__item" href={link}>
          <div class="alert__title">{title}</div>
          <div class="alert__text">{desc}</div>
        </a>
      ) : (
        <Link class="alert__item" target={linkBlank && '_blank'} to={link}>
          <div class="alert__title">{title}</div>
          <div class="alert__text">{desc}</div>
        </Link>
      )}
    </>
  );
};

export default SearchCard;
