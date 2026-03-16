import axios from "axios";

const instance = axios.create({
  // baseURL: "https://sst-task-trail.vercel.app/api",
  baseURL: "http://localhost:3000/api",

  withCredentials: true,
});

export default instance;
