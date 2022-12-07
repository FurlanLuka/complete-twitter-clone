import { Route, Routes } from 'react-router-dom';
import { useWebsocket } from './api/websocket/use-websocket';
import { MainContainer } from './components/MainContainer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { IndexRoute } from './routes/Index';
import { LoginRoute } from './routes/Login';
import { LogoutRoute } from './routes/Logout';
import { RegisterRoute } from './routes/Register';

export function App() {
  const isWebsocketConnected = useWebsocket();

  return (
    <MainContainer>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <IndexRoute />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
        <Route path="/logout" element={<LogoutRoute />} />
      </Routes>
    </MainContainer>
  );
}

export default App;
