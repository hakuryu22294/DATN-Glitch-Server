import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaKey,
  FaShippingFast,
  FaPhone,
  FaUser,
  FaHome,
} from "react-icons/fa";
import {
  create_shipper,
  messageClear,
} from "../../../redux/store/reducers/shipperReducer";

const CreateShipper = () => {
  const dispatch = useDispatch();
  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.shipper
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(create_shipper(formData));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="w-[90%] grid grid-cols-2 mx-auto my-[20px] rounded-xl shadow-md overflow-hidden">
      <div className="p-16">
        <h1 className="text-[20px] font-bold text-neutral text-6xl">
          Create Shipper
        </h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <Input
            icon={<FaUser />}
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            icon={<FaEnvelope />}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            icon={<FaKey />}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            icon={<FaPhone />}
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            icon={<FaHome />}
            name="address"
            type="text"
            onChange={handleChange}
            value={formData.address}
          />
          <Button type="submit" text="Submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center gap-4">
        <FaShippingFast color="white" size={100} />
        <h1 className="text-[50px] font-bold text-white text-6xl">
          Glitch Express
        </h1>
      </div>
    </div>
  );
};

export default CreateShipper;
