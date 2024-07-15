const SphereCanvas = () => {
  const amount = 200;
  const divs = [];
  for (let i = 0; i < amount; i++) {
    divs.push(<div key={i}></div>);
  }
  return (
    <div className="daddy">
      <div className="mommy">{divs}</div>
    </div>
  );
};

export default SphereCanvas;
