import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import UserService from '../services/authService/userService';
import { validationRegisterShop } from '../config/yup/validateForm';
const RegisterShopContainer = ({setUiForm}) => {
    const [isFormFilled, setIsFormFilled] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validationSchema: validationRegisterShop, 
        onSubmit: async (values) => {
                const data = await UserService.RegisterAccountShop(values);
                if (!data) {
                    return;
                }
                formik.resetForm();
               
               
        }
    });

    useEffect(() => {
        setIsFormFilled(formik.values.name && formik.values.email && formik.values.password);
    }, [formik.values]);
    return (
        <>
             <form method='POST' onSubmit={formik.handleSubmit}>
                    <div>
                        <h1 className='text-[25px] font-bold'>Xin chào</h1>
                        <span className='block text-[15px]'>Đăng ký tài khoản Shop</span>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Nhập tên" 
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur} 
                            value={formik.values.name} 
                            className='block border-2 border-slate-200 p-2 rounded-[5px] w-full my-3' 
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="text-rose-500">{formik.errors.name}</div>
                        ) : null}
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
                                Đăng ký
                            </button>
                        </div>
                        <div>
                            <span  className='text-rose-600 block pt-2 cursor-pointer'  onClick={()=>setUiForm(2)}>Đăng nhập với tư cách <b> khách hàng</b></span>
                        </div>
                    </div>
              
            </form>
        </>
 
    );
};

export default RegisterShopContainer;