import {Routes, Route,Navigate} from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './layouts/DefaultLayout';
function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/client-invoice" replace />} />
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
  )
}

export default App
