import React, { useRef } from "react";
import { MdFullscreen } from "react-icons/md";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

const PDFViewer = ({ pdfUrl }) => {
  const viewerRef = useRef(null);
  const zoomPluginInstance = zoomPlugin();
  const { Zoom, ZoomIn, ZoomOut } = zoomPluginInstance;

  const handleFullscreen = () => {
    if (viewerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        viewerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div ref={viewerRef} className="relative h-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="absolute z-50 top-[5px] left-[50%] -translate-x-[50%] shadow-md p-1 rounded-md bg-white flex justify-center items-center gap-2">
          <ZoomOut></ZoomOut>
          <ZoomIn></ZoomIn>
          <Zoom></Zoom>
          <button
            onClick={handleFullscreen}
            className="text-2xl p-1 hover:bg-gray-200 rounded-md"
          >
            <MdFullscreen />
          </button>
        </div>
        <Viewer
          fileUrl={pdfUrl}
          plugins={[zoomPluginInstance]}
          defaultScale={SpecialZoomLevel.PageWidth}
        />
      </Worker>
    </div>
  );
};

export default PDFViewer;
