import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../utils";
import { register, messageClear } from "../redux/store/reducers/authReducer";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );

  const [state, setState] = useState({
    name: "",
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
    dispatch(register(state));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">Register</h2>
          <p className="text-center mb-4">Please create your account</p>
          <form onSubmit={submit}>
            <div className="form-control mb-4">
              <label htmlFor="name" className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                onChange={inputHandle}
                value={state.name}
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                onChange={inputHandle}
                value={state.email}
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                onChange={inputHandle}
                value={state.password}
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="cursor-pointer flex items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mr-2"
                  id="checkbox"
                  required
                />
                <span className="label-text">
                  I agree to the privacy policy & terms
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mb-4"
              disabled={loader}
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="text-center mb-4">
            <p>
              Already have an account?{" "}
              <Link className="text-primary font-bold" to="/login">
                Sign In
              </Link>
            </p>
          </div>

          <div className="divider">OR</div>

          <div className="flex justify-center gap-4">
            <button className="btn btn-outline btn-error flex items-center gap-2">
              <FaGoogle />
              Google
            </button>
            <button className="btn btn-outline btn-primary flex items-center gap-2">
              <FaFacebook />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
