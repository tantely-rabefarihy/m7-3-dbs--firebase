import React, { createContext, useEffect, useState } from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyBUkKFyvfr28_T3WzHTQcQAyN-5yBsdv6I",
  authDomain: "user-app-332b0.firebaseapp.com",
  databaseURL: "https://user-app-332b0.firebaseio.com",
  projectId: "user-app-332b0",
  storageBucket: "user-app-332b0.appspot.com",
  messagingSenderId: "76199671786",
  appId: "1:76199671786:web:0a66876481f4cae9466493",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = { googleProvider: new firebase.auth.GoogleAuthProvider() };

export const AppContext = createContext(null);

const AppProvider = ({ children, signInWithGoogle, user, signOut }) => {
  const [appUser, setAppUser] = useState({});
  const [message, setMessage] = useState("");

  const handleSignOut = () => {
    signOut();
    setAppUser({});
  };

  useEffect(() => {
    if (user) {
      fetch(`/users`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          setAppUser(json.data);
          setMessage(json.message);
        });
      // setAppUser({
      //   displayName: user.displayName,
      //   email: user.email,
      //   photoURL: user.photoURL,
      // });
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{ appUser, signInWithGoogle, handleSignOut, message }}
    >
      {children}
    </AppContext.Provider>
  );
};

// export default AppProvider;
export default withFirebaseAuth({ providers, firebaseAppAuth })(AppProvider);
