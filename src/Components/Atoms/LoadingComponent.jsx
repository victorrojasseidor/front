import { PulseLoader } from 'react-spinners'

const LoadingComponent = () => {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <PulseLoader color='#3C2CD1' />

    </div>

  )
}

export default LoadingComponent
