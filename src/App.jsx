import {Routes, Route,Navigate} from 'react-router-dom';
import { Fragment } from 'react';
import { publicRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadModels, loadInvoices, loadPriceLists, priceListToTables } from './services/api.js';
import { setModels } from './redux/actions/modelActions.js';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css'
function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  useEffect(() => {
    let active = true;
    Promise.all([loadModels(), loadInvoices('customer'), loadInvoices('freelancer'), loadPriceLists()])
      .then(([models, customers, freelancers, priceLists]) => {
        if (!active) return;
        const tables = priceListToTables(priceLists);
        dispatch(setModels(models));
        dispatch({ type: 'SET_CLIENT_PRICES', payload: tables.client });
        dispatch({ type: 'SET_FREELANCER_PRICES', payload: tables.freelancer });
        dispatch({ type: 'SET_INVOICES', payload: [...customers, ...freelancers] });
      })
      .catch((error) => console.error('Không thể tải dữ liệu từ backend:', error));
    return () => { active = false; };
  }, [dispatch]);

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
        theme={theme}
      />
    </>
    
  )
}

export default App
