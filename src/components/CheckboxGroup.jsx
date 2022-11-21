import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import uuid from 'react-uuid';
const CheckboxGroup = ({ name, list, control, register, disabled = false }) => {
  return (
    <>
      <div className="modal__checkbox">
        {list && list?.length !== 0 ? (
          list?.map((item, i) => (
            <label key={uuid()}>
              {/* <Controller name={`${name}[${i}]`} control={control} render={({ field: props }) => <input {...props} value={props.value} onChange={(e) => props.onChange(e.target.checked)} disabled={disabled} type="checkbox" />} /> */}
              <input disabled={disabled} type="checkbox" value={item?.value} {...register(`${name}[${i}]`)} />

              <span>{item?.label}</span>
            </label>
          ))
        ) : (
          <div style={{ margin: '0 auto', gridColumn: '1/3' }}>Пусто</div>
        )}{' '}
      </div>
    </>
  );
};

export default CheckboxGroup;
