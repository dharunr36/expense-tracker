import React, { useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";

import axios from "axios";

const ActionBox = (props) => {

    const [index, setIndex] = useState();


  const handleEditClick = async (e) => {
    e.preventDefault();
    setIndex(index);

  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, description, category, date, transactionType } =
      values;

    if (
      !title ||
      !amount ||
      !description ||
      !category ||
      !date ||
      !transactionType
    ) {
      toast.error("Please enter all the fields", toastOptions);
    }
    setLoading(true);

    const { data } = await axios.post(addTransaction, {
      title: title,
      amount: amount,
      description: description,
      category: category,
      date: date,
      transactionType: transactionType,
      userId: cUser._id,
    });

    if (data.success === true) {
      toast.success(data.message, toastOptions);
      handleClose();
      setRefresh(!refresh);
    } else {
      toast.error(data.message, toastOptions);
    }

    setLoading(false);
  };

  const handleDeleteClick = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="icons-handle">
        <EditNoteIcon sx={{ cursor: "pointer" }} onClick={handleSubmit} />
        <DeleteForeverIcon
          sx={{ color: "black", cursor: "pointer" }}
          onClick={handleDeleteClick}
        />
      </div>
    </>
  );
};

export default ActionBox;
