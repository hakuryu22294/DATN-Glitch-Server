import { useContext } from "react";
import { TabContent } from "../hooks/TabUiContext";

import AllProduct from "../contents/Home/AllProduct";
import Kitchen from "../contents/Home/Kitchen";

const MainContent = () => {
    const {tab} = useContext(TabContent)
    return (
        <>
            <div className="p-5">
            {tab === 1 && <AllProduct/> }
            {tab === 2 &&  <Kitchen/> }
            </div>
        </>
    );
};

export default MainContent;