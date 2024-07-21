import { Routes, Route } from 'react-router-dom'
import UserRouter from './routers/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <>
    <ToastContainer/>
      <Routes>
        {UserRouter.map((page, index) => (
          <Route
            key={index}
            path={page.path}
            Component={page.component}
          />
        ))}
      </Routes>
    </>
  );
};

export default App;
