import { createContext, useEffect, useState } from "react";

export const UserProvider = createContext()
const UserContext = ({ children }) => {
    const [user, setUser] = useState({})
    useEffect(() => {
        const { shop } = JSON.parse(localStorage.getItem('user'))
        setUser(shop)
    }, [])
    const dataUser = {
        user
    }

    return (
        <div>
            <UserProvider.Provider value={dataUser}>
                {children}
            </UserProvider.Provider>
        </div>
    );
};

export default UserContext;
