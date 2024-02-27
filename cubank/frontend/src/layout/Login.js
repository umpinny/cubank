import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
const Login = () => {
  const accountIdInputRef = useRef();
  const passwordInputRef = useRef();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, setIsPending] = useState(false);
  let navigate = useNavigate();

  function isNumeric(str) {
    if (typeof str != "string") return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    let allCheck = true;
    const accountId = accountIdInputRef.current.value;
    const password = passwordInputRef.current.value;
    console.log(accountId,password);
    if (accountId.length !== 10) {
      setError(true);
      setErrorMsg("Please fill accountId  10 digits");
      allCheck=false;
    }
    if (!isNumeric(accountId)) {
      setError(true);
      setErrorMsg("Please put accountId only number");
      allCheck=false;
    }
    if (password.length !== 4) {
      setError(true);
      setErrorMsg("Please fill password 4 digits");
      allCheck=false;
    }
    if (!isNumeric(password)) {
      setError(true);
      setErrorMsg("Please put password only number");
      allCheck=false;
    }

    if (allCheck) {
      AuthService.login(accountId, password).then(
        () => {
          setError(false)
          navigate("/account/");
          window.location.reload();
          setIsPending(false);
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Account Number:
          <input
            type="text"
            name="accountId"
            required
            cid = 'l1'
            placeholder="Please fill your account number 10 digits"
            id="accountId"
            ref={accountIdInputRef}
          />
        </label>
        <label>
          Password:
          <input
            type="text"
            name="password"
            required
            cid = 'l2'
            placeholder="Please fill your password number 4 digits"
            id="password"
            ref={passwordInputRef}
          />
          {error && (
            <div>
              <label cid='login-error-mes'>{errorMsg}</label>
            </div>
          )}
        </label>

        {!isPending && <button cid = 'lc'>Login</button>}
        {isPending && <button>Login...</button>}
      </form>
    </div>
  );
};

export default Login;
