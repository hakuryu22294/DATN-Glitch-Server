import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  shipper_login,
  messageClear,
} from "../redux/store/reducers/authReducer";
import { useNavigate } from "react-router-dom";

const ShipperLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { successMessage, errorMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/shipper/dashboard");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(shipper_login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login{" "}
          <span className="p-3 rounded-lg bg-primary text-white">
            G-Express
          </span>{" "}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              className="input input-bordered w-full"
              placeholder="Nhập email của bạn"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-control mb-6">
            <label htmlFor="password" className="label">
              <span className="label-text">Mật khẩu</span>
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered w-full"
              placeholder="Nhập mật khẩu của bạn"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShipperLogin;
