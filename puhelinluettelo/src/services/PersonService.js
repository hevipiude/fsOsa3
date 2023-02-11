import axios from 'axios'
const baseUrl = '/api/persons'

const getPersons = async () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const addPerson = async (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

const updatePerson = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  console.log('Payload:', newObject)
  return request.then((response) => response.data)
}

const removePerson = async (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then((response) => response.data)
}

export default {
  getPersons,
  addPerson,
  updatePerson,
  removePerson,
}
