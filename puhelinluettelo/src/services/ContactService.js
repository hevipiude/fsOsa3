import axios from 'axios'
const baseUrl = '/api/contacts'

const getContacts = async () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const addContact = async (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then((response) => response.data)
}

const updateContact = async (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  console.log('Payload:', newObject)
  return request.then((response) => response.data)
}

const removeContact = async (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then((response) => response.data)
}

export default {
  getContacts,
  addContact,
  updateContact,
  removeContact,
}
