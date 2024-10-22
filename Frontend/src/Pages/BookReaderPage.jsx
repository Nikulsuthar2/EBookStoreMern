import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookDetails, getBookStream } from "../Utils/userDataApi";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/build/pdf.worker.min.mjs';
//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf_viewer.min.css`;


const BookReaderPage = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
  const { bookId } = useParams();
  const [bookData, setBookData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const loadPdf = async (url) => {
    console.log(url)
    const loadingTask = pdfjsLib.getDocument(import.meta.env.VITE_BACKEND_URL+url);
    loadingTask.promise.then(
      (pdf) => {
        setNumPages(pdf.numPages);
        renderPage(pdf, pageNumber);
      },
      (reason) => {
        console.error('Error loading PDF: ' + reason);
      }
    );
  };

  const handleGetBookDetails = async (id) => {
    const res = await getBookDetails(id);
    if (res) {
      const data = res.data.Data;
      data.isInCart = res.data.isInCart;
      data.isInMybooks = res.data.isInMybooks;
      data.isInWishlist = res.data.isInWishlist;
      setBookData(data);
      console.log(data);
      loadPdf(res.data.Data.bookurl)
    }
  };

  const renderPage = async (pdf, pageNum) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    page.render(renderContext);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
  };
  // Change the page and render the new page
  const changePage = (newPageNumber) => {
    if (newPageNumber > 0 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
      loadPage(newPageNumber);
    }
  };

  // Load and render a specific page
  const loadPage = async (pageNum) => {
    const loadingTask = pdfjsLib.getDocument(import.meta.env.VITE_BACKEND_URL+bookData?.bookurl);
    const pdf = await loadingTask.promise;
    renderPage(pdf, pageNum);
  };

  useEffect(() => {
    handleGetBookDetails(bookId);
    if (numPages) {
      loadPage(pageNumber); // Load the current page whenever the page number changes
    }
  }, [pageNumber, numPages]);

  return (
    <div onContextMenu={handleContextMenu} className="relative h-full pb-[135px] md:pb-[55px] m-auto flex justify-between">
        <div></div>
        <canvas ref={canvasRef} />
        {/* <iframe onMouseDown={()=>alert("he")} onContextMenu={handleContextMenu} type="application/pdf" src={import.meta.env.VITE_BACKEND_URL + bookData?.bookurl+"#toolbar=0"} className="h-full w-[70%]"></iframe> */}
        <div>
        <button
          onClick={() => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1))}
          disabled={pageNumber <= 1}
        >
          Previous
        </button>
        <span> Page {pageNumber} of {numPages} </span>
        <button
          onClick={() => setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages))}
          disabled={pageNumber >= numPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookReaderPage;
