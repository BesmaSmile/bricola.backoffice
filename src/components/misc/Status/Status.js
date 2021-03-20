import React from 'react';
import './Status.scss';

const Status = (props) => {
  const status = {
    //user status
    enabled: <><div className='sts-circle bgreen'></div><div className='sts-text'>Activé</div></>,
    disabled: <><div className='sts-circle bred'></div><div className='sts-text'>Désactivé</div></>,
    suspended: <><div className='sts-circle borange'></div><div className='sts-text'>Suspendu</div></>,

    //order status
    order_pending: <><div className='sts-circle byellow'></div><div className='sts-text'>En attente</div></>,
    accepted : <><div className='sts-circle bblue'></div><div className='sts-text'>Acceptée</div></>,
    ongoing: <><div className='sts-circle bgreen'></div><div className='sts-text'>En cours</div></>,
    finished: <><div className='sts-circle bgrey'></div><div className='sts-text'>Terminée</div></>,
    not_satisfied: <><div className='sts-circle borange'></div><div className='sts-text'>Non satisfaite</div></>,
    canceled: <><div className='sts-circle bred'></div><div className='sts-text'>Annulée</div></>,

    //reclamation status
    closed : <><div className='sts-circle bgreen'></div><div className='sts-text'>Clôturée</div></>,
    pending : <><div className='sts-circle bred'></div><div className='sts-text'>Ouverte</div></>,

    //promo code status
    valid : <><div className='sts-circle bgreen'></div><div className='sts-text'>Valide</div></>,
    expired : <><div className='sts-circle bred'></div><div className='sts-text'>Expiré</div></>,
    default: <></>
  }
  return (
    <div className='Status'>
      <div className='sts-state'>{status[props.value]}</div>
      <span className='fs10 extralight gray'>{props.comment}</span>
    </div>
  )
}

export default Status