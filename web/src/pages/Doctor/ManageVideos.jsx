import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video,
    Plus,
    Trash2,
    Globe,
    Calendar,
    Play,
    X,
    Save,
    AlertCircle,
    Tv,
    Layers
} from 'lucide-react';
import { BTBackButton, BTCard, BTInputField, BTPrimaryButton, BTStatusBadge } from '../../components/BTComponents';
import APIConfig from '../../config';

const ManageVideos = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [submitting, setSubmitting] = useState(false);
    const [appeared, setAppeared] = useState(false);

    const fetchVideos = async () => {
        try {
            const response = await fetch(APIConfig.getURL('fetch_videos.php'));
            const data = await response.json();
            if (data.status === 'success') {
                setVideos(data.videos);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setAppeared(true);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTitle || !newUrl) {
            setStatus({ type: 'error', msg: 'Please enter title and URL' });
            return;
        }

        setSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            const formData = new FormData();
            formData.append('title', newTitle);
            formData.append('youtube_url', newUrl);

            const response = await fetch(APIConfig.getURL('upload_video.php'), {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.status === 'success') {
                setStatus({ type: 'success', msg: 'Video added successfully!' });
                setNewTitle('');
                setNewUrl('');
                fetchVideos();
                setTimeout(() => { setShowAdd(false); setStatus({ type: '', msg: '' }); }, 2000);
            } else {
                setStatus({ type: 'error', msg: data.message || 'Failed to add video' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Connection error' });
        } finally {
            setSubmitting(false);
        }
    };

    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="page-container flex flex-col pb-12 bg-bt-background min-h-screen">
            <div className="page-header justify-between bg-white border-b border-bt-border sticky top-0 z-10">
                <BTBackButton onClick={() => navigate('/doctor')} />
                <h1 className="bt-headline text-bt-doctor-primary">Health Education</h1>
                <button
                    onClick={() => setShowAdd(true)}
                    className="w-12 h-12 bg-bt-doctor-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all border-none cursor-pointer"
                >
                    <Plus size={28} strokeWidth={2.5} />
                </button>
            </div>

            <div className="page-content pt-8 px-4 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: appeared ? 1 : 0, y: appeared ? 0 : 10 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Tv size={20} className="text-bt-doctor-primary" />
                        <span className="text-[11px] font-black text-bt-text-tertiary uppercase tracking-[2px]">Content Management</span>
                    </div>
                    <h2 className="text-[32px] font-bold text-bt-text-primary tracking-tight">Patient Resources</h2>
                    <p className="bt-body text-bt-text-second">Manage videos visible to patients in their resources section.</p>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-bt-doctor-primary border-t-transparent rounded-full animate-spin" />
                        <p className="bt-body-small text-bt-text-second">Loading library...</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-24 opacity-20 flex flex-col items-center gap-6">
                        <Layers size={100} strokeWidth={1} />
                        <p className="text-[18px] font-bold uppercase tracking-widest">No content published</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {videos.map((video, idx) => {
                            const yid = getYoutubeId(video.youtube_url);
                            return (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: appeared ? 1 : 0, y: appeared ? 0 : 20 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="bg-white rounded-[32px] overflow-hidden border border-bt-border/50 shadow-card flex flex-col group">
                                        <div className="relative aspect-video bg-black overflow-hidden">
                                            {yid ? (
                                                <img
                                                    src={`https://img.youtube.com/vi/${yid}/maxresdefault.jpg`}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover opacity-80"
                                                    onError={(e) => { e.target.src = `https://img.youtube.com/vi/${yid}/0.jpg`; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20"><Video size={64} /></div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-bt-doctor-primary/95 text-white rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20">
                                                    <Play size={32} strokeWidth={3} className="ml-1" />
                                                </div>
                                            </div>
                                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 border border-white/10">
                                                <Video size={10} fill="currentColor" /> Live Resource
                                            </div>
                                        </div>
                                        <div className="p-6 flex justify-between items-center gap-4">
                                            <div className="flex flex-col gap-1 flex-1">
                                                <h3 className="text-[18px] font-bold text-bt-text-primary line-clamp-1 group-hover:text-bt-doctor-primary transition-colors">{video.title}</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[12px] font-bold text-bt-text-tertiary flex items-center gap-1.5 uppercase tracking-wide"><Globe size={12} /> Live</span>
                                                    <span className="text-[12px] font-bold text-bt-text-tertiary flex items-center gap-1.5 uppercase tracking-wide"><Calendar size={12} /> {new Date(video.uploaded_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <button
                                                className="w-12 h-12 rounded-2xl bg-bt-accent/5 text-bt-text-tertiary hover:bg-bt-accent/10 hover:text-bt-accent transition-all flex items-center justify-center border-none cursor-pointer"
                                                onClick={() => alert("Delete feature would call delete_video.php")}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Video Drawer */}
            <AnimatePresence>
                {showAdd && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !submitting && setShowAdd(false)}
                            className="fixed inset-0 z-[201] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white rounded-t-[44px] z-[202] p-10 shadow-2xl flex flex-col gap-8 pb-14"
                        >
                            <div className="w-12 h-1.5 bg-bt-border rounded-full mx-auto mb-2" />
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[24px] font-bold text-bt-text-primary italic">Publish New Video</h3>
                                    <p className="text-[13px] font-medium text-bt-text-tertiary">Share resources with your patients</p>
                                </div>
                                <button
                                    className="w-10 h-10 rounded-full bg-bt-background flex items-center justify-center text-bt-text-tertiary border-none cursor-pointer"
                                    onClick={() => setShowAdd(false)}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-5">
                                <BTInputField
                                    placeholder="Video Title (e.g. Proper Inhaler Technique)"
                                    value={newTitle}
                                    onChange={setNewTitle}
                                    icon={Video}
                                />
                                <BTInputField
                                    placeholder="YouTube URL"
                                    value={newUrl}
                                    onChange={setNewUrl}
                                    icon={Globe}
                                />
                                {(newUrl && !getYoutubeId(newUrl)) && (
                                    <div className="flex items-center gap-2 text-bt-accent-orange text-[10px] font-black uppercase ml-1 animate-pulse">
                                        <AlertCircle size={14} /> Please enter a valid YouTube link
                                    </div>
                                )}
                            </div>

                            <BTStatusBadge type={status.type} message={status.msg} />

                            <BTPrimaryButton
                                title="Publish to Library"
                                icon={Save}
                                variant="doctor"
                                loading={submitting}
                                onClick={handleAdd}
                                disabled={!newTitle || !newUrl || !getYoutubeId(newUrl)}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageVideos;
