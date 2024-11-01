import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import HomeMaster from "./Layouts/HomeMaster";
import Landing from "./Pages/Landing";
import LoginPage from "./Pages/LoginPage";
import SigninPage from "./Pages/SigninPage";
import HomePage from "./Pages/HomePage";
import AdminMaster from "./Layouts/AdminMaster";
import AdminHomePage from "./Pages/AdminHomePage";
import BookListPage from "./Pages/BookListPage";
import AddBookPage from "./Pages/AddBookPage";
import BookCategoryPage from "./Pages/BookCategoryPage";
import UserListPage from "./Pages/UserListPage";
import PurchaseReport from "./Pages/PurchaseReport";
import ViewProductDetails from "./Pages/ViewProductDetails";
import ViewCategoryBooks from "./Pages/ViewCategoryBooks";
import ViewSearchResult from "./Pages/ViewSearchResult";
import ViewCartPage from "./Pages/ViewCartPage";
import NotFound from "./Pages/NotFound";
import UserProfilePage from "./Pages/UserProfilePage";
import PaymentSuccessPage from "./Pages/PaymentSuccessPage";
import BookReaderPage from "./Pages/BookReaderPage";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Landing />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signin" element={<SigninPage />}></Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* Users Pages */}
        <Route path="/home" element={<HomeMaster />}>
          <Route index element={<HomePage />} />
          <Route path="/home/book/:bookId" element={<ViewProductDetails />} />
          <Route path="/home/cart/" element={<ViewCartPage />} />
          <Route
            path="/home/category/:catId/:catName"
            element={<ViewCategoryBooks />}
          />
          <Route path="/home/searchbooks/" element={<ViewSearchResult />} />
          <Route path="/home/profile/" element={<UserProfilePage />} />
          <Route path="/home/readbook/:bookId" element={<BookReaderPage />} />
          <Route path="*" element={<NotFound navigate={"/home"} />} />
        </Route>
        {/* Admin Pages */}
        <Route path="/admin" element={<AdminMaster />}>
          <Route index element={<AdminHomePage />} />
          <Route path="/admin/ebooks" element={<BookListPage />} />
          <Route
            path="/admin/ebooks/addBook"
            element={<AddBookPage title={"Add Book"} isUpdate={false} />}
          />
          <Route
            path="/admin/ebooks/updateBook/:id"
            element={<AddBookPage title={"Update Book"} isUpdate={true} />}
          />
          <Route path="/admin/category" element={<BookCategoryPage />} />
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/purchasereport" element={<PurchaseReport />} />
          <Route path="*" element={<NotFound navigate={"/admin"} />} />
        </Route>
        <Route
          path="/paymentsuccess/:id/:amount"
          element={<PaymentSuccessPage />}
        />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
