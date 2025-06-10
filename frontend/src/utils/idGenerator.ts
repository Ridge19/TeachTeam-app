// This file is part of the application.
// It is responsible for generating unique application IDs for each application.
// The IDs are stored in local storage and incremented each time a new application is created.
// It is used in the application form which helps identify each tutors application.
// it increments from 200 (starting from 200).


// DONT NEED THIS FILE AS WE ARE USING THE BACKEND API TO FETCH APPLICATIONS. 
// SINCE IT GENERATES UNIQUE APPLICATION IDs FOR EACH APPLICATION, WE CANNOT COMMENT IT OUT. 

export function generateApplicationId(): string {
  const stored = localStorage.getItem("appIdCounter");
  const current = stored ? Number(stored) : 200;
  const id = `App${current}`;
  localStorage.setItem("appIdCounter", (current + 1).toString());
  return id;
}
