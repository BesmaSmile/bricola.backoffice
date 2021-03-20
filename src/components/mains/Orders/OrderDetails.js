import React from 'react';
import { format } from 'date-fns';
import { formatDuration } from 'functions';
import _ from 'lodash';

const OrderDetails = ({ order }) => {

  return (
    <div className='OrderDetails w400 pad20'>
      <div className='marb20 fs18 bold'>Commande N° {order.reference}</div>
      <fieldset className='ord-container'>
        <legend>Client/Partenaire</legend>
        <div>
          <span className='ord-title'>Partenaire  </span>
          <span className='ord-content'>{_.get(order, 'partner.firstname', '---')} {_.get(order, 'partner.lastname', '---')}</span>
        </div>
        <div>
          <span className='ord-title'>Client </span>
          <span className='ord-content'>{_.get(order, 'client.firstname')} {_.get(order, 'client.lastname')}</span>
        </div>
      </fieldset>


      <fieldset className='ord-container'>
        <legend>Commande</legend>
        <div>
          <span className='ord-title'>Date </span>
          <span className='ord-content'>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</span></div>
        <div>
          <span className='ord-title'>Service </span>
          <span className='ord-content'>{order.service.name}</span>
        </div>
        <div>
          <span className='ord-title'>Position </span>
          <span className='ord-content'>{order.position.name}</span>
        </div>
        <div>
          <span className='ord-title'>Destination </span>
          <span className='ord-content'>{_.get(order, 'destination.name', '---')}</span>
        </div>
        <div>
          <span className='ord-title'>Durée estimative</span>
          <span className='ord-content'>{order.duration ? formatDuration(order.duration) : '---'}</span>
        </div>
      </fieldset>

      {order.message && <fieldset className='ord-container'>
        <legend>Message du client </legend>
        <span className='ord-content'>{order.message} </span>
      </fieldset>}

      
      <fieldset className='ord-container'>
        <legend>Code Promo</legend>
          {order.promoCode ? (
            <>
              <div>
                <span className='ord-title'>Code promo </span>
                <span className='ord-content'>{_.get(order, 'promoCode.name')}</span>
              </div>
              <div>
                <span className='ord-title'>Réduction </span>
                <span className='ord-content'>{_.get(order, 'promoCode.reduction')} {_.get(order, 'promoCode.unity') === 'amount' ? 'DA' : '%'}</span>
              </div>
            </>
          ) : (
            <span className='ord-content'>Aucun</span>
          )}
      </fieldset>

      <fieldset className='ord-container'>
        <legend>Prix</legend>
        <div>
          <span className='ord-title'>Prix variable </span>
          <span className='ord-content'>{_.get(order, 'cost.variable', '---')} DA</span>
        </div>
        <div>
          <span className='ord-title'>Frais de déplacement/diagnostic </span>
          <span className='ord-content'> {_.get(order, 'cost.deplacement', 0)} DA</span>
        </div>
        <div>
          <span className='ord-title'>Chargement </span>
          <span className='ord-content'> {_.get(order, 'cost.loadingPrice', 0)} DA</span>
        </div>
        <div>
          <span className='ord-title'>Déchargement </span>
          <span className='ord-content'> {_.get(order, 'cost.unloadingPrice', 0)} DA</span>
        </div>
        <div>
          <span className='ord-title'>Montage </span>
          <span className='ord-content'> {_.get(order, 'cost.assemblyPrice', 0)} DA</span>
        </div>
        <div>
          <span className='ord-title'>Démontage </span>
          <span className='ord-content'> {_.get(order, 'cost.disassemblyPrice', 0)} DA</span>
        </div>
        
        <div>
          <span className='ord-title'>Réduction effective </span>
          <span className='ord-content'>{_.get(order, 'reduction', '---')} DA</span>
        </div>
        <div className='mart15'>
          <span className='ord-big-title'>À payer </span>
          <span className='ord-big-content'>{_.get(order, 'toPay', '---')} DA</span>
        </div>
        <div>
          <span className='ord-big-title'>Commission </span>
          <span className='ord-big-content'>{order.commission ? order.commission?.toFixed(2) : '---'} DA</span>
        </div>
      </fieldset>


    </div>
  )
}

export default OrderDetails;