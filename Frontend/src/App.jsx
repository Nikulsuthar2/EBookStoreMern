import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './App.css'
import AuthLayout from './Layouts/AuthLayout';
import HomeMaster from './Layouts/HomeMaster';
import Landing from './Pages/Landing';
import LoginPage from './Pages/LoginPage';
import SigninPage from './Pages/SigninPage';
import HomePage from './Pages/HomePage';
import AdminMaster from './Layouts/AdminMaster';
import AdminHomePage from './Pages/AdminHomePage';
import BookListPage from './Pages/BookListPage';
import AddBookPage from './Pages/AddBookPage';
import BookCategoryPage from './Pages/BookCategoryPage';


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={<AuthLayout />}>
        <Route index element={<Landing/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/signin' element={<SigninPage/>}></Route>
      </Route>
      <Route path='/home' element={<HomeMaster/>}>
        <Route index element={<HomePage/>}/>
      </Route>
      <Route path='/admin' element={<AdminMaster/>}>
        <Route index element={<AdminHomePage/>}/>
        <Route path='/admin/ebooks' element={<BookListPage/>}/>
        <Route path='/admin/ebooks/addBook' element={<AddBookPage/>}/>
        <Route path='/admin/category' element={<BookCategoryPage/>}/>
      </Route>
      </>
    )
  )

  return <RouterProvider router={router}/>;
}

export default App
