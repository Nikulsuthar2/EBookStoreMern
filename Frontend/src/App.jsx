import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
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
import UserListPage from './Pages/UserListPage';
import PurchaseReport from './Pages/PurchaseReport';


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      {/* Auth Routes */}
      <Route path='/' element={<AuthLayout />}>
        <Route index element={<Landing/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/signin' element={<SigninPage/>}></Route>
      </Route>
      {/* Users Pages */}
      <Route path='/home' element={<HomeMaster/>}>
        <Route index element={<HomePage/>}/>
      </Route>
      {/* Admin Pages */}
      <Route path='/admin' element={<AdminMaster/>}>
        <Route index element={<AdminHomePage/>}/>
        <Route path='/admin/ebooks' element={<BookListPage/>}/>
        <Route path='/admin/ebooks/addBook' element={<AddBookPage/>}/>
        <Route path='/admin/category' element={<BookCategoryPage/>}/>
        <Route path='/admin/users' element={<UserListPage/>}/>
        <Route path='/admin/purchasereport' element={<PurchaseReport/>}/>
      </Route>
      </>
    )
  )

  return <RouterProvider router={router}/>;
}

export default App
