import 'date-fns';
import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { Select, MenuItem, CircularProgress } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/PersonRounded';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import BusinessIcon from '@material-ui/icons/BusinessRounded';

import SvgIcon from 'components/misc/SvgIcon/SvgIcon';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { orderActions, reclamationActions, partnerActions, paymentActions, clientActions, companyActions } from 'store/actions';
import { connect } from 'react-redux';
import { hooks } from 'functions';
import _ from 'lodash';
import DateChart from 'components/misc/DateChart/DateChart';
import { StatusChart, AmountChart } from 'components/misc/PieChart/PieChart';
import './Dashboard.scss';

const CountCard = props => {
  const { count, pending, title, icon, color } = props
  return (
    <div className="db-chartContainer w200 flex row jcsb aic" style={{backgroundColor : color}}>
      {icon}
      <div className='flex col aic aife fs30 medium cwhite'>
        <div className='h30'>
          {pending && <CircularProgress size={25} />}
          {!pending && count && <span>{count}</span>}
        </div>
        <div className='mart10 fs12 cwhite extralight txtar'>{title}</div>
      </div>
    </div>
  )
}
const Dashboard = props => {
  const ordersRequest = hooks.useRequest()
  const [_filter, _setFilter] = useState("year")
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const allOrders =  _.get(props, 'orders', []).map(o=>(
    {
      ...o, 
      status: o.status.state,
      createdAt: new Date(o.createdAt)
    }
  ));

  const allPartners =  _.get(props, 'partners', []).map(p=>(
    {
      ...p, 
      availabilityStatus: !p.available ? 'disconnected' : (p.busy ? 'busy' : 'free'),
      createdAt: new Date(p.createdAt)
    }
  ));

  let ordersByDate;
  switch (_filter) {
    case 'month':
      ordersByDate = allOrders.filter(order => order.createdAt.getMonth() === new Date().getMonth()
       && order.createdAt.getFullYear() === new Date().getFullYear())
      break;
    case 'year':
      ordersByDate =allOrders.filter(order => order.createdAt.getFullYear() === new Date().getFullYear())
      break;
    default :
      break;
  }

  useEffect(() => {
    props.getOrders(props.auth)
    props.getReclamations(props.auth)
    props.getPayments(props.auth);
    props.getClients(props.auth);
    props.getCompanies(props.auth)
    props.getPartners(props.auth)
    // eslint-disable-next-line
  }, [])

  const selectedDateOrders = allOrders.filter(e=>!selectedDate || format(e.createdAt, 'dd/MM/yyyy') === format(selectedDate, 'dd/MM/yyyy'))
  const selectedDateReclamations = _.get(props, 'reclamations', []).filter(e=>!selectedDate ||  format(new Date(e.createdAt), 'dd/MM/yyyy') === format(selectedDate, 'dd/MM/yyyy'))
  const selectedDatePayments = _.get(props, 'payments', []).filter(e=>!selectedDate ||  format(new Date(e.createdAt), 'dd/MM/yyyy') === format(selectedDate, 'dd/MM/yyyy'))
  const selectedDateClients = _.get(props, 'clients', []).filter(e=>!selectedDate ||  format(new Date(e.createdAt), 'dd/MM/yyyy') === format(selectedDate, 'dd/MM/yyyy'))
  const selectedDateCompanies = _.get(props, 'companies', []).filter(e=>!selectedDate ||  format(new Date(e.createdAt), 'dd/MM/yyyy') === format(selectedDate, 'dd/MM/yyyy'))

  const paymentSum = selectedDatePayments.map(e=>e.amount).reduce((e1,e2) => e1+e2, 0);
  const clientsCounts = selectedDateClients.length;
  const companiesCount = selectedDateCompanies.length;
  const partnersCount = allPartners.length;
  const partnerAvailabilityStatus = [
    { name: 'disconnected', label: 'Déconnecté', color: '#F66161' },
    { name: 'busy', label: 'Occupé', color: '#EDAE1C' },
    { name: 'free', label: 'Libre', color: '#4CD89F' },
  ];

  const orderStatus = [
    { name: 'pending', label: 'En attente', color: '#F66161' },
    { name: 'ongoing', label: 'En cours', color: '#EDAE1C' },
    { name: 'finished', label: 'Terminée', color: '#4CD89F' },
  ];

  const reclamationStatus = [
    { name: 'closed', label: 'Clôturée', color: '#4CD89F' },
    { name: 'pending', label: 'Ouverte', color: '#F66161' },
  ]
  const paymentMethods = [
    { name: 'ccp', label: 'CCP',  color: '#EDAE1C' },
    { name: 'cash', label: 'Cash', color: '#67E5E4' },
    { name: 'bank_virement', label: 'Virement Bancaire', color: '#9D8EF9' },
  ]
  
  const filters = [
    { value: 'all', name: 'Tout' },
    { value: 'year', name: 'Année courrante' },
    { value: 'month', name: 'Mois courrant' },
  ]

  return (
    <div className='Dashboard relw100'>
      <div className='mar20'>
        <div className='flex row jcsb'>
         <div className='flex row'>
            <CountCard pending={ordersRequest.pending}
              color='#F4368B'
              count={`${paymentSum} DA`}
              title='Total payé'
              icon={<div className='db-cardIcon'><SvgIcon name='coins' color="var(--white)" /></div>} />
            <CountCard pending={ordersRequest.pending}
              color='#DF8D21'
              count={partnersCount}
              title='Partenaires'
              icon={<div className='db-cardIcon'><SvgIcon name='partner' color="var(--white)" /></div>} />
            <CountCard pending={ordersRequest.pending}
              color='#AF55BE'
              count={clientsCounts}
              title='Clients'
              icon={<div className='db-cardIcon'><SvgIcon name='client' color="var(--white)" /></div>} />
            <CountCard pending={ordersRequest.pending}
              color='#2CA992'
              count={companiesCount}
              title='Entreprises'
              icon={<BusinessIcon />} />
        </div> 
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={fr}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Sélectionner une date"
              format="dd/MM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>

        <div className='flex col'>
            <div className='flex row fww jcsb'>
              <div className='relw50'><div className='db-chartContainer'><StatusChart elements={allPartners || []} title='Partenaires' status={partnerAvailabilityStatus} statusField="availabilityStatus"/></div></div>
              <div className='relw50'><div className='db-chartContainer'><StatusChart elements={selectedDateOrders || []} title='Commandes' status={orderStatus} /></div></div>
              <div className='relw50'><div className='db-chartContainer'><StatusChart elements={selectedDateReclamations || []} title='Reclamations' status={reclamationStatus} /></div></div>
              <div className='relw50'><div className='db-chartContainer'><AmountChart elements={selectedDatePayments || []} title='Paiements' methods={paymentMethods} /></div></div>
            </div>
          </div>
        <div>
        <Select classes={{ root: 'db-filter' }}
            label="Filtrer"
            onChange={(e) => { _setFilter(e.target.value) }}
            value={_filter}>
            {filters.map(filter => (
              <MenuItem key={filter.value} value={filter.value}>{filter.name}</MenuItem>
            ))}
          </Select>
          <div className='db-chartContainer'><DateChart filter={_filter} elements={ordersByDate || []} title="Commandes" /></div>
        
        
        </div>
      </div>
    </div>
  );
}

const mapState = (state) => ({
  //clients: state.client.clients,
  auth: state.user.auth,
  orders: state.order.orders,
  reclamations: state.reclamation.reclamations,
  companies: state.company.companies,
  partners: state.partner.partners,
  clients: state.client.clients,
  payments: state.payment.payments
})

const actionCreators = {
  getOrders: orderActions.getOrders,
  getReclamations: reclamationActions.getReclamations,
  getPartners: partnerActions.getPartners,
  getCompanies: companyActions.getCompanies,
  getClients: clientActions.getClients,
  getPayments: paymentActions.getPayments,
}

export default connect(mapState, actionCreators)(Dashboard);
