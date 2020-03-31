// import React, { useState, useContext } from "react";
// import { withRouter } from "react-router-dom";
// import {
//   Button,
//   Form,
//   FormGroup,
//   FormFeedback,
//   Label,
//   Input
// } from "reactstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

// // import MainContext from "../../../context/mainContext";

// import "./SignupForm.css";

// const SignupForm = ({ history }) => {
//   const [username, setUsername] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordConfirm, setPasswordConfirm] = useState("");
//   const [checked, setChecked] = useState(false);

//   const [usernameValid, setUsernameValid] = useState("");
//   const [usernameFeedback, setUsernameFeedback] = useState("");
//   const [nameValid, setNameValid] = useState("");
//   const [passwordValid, setPasswordValid] = useState("");
//   const [passwordConfirmValid, setPasswordConfirmValid] = useState("");
//   const [checkedValid, setCheckedValid] = useState("");

// //   const mainContext = useContext(MainContext);

//   const validateUsername = async () => {
//     if (username === "") {
//       setUsernameValid("false");
//       setUsernameFeedback("Email should not be empty.");
//       return;
//     }

//     const response = await mainContext.validateUsername(username);

//     if (response === "true") {
//       setUsernameValid("true");
//     } else {
//       setUsernameValid("false");
//       setUsernameFeedback("Email is already taken.");
//     }
//   };

//   const validateName = () => {
//     if (name === "") {
//       setNameValid("false");
//     } else {
//       setNameValid("true");
//     }
//   };

//   const validatePassword = () => {
//     if (password === "") {
//       setPasswordValid("false");
//     } else {
//       setPasswordValid("true");
//     }
//   };

//   const validatePasswordConfirm = () => {
//     if (password === passwordConfirm && passwordConfirm !== "") {
//       setPasswordConfirmValid("true");
//     } else {
//       setPasswordConfirmValid("false");
//     }
//   };

//   const validateChecked = () => {
//     if (checked === true) {
//       setCheckedValid("true");
//     } else {
//       setCheckedValid("false");
//     }
//   };

//   const handleSignup = () => {
//     validateChecked();
//     validatePasswordConfirm();
//     validatePassword();
//     validateName();
//     validateUsername();

//     if (checked === false) {
//       return;
//     }

//     if (
//       usernameValid === "true" &&
//       nameValid === "true" &&
//       passwordValid === "true" &&
//       passwordConfirmValid === "true"
//     ) {
//       mainContext.signup(password, username);
//     }
//   };

//   return (
//     <div className="signup-wrapper">
//       <div className="signup-form">
//         <div className="header">
//           <img
//             src={process.env.PUBLIC_URL + "/images/bp_logo.svg"}
//             alt="bear"
//           />
//           <h3>Sign up to start riding</h3>
//           <p>
//             Use your <span className="blue-text">university email</span> to
//             create your account!
//           </p>
//         </div>
//         <div className="form">
//           <Form>
//             <FormGroup
//               style={{
//                 marginTop: "15px",
//                 width: "317px"
//               }}
//             >
//               <Input
//                 valid={usernameValid === "true"}
//                 invalid={usernameValid === "false"}
//                 style={{ width: "205px", display: "inline" }}
//                 type="email"
//                 name="email"
//                 id="email"
//                 placeholder="youruniversityemail"
//                 value={username}
//                 onChange={e => setUsername(e.target.value)}
//                 onBlur={validateUsername}
//               />
//               <div
//                 style={{
//                   fontSize: "20px",
//                   marginLeft: "5px",
//                   display: "inline"
//                 }}
//               >
//                 @g.ucla.edu
//               </div>
//               <FormFeedback style={{ marginLeft: "2px" }} invalid="true">
//                 {usernameFeedback}
//               </FormFeedback>
//             </FormGroup>
//             <FormGroup style={{ width: "317px" }}>
//               <Input
//                 valid={nameValid === "true"}
//                 invalid={nameValid === "false"}
//                 type="name"
//                 name="name"
//                 id="name"
//                 placeholder="Name (i.e. Joe, Josephine)"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 onBlur={validateName}
//               />
//               <FormFeedback style={{ marginLeft: "2px" }} invalid="true">
//                 Name should not be empty.
//               </FormFeedback>
//             </FormGroup>
//             <FormGroup style={{ width: "317px" }}>
//               <Input
//                 valid={passwordValid === "true"}
//                 invalid={passwordValid === "false"}
//                 type="password"
//                 name="password"
//                 id="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 onBlur={validatePassword}
//               />
//               <FormFeedback style={{ marginLeft: "2px" }} invalid="true">
//                 Password should not be empty.
//               </FormFeedback>
//             </FormGroup>
//             <FormGroup style={{ width: "317px" }}>
//               <Input
//                 valid={passwordConfirmValid === "true"}
//                 invalid={passwordConfirmValid === "false"}
//                 type="password"
//                 name="password-confirm"
//                 id="password-confirm"
//                 placeholder="Password Confirmation"
//                 value={passwordConfirm}
//                 onChange={e => setPasswordConfirm(e.target.value)}
//                 onBlur={validatePasswordConfirm}
//               />
//               <FormFeedback style={{ marginLeft: "2px" }} invalid="true">
//                 Passwords are not matching.
//               </FormFeedback>
//             </FormGroup>
//             <FormGroup style={{ marginLeft: "21px" }}>
//               <Label check style={{ color: "#B2B2B2", fontSize: "15px" }}>
//                 <Input
//                   invalid={checkedValid === "false"}
//                   type="checkbox"
//                   checked={checked}
//                   onChange={e => setChecked(e.target.checked)}
//                 />
//                 <div>
//                   Agree to{" "}
//                   <span className="terms-and-conditions">
//                     Terms and Conditions
//                   </span>
//                 </div>
//                 <FormFeedback invalid="true">
//                   <FontAwesomeIcon
//                     icon={faExclamationTriangle}
//                     style={{
//                       display: "inline",
//                       marginLeft: "-19px",
//                       width: "14px",
//                       height: "14px"
//                     }}
//                   />
//                   <div
//                     style={{
//                       display: "inline",
//                       marginLeft: "5px"
//                     }}
//                   >
//                     Please agree to terms and conditions.
//                   </div>
//                 </FormFeedback>
//               </Label>
//             </FormGroup>
//             <div className="form-buttons">
//               <Button
//                 onClick={handleSignup}
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   letterSpacing: "1px",
//                   width: "150px",
//                   height: "34px",
//                   display: "flex",
//                   borderRadius: "17px",
//                   backgroundColor: "#3D77FF",
//                   borderWidth: "0px",
//                   flexDirection: "row",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   textAlign: "center",
//                   marginRight: "18px"
//                 }}
//               >
//                 <div style={{ marginTop: "-3px" }}>Sign Up</div>
//               </Button>
//               <Button
//                 onClick={() => history.push("/login")}
//                 style={{
//                   fontSize: "18px",
//                   fontWeight: "bold",
//                   letterSpacing: "1px",
//                   width: "150px",
//                   height: "34px",
//                   display: "flex",
//                   borderRadius: "17px",
//                   backgroundColor: "white",
//                   color: "#A2A2A2",
//                   borderWidth: "1px",
//                   borderColor: "#B2B2B2",
//                   flexDirection: "row",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   textAlign: "center"
//                 }}
//               >
//                 <div style={{ marginTop: "-3px" }}>Sign In</div>
//               </Button>
//             </div>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default withRouter(SignupForm);