import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  admin_login,
  getUserInfo,
  messageClear,
} from "../../../redux/store/reducers/authReducer";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    dispatch(admin_login({ info: state }));
  };

  const overrideStyle = {
    display: "flex",
    margin: "0 auto",
    height: "24px",
    justifyContent: "center",
    alignItems: "center",
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(getUserInfo());
      navigate("/admin/dashboard");
    }
  }, [errorMessage, successMessage, navigate, dispatch]);

  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center bg-base-200">
      <div className="w-full max-w-md p-6 shadow-xl bg-base-300 rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-base-content mt-4">
            Admin Login
          </h2>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              onChange={inputHandle}
              value={state.email}
              type="email"
              name="email"
              id="email"
              className="input input-bordered w-full"
              placeholder="Email"
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <input
              onChange={inputHandle}
              value={state.password}
              type="password"
              name="password"
              id="password"
              className="input input-bordered w-full"
              placeholder="Password"
              required
            />
          </div>

          <div className="form-control mt-6">
            <button
              disabled={loader ? true : false}
              className={`btn w-full mb-3 ${
                loader ? "btn-disabled" : "btn-primary"
              }`}
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "Login"
              )}
            </button>
            <Link to="/login" className=" btn btn-primary w-full">
              Đăng nhập người dùng
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
