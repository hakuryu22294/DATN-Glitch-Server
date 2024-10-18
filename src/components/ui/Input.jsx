/* eslint-disable react/prop-types */

const Input = ({ icon, name, type, value, onChange, placeholder }) => {
  return (
    <label className="input input-bordered flex items-center gap-2 my-4">
      {icon}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
};

export default Input;
