import React, { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { deleteTransactions, addTransaction, editTransactions } from "../../utils/ApiRequest";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from "react-bootstrap";

const TableData = (props) => {

  
    const navigate = useNavigate(); 
    const toastOptions = {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    };

    const [cUser , setcUser ] = useState(null);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [values, setValues] = useState({
        title: "",
        amount: "",
        description: "",
        category: "",
        date: "",
        transactionType: "",
    });
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [currId, setCurrId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user")); // Assuming user is stored in local storage
        setcUser (user);
        setTransactions(props.data);
    }, [props.data, refresh]);

    const handleShow = () => {
        setShow(true);
        setValues({
            title: "",
            amount: "",
            description: "",
            category: "",
            date: "",
            transactionType: "",
        });
        setEditingTransaction(null);
    };

    const handleClose = () => {
        setShow(false);
        setEditingTransaction(null);
        setCurrId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { title, amount, description, category, date, transactionType } = values;

    if (!title || !amount || !description || !category || !date || !transactionType) {
        toast.error("Please enter all the fields", toastOptions);
        return;
    }

    setLoading(true);
    try {
        const { data } = await axios.post(addTransaction, {
            title,
            amount,
            description,
            category,
            date,
            transactionType,
            userId: cUser._id,
        });
        setTransactions(data.transactions);
        if (data.success) {
            toast.success(data.message, toastOptions);
            handleClose();
            if (props.setRefresh) props.setRefresh((prev) => !prev); // Use setRefresh from props
        } else {
            toast.error(data.message, toastOptions);
        }
    } catch (error) {
        console.error("Add transaction request failed:", error);
        toast.error("Failed to add transaction", toastOptions);
    } finally {
        setLoading(false);
    }
};


    const handleEditSubmit = async () => {
        try {
            const { data } = await axios.post(`${editTransactions}/${currId}`, {
                ...values,
                userId: cUser ._id, // Ensure you are sending the user ID correctly
            });

            if (data.success) {
                toast.success(data.message, toastOptions);
                handleClose();
                setRefresh((prev) => !prev);
            } else {
                console.error("Edit error:", data.message);
                toast.error(data.message, toastOptions);
            }
        } catch (error) {
            console.error("Edit request failed:", error);
            toast.error("Edit request failed", toastOptions);
        }
    };

  const handleDeleteClick = async (itemKey) => {
    try {
      const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
        userId: props.user._id,
      });
      if (data.success) {
        setRefresh((prev) => !prev); // ✅ safer toggle
      } else {
        console.error("Delete error:", data.message);
      }
    } catch (error) {
      console.error("Delete request failed:", error);
    }
  };
  return (
    <>
      <Row className="mt-4 w-100">
        <Col md={4} sm={12} style={{ padding: "10px" }}>
          
        </Col>
        <Col md={4} sm={12} style={{  padding: "10px" }}>
          
        </Col>
        <Col className="d-flex" md={4} sm={12} >
        <Button
        onClick={handleShow}
        variant="black"
        className="btn-dark m-0 ms-auto"
      >
        Add Expense
      </Button>
        </Col>
      </Row>
      
    <Container className="w-100">
     <div className="" style={{ display: 'flex', justifyContent: 'flex-end' }}>
      
    </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                type="text"
                value={values.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                name="amount"
                type="number"
                value={values.amount}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={values.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="Groceries">Groceries</option>
                <option value="Rent">Rent</option>
                <option value="Salary">Salary</option>
                <option value="Tip">Tip</option>
                <option value="Food">Food</option>
                <option value="Medical">Medical</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                type="text"
                value={values.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formType">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select
                name="transactionType"
                value={values.transactionType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="credit">Credit</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="dark" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </>
  );
};

export default TableData;
