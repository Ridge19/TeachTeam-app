// THIS HAS BEEN DISABLED AS WE ARE NO LONGER USING LOCAL STORAGE.


// import { useState, useEffect } from "react";
// import { User, DEFAULT_USERS } from "../types/user"; // Import from your user.ts

// // useLocalStorageUsers hook to manage users in local storage
// // this hook is used to get users from local storage and set default users if none are found
// // it also provides a function to add a new user to the users array and update local storage
// // this hook is used in the SignUp component to add a new user to the users array and update local storage

// export function useLocalStorageUsers(): [User[], (newUser: User) => void] {
//   const [users, setUsers] = useState<User[]>([]); // create array called users 

//   useEffect(() => {
//     try {
//       // get stored users in localstored
//       const stored = localStorage.getItem("users"); 
//       if (stored) {
//         setUsers(JSON.parse(stored));
//       } else {
//         //otherwise, if none are found, set default users in localstorage
//         localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
//         setUsers(DEFAULT_USERS);
//       }
//     } catch (error) { // if error occurs, log it to the console
//       console.error("Failed to load users from localStorage", error);
//     }
//   }, []);

//   // function to add a new user to the users array and update local storage
//   // this function takes a new user as an argument and adds it to the users array
//   const addUser = (newUser: User) => {
//     const updatedUsers = [...users, newUser];
//     setUsers(updatedUsers);
//     localStorage.setItem("users", JSON.stringify(updatedUsers));
//   };

//   return [users, addUser];
// }
