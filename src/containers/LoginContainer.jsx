import { useFormik } from 'formik';
import { createPortal } from "react-dom";
import { useContext, useEffect, useState } from 'react';
import UserService from '../services/authService/userService';
import { ShowUiContext } from '../hooks/ShowUiContext';
import { validationLogin } from '../config/yup/validateForm';

const LoginContainer = () => {
    const { handleToogleForm } = useContext(ShowUiContext);
    const [isFormFilled, setIsFormFilled] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: validationLogin,
        onSubmit: async (values) => {

            const data = await UserService.LoginAccount(values);
   
                     if (!data.metadata.tokens) return

           
            localStorage.setItem('accessToken', JSON.stringify(data.metadata.tokens))
                      
            localStorage.setItem('user', JSON.stringify(data.metadata))

            handleToogleForm(false);

        }
    });

    useEffect(() => {
        setIsFormFilled(formik.values.email && formik.values.password);
    }, [formik.values]);

    return createPortal(
        <>
            <form method='POST' onSubmit={formik.handleSubmit}>
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => handleToogleForm(false)}></div>
                <div className="bg-[#fff] shadow rounded-[5px] p-5 fixed z-50 left-[35%] w-[450px] top-[10%]">
                    <div className="flex justify-end">
                        <span className="font-bold cursor-pointer" onClick={() => handleToogleForm(false)}>Thoát</span>
                    </div>
                    <div>
                        <h1 className='text-[25px] font-bold'>Xin chào</h1>
                        <span className='block'>Đăng nhập tài khoản</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Nhập Email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className='block border-2 border-slate-200 p-2 rounded-[5px] w-full my-3'
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-rose-500">{formik.errors.email}</div>
                        ) : null}
                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập Password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            className='block border-2 border-slate-200 p-2 rounded-[5px] w-full my-3'
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-rose-500">{formik.errors.password}</div>
                        ) : null}
                        <div className="flex justify-center pt-3">
                            <button
                                type="submit"
                                disabled={!isFormFilled}
                                className={`cursor-pointer w-full p-2 rounded-md font-bold ${isFormFilled ? 'bg-[#f1514f] text-white' : 'bg-[#ececec] text-[#999999]'}`}
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>,
        document.getElementById('portal-root')
    );
};

export default LoginContainer;
