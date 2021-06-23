import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'


const getAll = () => {
    console.log('Getting all the notes from the server ...\n');
    const request= axios.get(baseUrl); 
    const nonExistant = {
        id: 1000,
        content: 'this note is not saved on the server',
        date: '2019-05-30',
        important: true
    };
    
    return request.then(response => response.data.concat(nonExistant));
}

const create = newObject => {
    console.log('Creating a new note ');
    const request= axios.post(baseUrl, newObject);
    return request.then(response => response.data);
}

const update = (id, newObject) => {
    console.log('Updating an item in the server');

    const request=  axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data);
}

export default { getAll,create,update }