import React, { useState } from 'react';
import {Route, Redirect} from 'react-router-dom';
import { useAuth } from "../services/auth";
// Make sure that for every component/page use private route, ALWAYS remember to CALL setAuthToken(null) inside "catch" clause of a try-catch on an AXIOS CALL to HANDLE THE ERROR of the AXIOS CALL

export default function PrivateRoute({children, ...rest }) {
  const {access_token} = useAuth();

  return(
      <Route {...rest}>
        {
          access_token? children
          : 
          <Redirect to="/login" />
        }
      </Route>
    );
  }