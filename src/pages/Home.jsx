import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Header />
      <div className="my-5 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Home;
