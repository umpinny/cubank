import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Register = () => {
  const accountIdInputRef = useRef();
  const passwordInputRef = useRef();
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  // const [accountId, setAccountId] = useState(
  //   "Please fill your account number 10 digits"
  // );
  // const [password, setPassword] = useState(
  //   "Please fill your password number 4 digits"
  // );
  // const [firstName, setFirstName] = useState("Please fill firstName");
  // const [lastName, setLastName] = useState("Please fill lastName");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  function isNumeric(str) {
    if (typeof str != "string") return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    );
  }
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    setIsPending(true);
    e.preventDefault();
    let allCheck = true;
    const accountId = accountIdInputRef.current.value;
    const password = passwordInputRef.current.value;
    const firstName = firstNameInputRef.current.value;
    const lastName = lastNameInputRef.current.value;
    if (accountId.length !== 10) {
      setError(true);
      setErrorMsg("Please fill accountId  10 digits");
      allCheck = false;
    }
    if (!isNumeric(accountId)) {
      setError(true);
      setErrorMsg("Please put accountId only number");
      allCheck = false;
    }
    if (password.length !== 4) {
      setError(true);
      setErrorMsg("Please fill password 4 digits");
      allCheck = false;
    }
    if (!isNumeric(password)) {
      setError(true);
      setErrorMsg("Please put password only number");
      allCheck = false;
    }
    if (firstName.trim().length + lastName.trim().length > 29) {
      setError(true);
      setErrorMsg("your name length is exceed 30 digits");
      allCheck = false;
    }
    
    if (allCheck) {
      let name = firstName.trim() + " " + lastName.trim();
      const user = { accountId, password, name };
      AuthService.register(user).then(
        (response) => {
          setIsPending(false);
          alert("success");
          navigate("/");
        },
        (error) => {
          console.log(error.response.data.msg);
          setIsPending(false);
          setError(true);
          setErrorMsg(error.response.data.msg);
          // console.log(resMessage);
        }
      );
    } else {
      setIsPending(false);
    }
  };
  return (
    <div className="input-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Account Number:
          <input
            type="text"
            name="accountId"
            required
            placeholder="Please fill your account number 10 digits"
            id="accountId"
            cid = "r1"
            ref={accountIdInputRef}
          />
        </label>
        <label>
          Password:
          <input
            type="text"
            name="password"
            required
            placeholder="Please fill your password number 4 digits"
            id="password"
            cid = "r2"
            ref={passwordInputRef}
          />
        </label>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            required
            placeholder="Please fill your first name"
            id="firstName"
            cid = "r3"
            ref={firstNameInputRef}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            required
            placeholder="Please fill your last name"
            id="lastName"
            cid = "r4"
            ref={lastNameInputRef}
          />
        </label>
        {error && (
            <div>
              <label cid='register-error-mes'>{errorMsg}</label>
            </div>
          )}
        {!isPending && <button cid='rc'>Register</button>}
        {isPending && <button>Registering new user...</button>}
      </form>
    </div>
  );
};

export default Register;
