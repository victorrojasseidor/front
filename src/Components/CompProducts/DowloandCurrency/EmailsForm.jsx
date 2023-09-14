import React, { useEffect, useState } from 'react'
import ImageSvg from '@/helpers/ImageSVG'
import { useAuth } from '@/Context/DataContext'
import { fetchConTokenPost } from '@/helpers/fetch'
import Modal from '@/Components/Modal'

export default function EmailsForm ({ setHaveEmails, dataEmails, idproduct }) {
  const [email, setEmail] = useState('')
  const [emails, setEmails] = useState([])
  const [error, setError] = useState('')
  const [modalConfirmation, setModalConfirmation] = useState(false)

  const { session, setModalToken } = useAuth()
  const handleChange = (e) => {
    setEmail(e.target.value)
    setError('')
  }

  useEffect(() => {
    if (dataEmails) {
      const arrayDeCorreos = dataEmails.map(item => item.correo)
      setEmails(arrayDeCorreos)
      console.log('arraycorreso', arrayDeCorreos)
    }
  }, [dataEmails])

  const handleAddEmails = () => {
    const emailList = email.split(/[ ,;\n]+/) // Expresión regular para separar por espacios, comas, puntos y comas y saltos de línea
    const validEmails = []
    const invalidEmails = []

    emailList?.forEach((singleEmail) => {
      const trimmedEmail = singleEmail.trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@ñ]+$/i

      if (emailRegex.test(trimmedEmail)) {
        if (!emails.includes(trimmedEmail)) {
          validEmails.push(trimmedEmail)
        }
      } else {
        invalidEmails.push(trimmedEmail)
      }
    })

    setEmails([...emails, ...validEmails])
    setEmail('')

    setError(invalidEmails.length > 0 ? `The following emails are invalid: ${invalidEmails.join(', ')}` : '')
    setTimeout(function () {
      setError('')
    }, 10000)
  }

  const handleDelete = (index) => {
    const updatedEmails = [...emails]
    updatedEmails.splice(index, 1)
    setEmails(updatedEmails)
  }

  async function handleSendEmails () {
    const listEmails = emails?.map(correo => {
      return { sCorreo: correo }
    })

    const body = {
      oResults: {
        iIdExtBanc: idproduct,
        iIdPais: 1,
        oCorreo: listEmails
      }
    }

    try {
      const token = session?.sToken

      const responseData = await fetchConTokenPost('dev/BPasS/?Accion=RegistrarCorreoExtBancario', body, token)
      console.log('emailsrespon', responseData)

      if (responseData.oAuditResponse?.iCode === 1) {
        // const data= responseData.oResults;
        setModalConfirmation(true)
        setModalToken(false)
        setTimeout(function () {
          setHaveEmails(true)
        }, 1000)
      } else {
        const errorMessage = responseData.oAuditResponse ? responseData.oAuditResponse.sMessage : 'Error in sending the form'
        console.log('errok, ', errorMessage)
        setModalToken(true)
        setModalConfirmation(false)
      }
    } catch (error) {
      console.error('error', error)
      // setModalToken(true)
      setModalConfirmation(false)
    }
  }

  return (
    <div className='emailsFormContainer'>

      {modalConfirmation && (
        <Modal close={() => setModalConfirmation(false)}>
          <div>
            <h3>
              Successful email registration
            </h3>
          </div>
        </Modal>
      )}
      <form className='form-container' onSubmit={(e) => e.preventDefault()}>
        <div className='emailBox'>

          <div className='input-box'>

            <textarea
              value={email}
              onChange={handleChange}
              placeholder=''
            // placeholder="Introduce uno o varios correos electrónicos separados por espacios, comas o puntos y comas"
              rows={4} // Adjust the number of visible rows as needed
              cols={40}
            />
            <label htmlFor=''> Add emails </label>
          </div>
          <div>
            <button type='button' className='btn_black' onClick={handleAddEmails}>
              + Add
            </button>
          </div>

        </div>

        {error && <p className='errorMessage'>{error}</p>}

      </form>
      {emails.length > 0 && (
        <div className='listEmails'>
          <p>Added Emails:</p>

          <ul className='ListEmails'>
            {emails?.map((email, index) => (
              <li key={index}>
                {email} <button className='btn_crud' onClick={() => handleDelete(index)}> <ImageSvg name='Delete' /></button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {emails.length > 0 && <button className='btn_primary' onClick={handleSendEmails}>Save and continue</button>}

    </div>

  )
}
