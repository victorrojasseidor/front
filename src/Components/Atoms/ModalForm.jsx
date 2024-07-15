// import '../../styles/_styles.scss'

function ModalForm({ close, children }) {
  const handleCloseModal = () => {
    close();
  };

  return (
    <div>
      <div className="modalForm">
        <div className="contentForm">
          <div className="closeform">
            <button onClick={handleCloseModal}> X </button>
          </div>

          <div className="message">{children}</div>
        </div>
      </div>
    </div>
  );
}

ModalForm.propTypes = {};

export default ModalForm;
