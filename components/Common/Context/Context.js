import React, { useState } from 'react';

export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
  const [courseData, setCourseData] = useState();
  const [goNext, setgoNext] = useState();
  const [UserData, setUserData] = useState();

  return (
    <Context.Provider value={{ courseData, setCourseData, goNext, setgoNext, UserData, setUserData }}>
      {children}
    </Context.Provider>
  );
};
