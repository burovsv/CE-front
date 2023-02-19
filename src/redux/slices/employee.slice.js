import { createSlice } from '@reduxjs/toolkit';
import { initStateAuthEmployee, reducerAuthEmployee } from '../actions/employee/auth.action';
import { initStateDeleteEmployee, reducerDeleteEmployee } from '../actions/employee/deleteEmployee.action';
import { initStateDownloadEmployees, reducerDownloadEmployees } from '../actions/employee/downloadEmployees.action';
import { initStateFeedbackEmployee, reducerFeedbackEmployee } from '../actions/employee/feedback.action';
import { initStateGetAccount, reducerGetAccount } from '../actions/employee/getAccount.action';
import { initStateGetAccountList, reducerGetAccountList } from '../actions/employee/getAccountList.action';
import { initStateGetCashBoxList, reducerGetCashBoxList } from '../actions/employee/getCashBoxList.action';
import { initStateGetCompetitionProducts, reducerGetCompetitionProducts } from '../actions/employee/getCompetitionProducts.action';
import { initStateGetCompetitions, reducerGetCompetitions } from '../actions/employee/getCompetitions.action';
import { initStateGetEmployee, reducerGetEmployee } from '../actions/employee/getEmployee.action';
import { initStateGetEmployeeCompetitions, reducerGetEmployeeCompetitions } from '../actions/employee/getEmployeeCompetitions.action';
import { initStateGetEmployees, reducerGetEmployees } from '../actions/employee/getEmployees.action';
import { initStateGetEmployeeAccess, reducerGetEmployeeAccess } from '../actions/employee/getEmployeesAccess.action';
import { initStateGetEmployeeUser, reducerGetEmployeeUser } from '../actions/employee/getEmployeeUser.action';
import { initStateGetPrePayment, reducerGetPrePayment } from '../actions/employee/getPrePayment.action';
import { initStateGetPrePaymentSettings, reducerGetPrePaymentSettings } from '../actions/employee/getPrePaymentSettings.action';
import { initStateLoginEmployee, reducerLoginEmployee } from '../actions/employee/login.action';
import { initStatePrePaymentCreate, reducerPrePaymentCreate } from '../actions/employee/prePaymentCreate.action';
import { initStateSync1C, reducerSync1C } from '../actions/employee/sync1C.action';
import { initStateUpdateEmployee, reducerUpdateEmployee } from '../actions/employee/updateEmployee.action';
import { initStateUpdateEmployeeAccess, reducerUpdateEmployeeAccess } from '../actions/employee/updateEmployeesAccess.action';
import { initStateUploadAvatar, reducerUploadAvatar } from '../actions/employee/uploadAvatar.action';

export const initialState = {
  ...initStateAuthEmployee,
  ...initStateLoginEmployee,
  ...initStateGetEmployees,
  ...initStateGetEmployee,
  ...initStateUpdateEmployee,
  ...initStateGetEmployeeUser,
  ...initStateDeleteEmployee,
  ...initStateUploadAvatar,
  ...initStateSync1C,
  ...initStateFeedbackEmployee,
  ...initStateDownloadEmployees,
  ...initStateGetAccount,
  ...initStateGetCompetitions,
  ...initStateGetEmployeeCompetitions,
  ...initStateGetCompetitionProducts,
  ...initStateGetAccountList,
  ...initStateGetEmployeeAccess,
  ...initStateUpdateEmployeeAccess,
  ...initStatePrePaymentCreate,
  ...initStateGetPrePayment,
  ...initStateGetCashBoxList,
  ...initStateGetPrePaymentSettings,
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    resetGetEmployees(state) {
      state.getEmployees = initStateGetEmployees.getEmployees;
    },
    resetGetCashBoxList(state) {
      state.getCashBoxList = initStateGetCashBoxList.getCashBoxList;
    },
    resetPrePaymentCreate(state) {
      state.prePaymentCreate = initStatePrePaymentCreate.prePaymentCreate;
    },
    resetUpdateEmployeeAccess(state) {
      state.updateEmployeeAccess = initStateUpdateEmployeeAccess.updateEmployeeAccess;
    },
    resetGetEmployee(state) {
      state.getEmployee = initStateGetEmployee.getEmployee;
    },
    resetGetPrePayment(state) {
      state.getPrePayment = initStateGetPrePayment.getPrePayment;
    },
    resetGetAccount(state) {
      state.getAccount = initStateGetAccount.getAccount;
    },
    resetLoginEmployee(state) {
      state.loginEmployee = initStateLoginEmployee.loginEmployee;
    },
    resetFeedbackEmployee(state) {
      state.feedbackEmployee = initStateFeedbackEmployee.feedbackEmployee;
    },
    resetDownloadEmployees(state) {
      state.downloadEmployees = initStateDownloadEmployees.downloadEmployees;
    },
  },
  extraReducers: {
    ...reducerFeedbackEmployee,
    ...reducerAuthEmployee,
    ...reducerLoginEmployee,
    ...reducerGetEmployees,
    ...reducerGetEmployee,
    ...reducerUpdateEmployee,
    ...reducerGetEmployeeUser,
    ...reducerDeleteEmployee,
    ...reducerUploadAvatar,
    ...reducerSync1C,
    ...reducerDownloadEmployees,
    ...reducerGetAccount,
    ...reducerGetCompetitions,
    ...reducerGetEmployeeCompetitions,
    ...reducerGetCompetitionProducts,
    ...reducerGetEmployeeAccess,
    ...reducerUpdateEmployeeAccess,
    ...reducerGetAccountList,
    ...reducerPrePaymentCreate,
    ...reducerGetPrePayment,
    ...reducerGetCashBoxList,
    ...reducerGetPrePaymentSettings,
  },
});
export const { resetGetEmployees, resetGetEmployee, resetLoginEmployee, resetFeedbackEmployee, resetDownloadEmployees, resetGetAccount, resetUpdateEmployeeAccess, resetPrePaymentCreate, resetGetPrePayment, resetGetCashBoxList } = employeeSlice.actions;
export const employeeReducer = employeeSlice.reducer;
