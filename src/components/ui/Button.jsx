const Button = ({ type, text }) => {
  return (
    <button
      type={type}
      className="btn bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
    >
      {text}
    </button>
  );
};

export default Button;
