import {Routes, Route,Navigate} from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css'
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/client-invoices" replace />} />
      {
        publicRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayout;
          if(route.layout) {
            Layout = route.layout;
          } else if(route.layout === null) {
            Layout = Fragment;
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          )
        }
      )
      }
    </Routes>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
    
  )
}

export default App
