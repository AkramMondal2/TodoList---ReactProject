import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [data, setData] = useState("");
  const [listData, setListData] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    const todoString = JSON.parse(localStorage.getItem("todos"));
    if (todoString) {
      const todos = JSON.parse(localStorage.getItem("todos"));
      setListData(todos);
    }
  }, []);

  const saveToLs = () => {
    localStorage.setItem(
      "todos",
      JSON.stringify([...listData, { id: uuidv4(), data, isCompleted: false }])
    );
  };
  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const addList = () => {
    // setListData([...listData, {id: uuidv4(), data, isCompleted: false}])
    // console.log(listData)
    setListData((listData) => {
      const updatedList = [
        ...listData,
        { id: uuidv4(), data, isCompleted: false },
      ];
      setData("");
      return updatedList;
    });
    console.log(listData);
    saveToLs();
    toast("Saved Sucessfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  
  const handelDelete = (id) => {
    const updatedList = listData.filter((item) => {
      return item.id != id;
    });
    setListData(updatedList);
    localStorage.setItem(
      "todos",
      JSON.stringify(listData.filter((item) => item.id != id))
    );
    toast("Deleted Sucessfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handelEdit = (id) => {
    const editData = listData.filter((item) => {
      return item.id === id;
    });
    setData(editData[0].data);
    const updatedList = listData.filter((item) => {
      return item.id != id;
    });
    setListData(updatedList);
  };

  const handelChanged = (id) => {
    const index = listData.findIndex((item) => {
      return item.id === id;
    });
    let newList = [...listData];
    newList[index].isCompleted = !newList[index].isCompleted;
    setListData(newList);
    localStorage.setItem("todos", JSON.stringify([...newList]));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="bg-slate-200 h-screen">
        <Navbar />
        <div className="container bg-blue-100 mx-auto w-1/2 rounded-lg mt-5 p-5">
          <h1 className="text-3xl font-bold text-center">
            iTask - Manage your todos at one place
          </h1>
          <h2 className="text-xl font-medium pt-5">Add a Todo</h2>
          <div className="flex gap-3 pt-3">
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="rounded-2xl w-4/5 h-7 p-3"
            />
            <button
              onClick={addList}
              disabled={data.length <= 3}
              className="bg-blue-700 text-white text-sm px-4 py-1 rounded-3xl disabled:bg-violet-700"
            >
              Save
            </button>
          </div>
          <div className="flex gap-2 text-sm font-medium py-5">
            <input
              type="checkbox"
              onChange={toggleFinished}
              checked={showFinished}
            />
            <p>Show Finished</p>
          </div>
          <div className="h-[2px] w-11/12 bg-gray-700 mx-auto"></div>
          <h2 className="text-xl font-bold pt-5">Your Todos</h2>
          {listData != [] &&
            listData.map((item) => {
              return (
                (showFinished || !item.isCompleted) && (
                  <div key={item.id} className="flex justify-between my-4">
                    <div className="flex gap-2">
                      <input
                        onChange={() => handelChanged(item.id)}
                        type="checkbox"
                        checked={item.isCompleted}
                      />
                      <p className={item.isCompleted ? "line-through" : ""}>
                        {item.data}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handelEdit(item.id)}
                        className="bg-blue-700 text-white  px-4 py-2 rounded-xl"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handelDelete(item.id)}
                        className="bg-blue-700 text-white  px-4 rounded-xl"
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  </div>
                )
              );
            })}
        </div>
      </div>
    </>
  );
}
