import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash, Trash2 } from "lucide-react";
import Loading from "../components/Loading";

const Home = () => {
    const navigate = useNavigate();
    const [whiteboards, setWhiteboards] = useState([]);
    const [joinCode, setJoinCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
 
    useEffect(() => {
        
        setLoading(true);
        axios.get(`http://codraw-backend-mw58.onrender.com/api/whiteboards`, {
            withCredentials: true // include the cookie
        })
        .then(res => {
            setWhiteboards(res.data);
            setLoading(false);
            console.log("Whiteboards fetched:", res.data);
        })
        .catch(err => {
            console.error("Error fetching whiteboards:", err);
            setLoading(false);
        });
    }, []);

    const createWhiteboard = () => {
        const boardId = crypto.randomUUID();
        navigate(`/board/${boardId}`);
    };

    const handleJoinWhiteboard = () => {
        if (joinCode.trim()) {
            navigate(`/viewBoard/${joinCode.trim()}`);
        }
    };

    const deleteWhiteboard = async (id) => {
        if (!id) return;
        const confirm = window.confirm("Are you sure you want to delete this whiteboard? This action cannot be undone.");
        if (!confirm) return;
        setLoading(true);
        try {
            setDeletingId(id);
            await axios.delete(`http://codraw-backend-mw58.onrender.com/api/whiteboards/${id}`, { withCredentials: true });
            setWhiteboards(prev => prev.filter(b => b._id !== id));
            // alert('Whiteboard deleted');
        } catch (err) {
            console.error('Failed to delete whiteboard:', err);
            alert('Failed to delete whiteboard');
        } finally {
            setDeletingId(null);
            setLoading(false);
        }
    };

    return (
        <>
        {loading && <Loading />}
            <div className="min-h-screen flex flex-col gap-4 p-5 bg-white">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl uppercase font-mono font-bold">Your Whiteboards</h1>
                    <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter Join Code"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        className="border border-black rounded px-3 py-2 w-full max-w-sm"
                    />
                    <button
                        onClick={handleJoinWhiteboard}
                        className="bg-black cursor-pointer text-nowrap text-white px-4 py-2 rounded"
                    >
                        Join a Whiteboard!
                    </button>
                </div>
                    <button onClick={createWhiteboard} className="bg-black text-white px-4 py-2 rounded cursor-pointer">Create Whiteboard</button>
                </div>

                <div className="mt-5">
                    {!loading && whiteboards.length === 0 ? (
                        <p>No whiteboards yet</p>
                    ) : (
                        <div className="flex gap-3 flex-wrap">
                            {whiteboards.map(board => (
                                <div
                                key={board._id}
                                className="p-3 group cursor-pointer bg-black hover:bg-gray-800 rounded-md flex flex-col gap-2 relative"
                                onClick={() => navigate(`/board/${board._id}`, { state: { data: board.data } })}
                                >
                                    <button
                                    title="Delete"
                                    className={`absolute top-2 right-2 inline-flex items-center justify-center rounded-md bg-white/90 hover:bg-red-600 hover:text-white transition-colors p-1 ${deletingId === board._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); deleteWhiteboard(board._id); }}
                                    disabled={deletingId === board._id}
                                    >
                                    <Trash2 size={18} />
                                    </button>
                                    <img src={board.previewImage} alt="" width={300}/>
                                    <p className="font-mono text-white">Board {board._id.slice(-6)} (Created on {new Date(board.createdAt).toLocaleDateString()})</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
