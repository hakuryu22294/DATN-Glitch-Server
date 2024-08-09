/* eslint-disable react/prop-types */

const Input = ({ icon, name, type, value, onChange }) => {
  return (
    <label className="input input-ghost input-bordered flex items-center gap-2 my-4">
      {icon}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="grow"
        placeholder="Email"
      />
    </label>
  );
};

export default Input;
