const Orbita = () => {
  const particles = Array.from({ length: 300 }, (_, i) => <div key={i} className="c"></div>);
  return (
    <div className="container-orbita">
      <div className="wrap">{particles}</div>
    </div>
  );
};

export default Orbita;
