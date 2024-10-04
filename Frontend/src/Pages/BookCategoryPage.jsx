import React, { useEffect, useState } from 'react'
import { addcategory, getcategory } from '../Utils/AdminDataApi';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const BookCategoryPage = () => {
    const [catname, setCatname] = useState("");
    const [categoryList, setCategoryList] = useState(null);

    const handleAddCategory = async () => {
        let str = catname.trim();
        str = str.charAt(0).toUpperCase() + str.slice(1);
        const res = await addcategory(str);
        if(res){
            console.log(res)
            toast.success(res.data.Data);
        }
    }
    const handleGetCategory = async () => {
        const res = await getcategory();
        if(res){
            console.log(res);
            setCategoryList(res.data.Data);
        }
    }
    useEffect(() => {
        handleGetCategory();
    }, [])
    
  return (
    <div>
        <div className="header">
            <h1>Book Category</h1>
            <button className="primarybtn" onClick={()=>history.back()}>Go Back</button>
        </div>
        <div className="flex juspabet">
            <div className="book-cat-list">
                <table>
                    <thead>
                        <th>S.No.</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Operations</th>
                    </thead>
                    <tbody>
                    {
                    categoryList ? categoryList.map((data,idx) => {
                        return (<tr key={idx}>
                            <td>{idx+1}</td>
                            <td>{data._id}</td>
                            <td>{data.name}</td>
                            <td>edit, delete</td>
                        </tr>);
                    }) : ""
                    }
                    </tbody>
                </table>
            </div>
            <div >
                <div>
                    <h3>Add New Category</h3>
                    <input onChange={(e)=>setCatname(e.target.value)} value={catname} className="txtbox" size="30" type="text" placeholder="Enter New Category Name" required={true} />
                    <button onClick={handleAddCategory} className="addbookbtn" >ADD</button>
                </div>
            </div>
        </div>
        <ToastContainer position="bottom-right" />
    </div>
  )
}

export default BookCategoryPage