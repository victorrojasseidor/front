import { useState } from 'react'
import '../../styles/styles.scss'

const Steps = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className='registration-form'>
      <div className='registration-form-progress'>
        <div className={`${'progress-step'} ${currentStep >= 1 && 'active'}`} />
        <div className={`${'progress-step'} ${currentStep >= 2 && 'active'}`} />
        <div className={`${'progress-step'} ${currentStep >= 3 && 'active'}`} />
      </div>
      <div className='registration-form-content'>
        {currentStep === 1 && (
          <div>
            <h2>Paso 1</h2>
            {/* Contenido del primer paso del formulario */}
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2>Paso 2</h2>
            {/* Contenido del segundo paso del formulario */}
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h2>Paso 3</h2>
            {/* Contenido del tercer paso del formulario */}
          </div>
        )}
      </div>
      <div>
        {currentStep > 1 && (
          <button onClick={handlePreviousStep}>Anterior</button>
        )}
        {currentStep < 3 && (
          <button onClick={handleNextStep}>Siguiente</button>
        )}
        {currentStep === 3 && (
          <button>Enviar</button>
        )}
      </div>
    </div>
  )
}

export default Steps
