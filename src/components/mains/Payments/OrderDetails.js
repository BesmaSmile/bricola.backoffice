import React from 'react';
import { format } from 'date-fns';
import { formatDuration } from 'functions';
import _ from 'lodash';

const OrderDetails = ({ order }) => {

  return (
    <div className='OrderDetails w400 pad20'>
      <div className='marb20 fs18 bold'>Commande N° xxxxxxx</div>
      <fieldset className='od-container'>
        <legend>Client/Partenaire</legend>
        <div>
          <span className='od-title'>Partenaire  </span>
          <span className='od-content'>{_.get(order, 'partner.firstname')} {_.get(order, 'partner.lastname')}</span>
        </div>
        <div>
          <span className='od-title'>Client </span>
          <span className='od-content'>{_.get(order, 'client.firstname')} {_.get(order, 'client.lastname')}</span>
        </div>
      </fieldset>


      <fieldset className='od-container'>
        <legend>Commande</legend>
        <div>
          <span className='od-title'>Date </span>
          <span className='od-content'>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</span></div>
        <div>
          <span className='od-title'>Service </span>
          <span className='od-content'>{order.service.name}</span>
        </div>
        <div>
          <span className='od-title'>Position </span>
          <span className='od-content'>{order.position.name}</span>
        </div>
        {_.get(order, 'destination.name') && <div>
          <span className='od-title'>Destination </span>
          <span className='od-content'>{order.destination.name}</span>
        </div>}
        {order.duration &&
          <div>
            <span className='od-title'>Durée </span>
            <span className='od-content'>{formatDuration(order.duration)}</span>
          </div>
        }
      </fieldset>

      {order.message && <fieldset className='od-container'>
        <legend>Message du client </legend>
        <span className='od-content'>{order.message} </span>
      </fieldset>}

      {order.promoCode &&
        <fieldset className='od-container'>
          <legend>Code Promo</legend>
          <div>
            <span className='od-title'>Code promo </span>
            <span className='od-content'>{_.get(order, 'promoCode.name')}</span>
          </div>
          <div>
            <span className='od-title'>Réduction </span>
            <span className='od-content'>{_.get(order, 'promoCode.reduction')} {_.get(order, 'promoCode.unity') === 'amount' ? 'DA' : '%'}</span>
          </div>
        </fieldset>
      }

      <fieldset className='od-container'>
        <legend>Prix</legend>
        <div>
          <span className='od-title'>Prix global </span>
          <span className='od-content'>{_.get(order, 'cost?.global')} DA</span>
        </div>
        {_.get(order, 'cost?.deplacement') && <div>
          <span className='od-title'>Frais déplacement/diagnostic </span>
          <span className='od-content'> {_.get(order, 'cost?.deplacement')} DA</span>
        </div>}
        <div>
          <span className='od-title'>Réduction </span>
          <span className='od-content'>{order.reduction} DA</span>
        </div>
        <div>
          <span className='od-title'>À payer </span>
          <span className='od-content'>{order.toPay} DA</span>
        </div>
      </fieldset>


    </div>
  )
}

export default OrderDetails;