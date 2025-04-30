import { React, useContext, useState } from "react";
import AuthContext from "../context/AuthContext.js";
import { useNavigate } from 'react-router-dom';
import './style/LoginPage.css';


// import { React, useContext } from "react";
// import AuthContext from "../context/AuthContext.js";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();


  return (
    <div className="signin-page">
      <div className="signin-container">
      <h2>Sign In </h2> 
      <form onSubmit={loginUser} className= "signin-form">
        <div className="form-item">
          <label htmlFor="username">Username</label>
          <input 
            type="text"
            name="username" 
            placeholder="Enter username" />
        </div>
        <div className="form-item">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password" />
        </div>
          <button type="submit" className="signin-button" >Sign In</button>
      </form>

      <div className='bottom'>
        
        <div className='text'>
          <span className="line"></span>
            <p>New to baksReader?</p>
          <span className="line"></span>
        </div>
        
        <button className="signup-button" onClick={() => navigate('/signup')}>Sign Up</button>
      
      </div>
    
    </div>  

    </div>
  );
};

export default LoginPage;


// const LoginPage = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { loginUser } = useContext(AuthContext);
//   const navigate = useNavigate();



//     return (
//         <div className="signin-container">
//             <h2>Sign In </h2> 
//             {/* {user?.full_name} */} 
//             <form onSubmit={loginUser} className="signin-form">

//                     <LabelInput
//                         label= "Username"
//                         type="text" 
//                         name="username" 
//                         placeholder="Enter username"
//                         value = {username}
//                         required
//                         onChange={(e) => setUsername(e.target.value)}/>

                
//                     <LabelInput
//                         label = "Password"
//                         type="password"
//                         id="password"
//                         name ="password"
//                         value={password}
//                         required
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="Enter your password"
//                     />
//                   <ActionButton type="submit" label="Sign In" stretched={true} />
//             </form>
            
//             <div className='bottom'>
//                 <div className='text'>
//                     <span className="line"></span>
//                     <p>New to baksReader?</p>
//                     <span className="line"></span>
//                 </div>
//                 <OutlineButton className = "signup-button" label="Sign Up" stretched={true} onClick={() => navigate('/signup')} />
//             </div>
//         </div>

//     );
// }

// export default LoginPage;

