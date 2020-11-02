import React, { useState } from 'react';
//import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import firebase from "firebase/app"
//firebase.initializeApp({ ... })

firebase.initializeApp(firebaseConfig);

function App(){
  const [NewUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn : false,
    NewUser: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
    })
    const provider = new firebase.auth.GoogleAuthProvider();
    const handleSignIn = () => {
      firebase.auth().signInWithPopup(provider)
      .then(res => {
        const {displayName, photoURL, email} = res.user
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        console.log(res.user)
        setUser(signedInUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
    }
    const handleSignOut = () => {
      firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signOutUser);
      }).catch(err => {

      });
    }
    const handleBlur = (e) =>{
      let isFormvalid = true;
      console.log(e.target.name, e.target.value);
      if(e.target.name === 'email'){
       isFormvalid = /\S+@\S+\.\S+/.test(e.target.value)
        //console.log(isEmailValid)
      }
      if(e.target.name === 'Password'){
        const isPasswordvalid = e.target.value.length >6;
        const PasswordHasNumber = /\d{1 }/.test(e.target.value);
       isFormvalid = isPasswordvalid && PasswordHasNumber;
        // console.log(passwordHasNumber)
        //console.log(isPasswordvalid)
      }
      if(isFormvalid){
         const newUserInfo = {...user};
         newUserInfo[e.target.name] = e.target.value;
         setUser(newUserInfo);
      }
    }
    const handleSubmit=(e)=>{
      if (NewUser && user.email && user.password){
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = {...user};
          newUserInfo.error='';
          newUserInfo.success=true;
          setUser(newUserInfo);
         updateUserName(user.name);
          //console.log(res)
        })
        .catch(error => {
          // Handle Errors here.
          const newUserInfo ={...user};
          newUserInfo.error=error.message;
          newUserInfo.success=false;
          setUser(newUserInfo)
          //var errorCode = error.code;
          //var errorMessage = error.message;
          //console.log(errorCode, errorMessage);
          // ...
        });
        //console.log('submitting')
      }
if(!NewUser && user.email && user.password){
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res =>{
    const newUserInfo = {...user};
          newUserInfo.error='';
          newUserInfo.success=true;
          setUser(newUserInfo);
         console.log('sign in user info', res.user);  
  } )
  .catch(error => {
    const newUserInfo ={...user};
          newUserInfo.error=error.message;
          newUserInfo.success=false;
          setUser(newUserInfo)
    // Handle Errors here.
    //var errorCode = error.code;
    //var errorMessage = error.message;
    // ...
  });
}

      e.preventDefault();
    }
    const updateUserName = name =>{
      const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
  //photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(function() {
  console.log('user name updated successfully')
  // Update successful.
}).catch(function(error) {
  console.log(error)
  // An error happened.
});
    }

  return (
    <div style={{textAlign:"center"}}>
  {user.isSignedIn ? <button onClick={handleSignOut}>signOut</button> :
     <button onClick ={handleSignIn}>Sign In</button>
  }
  {
    user.isSignedIn && <div>
      <p>Welcome, {user.name}</p>
      <p>Your email: {user.email}</p>
        <img src={user.photo} alt=""/>
        </div>
  }
  <h1>Our Own Authentication</h1>
  <input type="checkbox" onChange={() => setNewUser(!NewUser)} name="NewUser"/>
  <label htmlFor="NewUser">New User Regtrd.</label>
  <form onSubmit={handleSubmit}>
  {NewUser &&<input type = "name" placeholder="Name"/>}
  <br/>
  <input type="text" name="email" onBlur={handleBlur} placeholder="email" required/>
  <br></br>
  
  <input type="Password" name="password" onBlur={handleBlur} placeholder="password"required/>
  <br></br>
  <input type="submit"  value="Submit"/>
  </form>
<p>{user.error}</p>
{user.success && <p>User {NewUser ? 'create' : 'logged In'} success  </p>}
    </div>
  );
}

export default App;