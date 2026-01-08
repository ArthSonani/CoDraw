import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas } from "fabric";
import io from "socket.io-client";
import { Download, Copy } from "lucide-react";
import axios from "axios";
import GroupVoiceChat from "./GroupVoiceChat";
import Loading from "./Loading"

const ViewWhiteboard = () => {
  const { boardId } = useParams();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [fullId, setFullId] = useState(null);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const hasLoadedInitialRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initCanvas = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
      enableRetinaScaling: true
    });
    initCanvas.backgroundColor = "#fff";

    initCanvas.on("object:added", (e) => {
        if (e.target) {
          e.target.selectable = false;
          e.target.evented = false; 
        }
      });

    initCanvas.renderAll();
    setCanvas(initCanvas);
    console.log("Canvas rendered")

    return () => {
      initCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!canvas) return;

    const socket = io("https://codraw-backend-mw58.onrender.com/");
    socketRef.current = socket;

    socket.emit("join-board", {boardId, data: null, role: 'viewer'});

    const handleInitialRender = ({data, boardId}) => {
      setFullId(boardId);
      if (!data || !canvas) return;
      try {
        const json = typeof data === 'string' ? JSON.parse(data) : data;
        if (!json || typeof json !== 'object') return;
        canvas.loadFromJSON(json, () => {
          canvas.renderAll();
          canvas.calcOffset();
          canvas.requestRenderAll();
          hasLoadedInitialRef.current = true;
          console.log("Canvas Drawn")
        });
      } catch (err) {
        console.error('Failed to render initial canvas JSON:', err);
      }
    }

    socket.on('send-current-data', handleInitialRender);

    const handleCanvasUpdate = ({ boardId: incomingId, data }) => {
      if (incomingId !== boardId || !canvas) return;
      if (!data) return;
      try {
        const json = typeof data === 'string' ? JSON.parse(data) : data;
        if (!json || typeof json !== 'object') return;
        canvas.loadFromJSON(json, () => {
          canvas.getObjects().forEach((obj) => {
            obj.selectable = false;
            obj.evented = false;
          });
          canvas.renderAll();
          canvas.calcOffset();
          canvas.requestRenderAll();
        });
      } catch (err) {
        console.error('Failed to apply viewer canvas update JSON:', err);
      }
    };

    socket.on("canvas-data", handleCanvasUpdate);

    return () => {
      socket.off("canvas-data", handleCanvasUpdate);
      socket.disconnect();
    };
  }, [boardId, canvas]);

  const exportCanvasAsImage = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `whiteboard-${boardId}.png`;
    link.click();
  };

  const cloneWhiteboard = async () => {
    setLoading(true);
    if (!canvas) return;
    const whiteboardData = JSON.stringify(canvas.toJSON());
    const previewImage = canvas.toDataURL('image/png');
    const newBoardId = crypto.randomUUID();

    try {
      // 1. Upload image preview to Cloudinary via backend
      const uploadResponse = await axios.post(
        "https://codraw-backend-mw58.onrender.com/api/whiteboards/upload-preview",
        { image: previewImage }, // send base64 string directly
        { withCredentials: true }
      );
  
      const cloudinaryUrl = uploadResponse.data.url;
  
      // 2. Save the whiteboard with the image URL
      await axios.post(
        "https://codraw-backend-mw58.onrender.com/api/whiteboards/save",
        { boardId: newBoardId, data: whiteboardData, previewImage: cloudinaryUrl },
        { withCredentials: true }
      );
  
      setLoading(false);
      navigate("/")
    } catch (error) {
      setLoading(false);
      console.error("Error cloning whiteboard:", error);
      alert("Failed to clone whiteboard");
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="relative flex overflow-hidden min-h-screen">
        <canvas ref={canvasRef} />
        <div className="toolbar absolute top-[2%] z-[20] shadow-lg left-1/2 -translate-x-1/2 bg-gray-100 rounded-[10px] flex gap-5 px-3 py-3 justify-center  items-center">
          <button onClick={cloneWhiteboard} className='cursor-pointer bg-gray-100 hover:bg-blue-100 flex items-center gap-2 p-[10px] font-mono rounded-[10px] text-sm' title='Save Whiteboard'>
            <Copy size={20} /> Clone Whiteboard
            </button>
          <button onClick={exportCanvasAsImage} className='cursor-pointer bg-gray-100 hover:bg-blue-100 flex items-center gap-2 p-[10px] font-mono rounded-[10px] text-sm'>
            <Download size={20} /> Export as PNG
          </button>
          {fullId && <GroupVoiceChat boardId={fullId}/>}
        </div>
        
      </div>
    </>
  );
};

export default ViewWhiteboard;
