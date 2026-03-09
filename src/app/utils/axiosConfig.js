import axios from "axios";

const instance = axios.create({
  baseURL: "https://sst-task-trail.vercel.app/api",

  withCredentials: true,
});

export default instance;
