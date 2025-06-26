import React from "react";
import "./RecentTra.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faTrash, faEdit,faShoppingBasket, faUtensils, faLightbulb, faBus, faFilm } from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";  
import { useEffect, useState } from "react";
import axios from "axios";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import moment from "moment";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TableData from "./TableData";

import Footer from "./Footer";
function RecentTra() {

  
const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(false);
const [refresh, setRefresh] = useState(false);
const [frequency, setFrequency] = useState("7");
const [type, setType] = useState("all");
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [cUser, setcUser] = useState();



useEffect(() => {
  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      setcUser(user);

      const { data } = await axios.post(getTransactions, {
        userId: user._id,
        frequency: frequency,
        startDate: startDate,
        endDate: endDate,
        type: type,
      });

      console.log(user._id, frequency, startDate, endDate, type); 
      console.log(data);
      setTransactions(data.transactions);
      setLoading(false);
      
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  if (localStorage.getItem("user")) {
    fetchAllTransactions();
    console.log(transactions);
  }
}, [refresh, frequency, endDate, type, startDate]);



  return (
    <div className="app-container">
      <Header/>
      <TableData setRefresh={setRefresh}/>
      <main>
        <div className="content">
          <h2>Recent Transactions</h2> <br/>

          <div className="transactions">
            { transactions.map((transactions) => (
          <Card
            key={transactions._id}
            keyId={transactions._id}
            category={transactions.category}
            amount={transactions.amount}
            color={transactions.transactionType === "credit" ? "#21b400" : "#e50000"}
            
            icon={transactions.icon}
            user={cUser}
            date={transactions.date.split("T")[0]}
            setRefresh={setRefresh}
          />
            ))
            }
        
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
}





const Card = ({
  keyId,
  category,
  amount,
  color,
  date,
  icon,
  user,
  data,
  setRefresh,
}) => {
  const [show, setShow] = useState(false);
  const [currId, setCurrId] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState({});
  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleEditClick = (itemKey) => {
    const editTran = data.find((item) => item._id === itemKey);
    if (editTran) {
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      setValues({
        title: editTran.title || "",
        amount: editTran.amount || "",
        description: editTran.description || "",
        category: editTran.category || "",
        date: moment(editTran.date).format("YYYY-MM-DD") || "",
        transactionType: editTran.transactionType || "",
      });
      handleShow();
    }
  };

  const handleDeleteClick = async (itemKey) => {
    try {
      const { data } = await axios.post(
        `${deleteTransactions}/${itemKey}`,
        {
          userId: user,
        }
      );
      if (data.success) {
        setRefresh((prev) => !prev);
        
      } else {
        console.error("Delete error:", data.message);
      }
    } catch (error) {
      console.error("Delete request failed:", error);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div className="card">
      <div className="category">{category}</div>
      <div className="amount" style={{ color }}>₹{amount}</div>
      <div className="date">{date}</div>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: "10px",
        }}
      >
        <EditNoteIcon/>
          {/*
          onClick={() => handleEditClick(keyId)}
          */
          }
        
        <DeleteForeverIcon
          sx={{ color: "black", cursor: "pointer" }}
          onClick={() => handleDeleteClick(keyId)}
        />
      </div>
    </div>
  );
};


export default RecentTra;
