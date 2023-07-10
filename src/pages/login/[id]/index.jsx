import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@/Components/Modal';
import Login from '..';

function LoginConfirmed(props) {
    console.log("login confirmed");
    
  return (
    <section>
    <Login/>
  <Modal open={true}>
  Verified email
  </Modal>
    </section>
  )
}

// index.propTypes = {

// }

export default LoginConfirmed;

