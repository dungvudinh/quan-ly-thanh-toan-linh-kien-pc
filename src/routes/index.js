import routes from '../configs/routes';
import ClientInvoices from '../pages/ClientInvoices';
import ClientInvoiceEditor from '../pages/ClientInvoices/editor.jsx'
import FreelancerInvoices from '../pages/FreelancerInvoices';
import Pricing from '../pages/Pricing';
import Lookup from '../pages/Lookup';
const publicRoutes = [
  {
    path: routes.clientInvoices,
    component: ClientInvoices,
  },
  {
    path:routes.clientInvoiceDetail, 
    component:ClientInvoiceEditor
  }, 
  {
    path:routes.clientInvoiceEditor, 
    component:ClientInvoiceEditor
  },
  {
    path: routes.freelancerInvoices,
    component: FreelancerInvoices,
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