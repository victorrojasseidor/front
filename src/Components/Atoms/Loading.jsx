import { PuffLoader } from 'react-spinners';

const Loading = () => {
  return (
    <section className="sectionloanding">
      <div>
        {/* <p>Loading...</p> */}
        <PuffLoader color="#3C2CD1" />
      </div>
    </section>
  );
};

export default Loading;
