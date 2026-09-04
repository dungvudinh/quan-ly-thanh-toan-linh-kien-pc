import routes from '../configs/routes';
import ClientInvoice from '../pages/ClientInvoice';
import FreelancerInvoice from '../pages/FreelancerInvoice';
import Pricing from '../pages/Pricing';
import Lookup from '../pages/Lookup';
const publicRoutes = [
  {
    path: routes.clientInvoice,
    component: ClientInvoice,
  },
  {
    path: routes.freelancerInvoice,
    component: FreelancerInvoice,
  },
  {
    path:routes.pricing, 
    component: Pricing
  }, 
  {
    path:routes.lookup, 
    component:Lookup
  },
  
];

export { publicRoutes };