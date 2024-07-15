import React from 'react';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="page404">
      <h2 className="title">Oops! Page not found</h2>
      {/* <p className='message'>The page you are looking for does not exist.</p> */}
      <div className="message">
        <Link href="/login">
          <button className="btn_primary">Back to login</button>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
