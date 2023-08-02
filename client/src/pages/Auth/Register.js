import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [answer, setAnswer] = useState("");

  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const handlerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      if (response && response?.data?.success) {
        toast.success(response?.data && response?.data?.message);
        toast.success("User registered succefully");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
      console.log("Result", response);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };
  // console.log("env", re);
  return (
    <Layout title="Register Ecommerce App">
      <div className="form-container" style={{ minHeight: "90vh" }}>
        <form onSubmit={handlerSubmit}>
          <h4 className="title">Register Here</h4>
          <div className="mb-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              placeholder="Enter Your Name"
              id="exampleInputEmail1"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email"
              className="form-control"
              id="exampleInputPassword1"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Enter your password"
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              id="exampleInputPassword1"
              value={password}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              required
              className="form-control"
              placeholder="Enter your 
            phone No."
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              id="exampleInputPassword1"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={address}
              required
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              id="exampleInputPassword1"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="What is Your Favorite sports"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
