import axios from "axios";

const getAll = () => {
  return axios.get("/api/persons");
};

const create = (newNumber) => {
  return axios.post("/api/persons", newNumber);
};

const update = (id, newNumber) => {
  return axios.put(`/api/persons/${id}`, newNumber);
};

const remove = (id) => {
  return axios.delete(`/api/persons/${id}`);
};

export default {
  getAll,
  create,
  update,
  remove,
};
