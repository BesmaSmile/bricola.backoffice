import React from 'react';
import MainLayout from 'layouts/MainLayout/MainLayout';
import Partners from 'components/mains/Partners/Partners'
import Clients from 'components/mains/Clients/Clients'
import Admins from 'components/mains/Admins/Admins'
import Orders from 'components/mains/Orders/Orders'
import Reclamations from 'components/mains/Reclamations/Reclamations';
import Companies from 'components/mains/Companies/Companies';
import Services from 'components/mains/Services/Services';
import Publications from 'components/mains/Publications/Publications';
import PromoCodes from 'components/mains/PromoCodes/PromoCodes';
import Payments from 'components/mains/Payments/Payments';
import Dashboard from 'components/mains/Dashboard/Dashboard';
import { Route } from "react-router-dom";
import { PageWrapper } from 'components/misc/PermissionWrappers/PermissionWrappers';
import { permissionConstants } from 'consts';

const pages = [
  { path: '/dashboard', name: permissionConstants.DASHBOARD, component: <Dashboard /> },
  { path: '/orders', name: permissionConstants.ORDERS, component: <Orders /> },
  { path: '/reclamations', name: permissionConstants.RECLAMATIONS, component: <Reclamations /> },
  { path: '/companies', name: permissionConstants.COMPANIES, component: <Companies/> },
  { path: '/partners', name: permissionConstants.PARTNERS, component: <Partners /> },
  { path: '/clients', name: permissionConstants.CLIENTS, component: <Clients /> },
  { path: '/payment', name: permissionConstants.PAYMENT, component: <Payments /> },
  { path: '/promo_codes', name: permissionConstants.PROMO_CODES, component: <PromoCodes /> },
  { path: '/services', name: permissionConstants.SERVICES, component: <Services /> },
  { path: '/publications', name: permissionConstants.SERVICES, component: <Publications /> },
  { path: '/administrateurs', name: permissionConstants.ADMINS, component: <Admins /> },
]
const MainPage = (props) => {
  return (
    <MainLayout>
      {pages.map((page, i) => <Route  key={i} exact path={page.path} component={()=><PageWrapper name={page.name} page={page.component} />} />)}
    </MainLayout>
  );
}

export default MainPage;
