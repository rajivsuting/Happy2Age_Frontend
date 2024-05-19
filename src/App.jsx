import React from 'react'
import AllRoutes from './Routes/AllRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toastConfig = {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          // transition: Bounce,
          }

const App = () => {
  return (
    <div>
      <AllRoutes/>
      <ToastContainer />
    </div>
  )
}

export default App