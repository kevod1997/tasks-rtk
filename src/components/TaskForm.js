
import {useState, useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {addTask, editTask} from '../features/tasks/taskSlice'
import {v4 as uuid} from 'uuid'
import { useNavigate, useParams } from "react-router-dom";
import {uploadFile} from '../firebase/config'
function TaskForm() {
const [task, setTask] = useState({
    title: '',
    description: '',
    image: undefined
})
//  const [file, setFile] = useState(undefined)

const handleChange = e => {
    setTask({
        ...task,
        [e.target.name]: e.target.value,
        [e.target.image]: e.target.files[0]
    });
}

const dispatch = useDispatch()
const navigate = useNavigate();
const params = useParams();
const tasks = useSelector((state) => state.tasks);

const handleSubmit= async (e) => {
    e.preventDefault()
    if (params.id) {
        dispatch(editTask({ ...task, id: params.id }));
      } else {
        try {
        await uploadFile(task.image)
        } catch (error) {
          console.log(error);
          alert('Fallo al subir imagen')
        }
        dispatch(
          addTask({
            ...task,
            id: uuid(),
          })
        );
      }
  
      navigate("/");
}
useEffect(() => {
    if (params.id) {
      setTask(tasks.tasksItems.find((task) => task.id === params.id));
    }
  }, [params, tasks]);



  return (
  <form onSubmit={handleSubmit} className="bg-zinc-800 max-w-sm p-4">
  <label className="block text-sm font-bold">Task:</label>
  <input
    type="text"
    name="title"
    onChange={handleChange}
    value={task.title}
    className="w-full p-2 rounded-md bg-zinc-600 mb-2"
    placeholder="Write a title"
    autoFocus
  />
  <label>
    Description:
    <textarea
      type="text"
      name="description"
      onChange={handleChange}
      value={task.description}
      className="w-full p-2 rounded-md bg-zinc-600 mb-2"
      placeholder="Write a description"
    />
  </label>
  <label>
    Image:
    <input type="file" className="w-full p-2 rounded-md bg-zinc-600 mb-2" onChange={handleChange} 
         image="image"
         value={task.image}
    ></input>
  </label>
  <button type="submit" className="bg-indigo-600 px-2 py-1">Submit</button>
</form>
  )
}

export default TaskForm;
