import { createContext, useState } from "react";

export const ShowUiContext = createContext();

const ShowUiProvider = ({ children }) => {
    const [toogleShow, setToogleShow] = useState(false);
    const [formType, setFormType] = useState(null);
    const handleToogleForm = (type) => {
        setToogleShow(true);
        setFormType(type);
    };


    const data = {
        formType,
        toogleShow,
        handleToogleForm
    };

    return (
        <ShowUiContext.Provider value={data}>
            {children}
        </ShowUiContext.Provider>
    );
};

export default ShowUiProvider;
