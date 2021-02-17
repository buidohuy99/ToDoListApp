import {AuthProvider} from './contexts/auth';
import { BrowserRouter, Switch, Route} from "react-router-dom";
import PrivateRoute from './routes/PrivateRoute';
import AuthRoute from './routes/AuthRoute';

import {Dashboard} from './pages/Dashboard';
import {Login} from './pages/Login';

import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main>
          <Switch>
            <PrivateRoute exact path='/'>
              <Dashboard/>
            </PrivateRoute>

            <AuthRoute exact path='/login'>
              <Login/>
            </AuthRoute>

            <Route component={NotFoundPage}/>
          </Switch>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
