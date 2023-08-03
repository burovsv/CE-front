import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import clsx from 'clsx';
import Modal from './Modal';
import { resetGetStaffListBySubdivision, resetSaveStaffList } from '../../redux/slices/employee.slice';
import { useFieldArray, useForm } from 'react-hook-form';
import { saveStaffList } from '../../redux/actions/employee/saveStaffList.action';
import { getStaffList } from '../../redux/actions/employee/getStaffList.action';
const ModalStaff = () => {
  const dispatch = useDispatch();
  const {
    getStaffListBySubdivision: { data: staffBySubdivision },
    saveStaffList: { data: saveStaffData, loading: saveStaffLoading },
  } = useSelector((state) => state.employee);
  const { control, reset, register } = useForm({
    defaultValues: {
      staffList: [],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert, update } = useFieldArray({
    control,
    name: 'staffList',
  });

  useEffect(() => {
    if (staffBySubdivision) {
      append(staffBySubdivision);
    } else {
      reset();
    }
  }, [staffBySubdivision]);

  const [savedStaff, setSavedStaff] = useState(false);
  useEffect(() => {
    if (saveStaffData) {
      setSavedStaff(true);
      setTimeout(() => {
        setSavedStaff(false);
      }, 2000);
      dispatch(resetSaveStaffList());
    }
  }, [saveStaffData]);

  return (
    <>
      <Modal
        modalStyle={{ maxWidth: '400px' }}
        disabled={saveStaffLoading}
        title=""
        onSave={() => {
          dispatch(saveStaffList({ staffList: fields }));
        }}
        onClose={() => {
          dispatch(resetGetStaffListBySubdivision());
          dispatch(getStaffList());
        }}
        textSend={saveStaffLoading ? 'Сохранение...' : savedStaff ? 'Сохранено' : 'Сохранить'}
        textCancel={'Закрыть'}
        styleCloseBtn={{ background: '#FFA0A0' }}>
        <div style={{ minHeight: '400px', position: 'relative' }}>
          <table class="staff-table">
            {fields?.map((item, itemIndex) => (
              <tr>
                <td>{item?.name}</td>
                <td>
                  <input
                    type="number"
                    onBlur={(event) => {
                      const val = parseInt(event.target.value);
                      if (val < 0 || isNaN(val)) {
                        update(itemIndex, { ...item, staffCountCurrent: 0 });
                      } else if (val > 99) {
                        update(itemIndex, { ...item, staffCountCurrent: 99 });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (['-', '+', 'e'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(event) => {
                      update(itemIndex, { ...item, staffCountCurrent: event.target.value });
                    }}
                    value={item?.staffCountCurrent}
                  />
                </td>
                <td>
                  <div>{item?.staffCount}</div>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </Modal>
    </>
  );
};

export default ModalStaff;
