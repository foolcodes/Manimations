import Chat from "./Chat";
import logo from "/logo-without.png";

const App = () => {
  return (
    <div className="bg-[#131320] h-screen w-full flex items-center">
      <div className="absolute top-6 left-12 flex justify-center items-center">
        <img src={logo} className="h-10 w-11 mr-4" />
        <h1 className="text-white text-3xl" style={{ fontFamily: "Heading" }}>
          Manimations
        </h1>
      </div>
      <div className="w-full flex justify-center">
        <div className="max-w-3xl w-full">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default App;
