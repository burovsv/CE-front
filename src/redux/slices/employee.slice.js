import { createSlice } from '@reduxjs/toolkit';
import { initStateAuthEmployee, reducerAuthEmployee } from '../actions/employee/auth.action';
import { initStateDeleteEmployee, reducerDeleteEmployee } from '../actions/employee/deleteEmployee.action';
import { initStateDownloadEmployees, reducerDownloadEmployees } from '../actions/employee/downloadEmployees.action';
import { initStateFeedbackEmployee, reducerFeedbackEmployee } from '../actions/employee/feedback.action';
import { initStateGetAccount, reducerGetAccount } from '../actions/employee/getAccount.action';
import { initStateGetCompetitionProducts, reducerGetCompetitionProducts } from '../actions/employee/getCompetitionProducts.action';
import { initStateGetCompetitions, reducerGetCompetitions } from '../actions/employee/getCompetitions.action';
import { initStateGetEmployee, reducerGetEmployee } from '../actions/employee/getEmployee.action';
import { initStateGetEmployeeCompetitions, reducerGetEmployeeCompetitions } from '../actions/employee/getEmployeeCompetitions.action';
import { initStateGetEmployees, reducerGetEmployees } from '../actions/employee/getEmployees.action';
import { initStateGetEmployeeAccess, reducerGetEmployeeAccess } from '../actions/employee/getEmployeesAccess.action';
import { initStateGetEmployeeUser, reducerGetEmployeeUser } from '../actions/employee/getEmployeeUser.action';
import { initStateLoginEmployee, reducerLoginEmployee } from '../actions/employee/login.action';
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

  ...initStateGetEmployeeAccess,
  ...initStateUpdateEmployeeAccess,
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    resetGetEmployees(state) {
      state.getEmployees = initStateGetEmployees.getEmployees;
    },
    resetUpdateEmployeeAccess(state) {
      state.updateEmployeeAccess = initStateUpdateEmployeeAccess.updateEmployeeAccess;
    },
    resetGetEmployee(state) {
      state.getEmployee = initStateGetEmployee.getEmployee;
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
  },
});
export const { resetGetEmployees, resetGetEmployee, resetLoginEmployee, resetFeedbackEmployee, resetDownloadEmployees, resetGetAccount, resetUpdateEmployeeAccess } = employeeSlice.actions;
export const employeeReducer = employeeSlice.reducer;
