import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import toast from "react-hot-toast";
import { FaEnvelope, FaKey, FaUser, FaPhoneAlt } from "react-icons/fa";
import {
  create_shipper,
  messageClear,
} from "../../../redux/store/reducers/shipperReducer";
import axios from "axios";

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
    address: "", // address will be the province selected
  });

  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        if (response.data.error === 0) {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

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
    <div className="w-[60%] rounded-xl bg-base-100 shadow-md mx-auto overflow-hidden">
      <div className="p-16">
        <h1 className="text-[20px] font-bold text-base-content text-6xl">
          Create Shipper
        </h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <Input
            icon={<FaUser />}
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <Input
            icon={<FaEnvelope />}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <Input
            icon={<FaKey />}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <Input
            icon={<FaPhoneAlt />}
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />

          {/* Province Dropdown */}
          <select
            className="input input-bordered w-full mt-3"
            name="address"
            value={formData.address}
            onChange={handleChange} // bind to formData
          >
            <option value="">Chọn nơi làm việc</option>
            {provinces.map((province) => (
              <option value={province.name} key={province.id}>
                {province.name}
              </option>
            ))}
          </select>

          <div className="mt-3 flex justify-end">
            <Button type="submit" text="Submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShipper;
