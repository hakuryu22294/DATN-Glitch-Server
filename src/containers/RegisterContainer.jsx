
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import RegisterUserContainer from './RegisterUserContainer';
import RegisterShopContainer from "./RegisterShopContainer";
import { ShowUiContext } from '../hooks/ShowUiContext';
const RegisterContainer = () => {
    const { handleToogleForm } = useContext(ShowUiContext);
    const [uiForm, setUiForm] = useState(1)
    return createPortal(
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => handleToogleForm(false)}></div>
            <div className="bg-[#fff] shadow rounded-[5px] p-5 fixed z-50 top-[10%] left-[35%] w-[400px]">



                {uiForm === 1 && (<RegisterShopContainer
                    setUiForm={setUiForm}
                />)}

                {uiForm === 2 && (<RegisterUserContainer
                    setUiForm={setUiForm}
                />)}



            </div>


        </>,
        document.getElementById('portal-root')
    );
};

export default RegisterContainer;
