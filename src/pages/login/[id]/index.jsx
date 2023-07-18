import React from "react";
import PropTypes from "prop-types";
import Modal from "@/Components/Modal";
import Login from "..";
import Link from "next/link";
import ImageSvg from "@/helpers/ImageSVG";

function LoginConfirmed(props) {
  console.log("login confirmed");

  return (
    <section>
      <Login />
      <Modal open={true}>
      <ImageSvg name='Check' />
        <div>verified Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit quis laudantium, nihil placeat nemo eum recusandae dolorem quibusdam eligendi dolor reiciendis iusto quia fugiat ipsum architecto sapiente optio accusamus animi.</div>
        <div className="actions">
          <Link href=" " passHref>
          <div className="btn_primary small" >NEXT</div>
          </Link>
        </div>
      </Modal>
    </section>
  );
}

// index.propTypes = {

// }

export default LoginConfirmed;
