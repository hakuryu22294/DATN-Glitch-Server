
const ButtonDefault = (props) => {
    const {nameButton , style , onClick}  = props
    return (
        <div>
              <button onClick={onClick} className={`${style}`}>{nameButton}</button>
        </div>
    );
};

export default ButtonDefault;