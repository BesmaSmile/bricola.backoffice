import { combineReducers } from 'redux';
import { user } from './user.reducer';
import { partner } from './partner.reducer';
import { client } from './client.reducer';
import { admin } from './admin.reducer';
import { order } from './order.reducer';
import { reclamation } from './reclamation.reducer';
import { referential } from './referential.reducer';
import { company } from './company.reducer';
import { service } from './service.reducer';
import { promoCode } from './promoCode.reducer';
import { logging } from './logging.reducer';
import { payment } from './payment.reducer';
import { publication } from './publication.reducer';

const rootReducer = combineReducers({
  user,
  partner,
  client,
  admin,
  order,
  reclamation,
  referential,
  company,
  service,
  promoCode,
  logging,
  payment,
  publication,
});

export default rootReducer;