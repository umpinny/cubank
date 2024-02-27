import axios from "axios";
import authHeader from "./auth-header";



const getAccount = (accountId) => {
  let data = JSON.parse(localStorage.getItem("user"));
  fetch("http://localhost:4000/api/v1/transactions/" + accountId, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    })
    .catch((err) => console.log(err));
};

//
const getMyAccount = () => {
  let data = JSON.parse(localStorage.getItem("user"));
  fetch("http://localhost:4000/api/v1/transactions/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    })
    .catch((err) => console.log(err));
};

//

const withdraw = (among) => {
  return axios.put(
    API_URL,
    {
      action: "withdraw",
      balance: among,
    },
    { headers: authHeader() }
  );
};

const deposit = (among) => {
  return axios.put(
    API_URL,
    {
      action: "deposit",
      balance: among,
    },
    { headers: authHeader() }
  );
};

const transfer = async (target, among) => {
  return axios.put(
    API_URL,
    {
      action: "transfer",
      target: target,
      balance: among,
    },
    { headers: authHeader() }
  );
};

const billPayment = (target, among) => {
  return axios.put(
    API_URL,
    {
      action: "billpayment",
      target: target,
      balance: among,
    },
    { headers: authHeader() }
  );
};

const AccountService = {
  getAccount,
  withdraw,
  deposit,
  transfer,
  billPayment,
  getMyAccount,
};

export default AccountService;
