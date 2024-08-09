import React, { useEffect } from "react";
import instanceApi from "../configs/api.config";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  console.log(token);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await instanceApi
      .get(`/verify/shipper/${token}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return <div>VerifyEmail</div>;
};

export default VerifyEmail;
