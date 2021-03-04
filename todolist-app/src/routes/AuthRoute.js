import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { useAuth } from "../services/auth";

export default function AuthRoute({children, ...rest }) {
  const {access_token} = useAuth();

  return(
    <Route {...rest}>
        {
          !access_token? children
          : 
          <Redirect to="/" />
        }
    </Route>
    );
  }