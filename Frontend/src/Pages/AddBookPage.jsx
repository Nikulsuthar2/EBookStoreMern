import React from 'react'
import { Link } from 'react-router-dom'
import '../CSS/adminhome.css';
import '../CSS/addupdatebook.css';
import { FaArrowLeft } from "react-icons/fa6";
import bookdemo from '../assets/book1.jpg'

const AddBookPage = () => {
  return (
    <div className="adminmainbody">
        <div className="header1">
            <Link className="primarybtn" to={"/admin/ebooks"} ><FaArrowLeft /></Link>
            <h1>Add Book</h1>
        </div>
        <div className='forms'>
          <div className='formside'>
            <div className="inputsec">
                <label for="bookthumb"><img className='bookcover' style={{width:"200px"}} src={bookdemo} /></label>
                <input hidden id='bookthumb' className="txtbox" type="file" name="bookthumb"/>
            </div>
            <div className="inputsec">
                <label className="lblfrm">Book File</label>
                <input className="txtbox" type="file" name="bookfile"/>
            </div>
          </div>
          <div className='formside'>

          </div>
        </div>
        <div className="mainform">
            <div className="litopbar">
                <label>book details</label>
            </div>
            <form className="bookdtlform">
                <div className="inputsec">
                    <label className="lblfrm">Book Name</label>
                    <input className="txtbox" type="text" placeholder="Enter the name of Book" 
                    required={true} autofocus/>
                </div>
                <div className="inputsec">
                    <label className="lblfrm">Price</label>
                    <input className="txtbox" type="number" name="bookprice" placeholder="Enter the price of book"
                    required={true}/>
                </div>
                <div className="inputsec">
                    <label className="lblfrm">Author Name</label>
                    <input className="txtbox" type="text" name="authname" placeholder="Enter the name of Author"
                    value="<?php if(isset($_GET['updt'])){echo $bookdtl['author'];}?>" required/>
                </div>
                <div className="inputsec">
                    <label className="lblfrm">Publisher Name</label>
                    <input className="txtbox" type="text" name="pubname" placeholder="Enter the name of Publisher"
                    value="<?php if(isset($_GET['updt'])){echo $bookdtl['publisher'];}?>" required/>
                </div>
                <div className="inputsec">
                    <label className="lblfrm">Publish Date</label>
                    <input className="txtbox" type="date" name="bookpubdate"
                    value="<?php if(isset($_GET['updt'])){echo $bookdtl['publishdate'];}?>" required/>
                </div>
                <div className="inputsec">
                    <label className="lblfrm">Language</label>
                    <input className="txtbox" type="text" name="booklang" placeholder="Enter the Language of Book"
                    value="<?php if(isset($_GET['updt'])){echo $bookdtl['language'];}?>" required/>
                </div>
                <div className="inputsec">
                    <label className="lblfrm">Category</label>
                    <select className="txtbox" name="bookcat">
                    // list 
                    </select>
                </div>
                <div className="inputsec">
                    <label className="lblfrm">Description</label>
                    <textarea className="descbox" name="bookdesc" rows="3" cols="40" placeholder="Book Description"></textarea>
                </div>
                
                <input className="addbookbtn" type="submit" name="addbook" value="<?php echo $pagetitle;?>"/>
            </form>
        </div>
    </div>
  )
}

export default AddBookPage