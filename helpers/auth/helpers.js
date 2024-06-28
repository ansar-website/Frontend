import axios from 'axios';

const CreateUser = (remember, userObj, userToken, userRole, refreshToken) => {
  if (remember) {
    localStorage.userObj = JSON.stringify(userObj);
    localStorage.userToken = userToken;
    localStorage.userRole = userRole;
    localStorage.refreshToken = refreshToken;
  } else {
    sessionStorage.userObj = userObj;
    sessionStorage.userToken = userToken;
    sessionStorage.userRole = userRole;
    sessionStorage.refreshToken = refreshToken;
  }
};

const Logout = () => {
  localStorage.removeItem('userObj');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('userObj');
  sessionStorage.removeItem('userToken');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('refreshToken');
  if (axios.defaults?.headers?.common?.Authorization) delete axios.defaults.headers.common.Authorization;
};

const CheckAuth = () => {
  if (
    (localStorage.userToken && localStorage.userRole && localStorage.userObj) ||
    (sessionStorage.userObj && sessionStorage.userRole && sessionStorage.userObj)
  ) {
    return true;
  }
  return false;
};

function GetUserData() {
  if (CheckAuth()) {
    if (localStorage.userObj) {
      return localStorage.userObj;
    }
    if (sessionStorage.userObj) {
      return sessionStorage.userObj;
    }
  }
}

const AuthHelpers = {
  CreateUser,
  Logout,
  CheckAuth,
  GetUserData,
};
export default AuthHelpers;
