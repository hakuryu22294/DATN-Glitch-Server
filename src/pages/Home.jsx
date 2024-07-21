import { useContext } from "react";
import Footer from "../layouts/Footer";
import Header from "../layouts/Header";
import Navigation from "../layouts/Navigation";
import Section from "../layouts/Section";
import MainContent from "../layouts/MainContent";
import LoginContainer from "../containers/LoginContainer";
import RegisterContainer from "../containers/RegisterContainer";
import { ShowUiContext } from "../hooks/ShowUiContext";

const Home = () => {
    const { toogleShow , formType   } = useContext(ShowUiContext);

    return (
        <>
            <Header />
            <Navigation/>
            <Section />
            <MainContent />
            <Footer />
            <div>
            {toogleShow && formType  === 'login' && <LoginContainer />}
            {toogleShow && formType  === 'register' && <RegisterContainer />}
            </div>
        </>
    );
};

export default Home;
