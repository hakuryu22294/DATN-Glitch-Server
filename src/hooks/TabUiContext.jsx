import { createContext, useState } from "react";
export const TabContent = createContext()
const TabUiContext = ({ children }) => {
    const [tab, setTab] = useState(null);
    const handleTabUi = (next) => {
        setTab(next)
    }
    const data = {
        tab,
        handleTabUi
    }
    return (
        <div>
            <TabContent.Provider value={data}>
                {children}
            </TabContent.Provider>
        </div>
    );
};

export default TabUiContext;