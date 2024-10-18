import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { overrideStyle } from "../utils";
import {
  get_user_info,
  login,
  messageClear,
} from "../redux/store/reducers/authReducer";
import { validationLoginSchema } from "../validations/validation";
// Custom email regex for additional validation

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state.auth
  );

  const validationSchema = validationLoginSchema;

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(get_user_info());
      navigate("/");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-xl font-bold mb-3 flex items-center">
            Welcome to{" "}
            <span className="bg-primary p-3 rounded-lg ml-2 text-white">
              G-Ecommerce
            </span>
          </h2>
          <p className="text-sm mb-3 font-medium">
            Please Sign In to your account
          </p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              dispatch(login(values));
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-control mb-3">
                  <label htmlFor="email" className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="form-control mb-3">
                  <label htmlFor="password" className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="input input-bordered"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  {loader ? (
                    <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                  ) : (
                    "Sign In"
                  )}
                </button>

                <Link
                  to={"/shipper/login"}
                  className="btn btn-secondary w-full mt-2"
                >
                  Shipper Login
                </Link>

                <div className="text-center my-3">
                  <p>
                    Don't have an account?{" "}
                    <Link className="text-primary font-bold" to="/register">
                      Sign Up
                    </Link>
                  </p>
                </div>

                <div className="divider">Or</div>

                <div className="flex justify-center gap-3 mt-3">
                  <div className="btn btn-outline btn-info">
                    <FaGoogle />
                    <span className="ml-2">Google</span>
                  </div>

                  <div className="btn btn-outline btn-primary">
                    <FaFacebook />
                    <span className="ml-2">Facebook</span>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
