import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { useAuth } from "../contexts/auth";

import { useSelector } from 'react-redux';

// Make sure that for every component/page use private route, ALWAYS remember to CALL setAuthToken(null) inside "catch" clause of a try-catch on an AXIOS CALL to HANDLE THE ERROR of the AXIOS CALL

export default function PrivateRoute({children, ...rest }) {
  const {access_token} = useAuth();
  const loadingPrompt = useSelector((state) => state.loading.loadingPrompt);

  return(
      <Route {...rest}>
        {
          loadingPrompt?
          null 
          :
          access_token? children
          : 
          <Redirect to="/login" />
        }
      </Route>
    );
  }