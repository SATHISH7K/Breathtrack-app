import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Video, Play, ExternalLink, ArrowLeft,
    Sparkles, BookOpen, Clock, Heart, Search, Filter
} from 'lucide-react';
import APIConfig from '../../config';

const Resources = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const filtered = videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="page-container flex flex-col bg-[#0F0F12] min-h-screen text-white">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#0F0F12]/80 backdrop-blur-2xl px-6 pt-14 pb-4 flex items-center justify-between border-b border-white/5">
                <button
                    onClick={() => navigate('/patient')}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
                >
                    <ArrowLeft size={18} strokeWidth={2.5} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-[#5B4CF5] uppercase tracking-[3px] mb-0.5">BreathTrack</span>
                    <span className="text-[17px] font-extrabold text-white">Learning Hub</span>
                </div>
                <div className="w-10" />
            </div>

            <main className="flex-1 overflow-y-auto pb-32">
                {/* Hero Section */}
                <div className="px-8 pt-10 pb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-[#5B4CF5]" />
                        <span className="text-xs font-black uppercase tracking-[2px] text-[#5B4CF5]">Premium Education</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-4 leading-tight">Expert Respiratory<br />Training</h1>
                    <p className="text-white/40 text-[15px] font-medium leading-relaxed max-w-[280px]">
                        Master your condition with techniques used by clinical professionals.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="px-8 mb-10 flex gap-3">
                    <div className="flex-1 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center px-4 focus-within:border-[#5B4CF5]/50 transition-all">
                        <Search size={18} className="text-white/30 mr-3" />
                        <input
                            type="text" placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-white/20"
                        />
                    </div>
                    <button className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white/60">
                        <Filter size={18} />
                    </button>
                </div>

                {/* Video Grid */}
                <div className="px-6 flex flex-col gap-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-[#5B4CF5] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filtered.map((video, idx) => {
                                    const yid = getYoutubeId(video.youtube_url);
                                    return (
                                        <motion.div
                                            key={video.id}
                                            layout
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group"
                                            onClick={() => window.open(video.youtube_url, '_blank')}
                                        >
                                            <div className="relative aspect-video rounded-[32px] overflow-hidden bg-white/5 ring-1 ring-white/10 group-hover:ring-[#5B4CF5]/50 transition-all shadow-2xl cursor-pointer">
                                                {yid ? (
                                                    <img
                                                        src={`https://img.youtube.com/vi/${yid}/maxresdefault.jpg`}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        onError={e => { e.target.src = `https://img.youtube.com/vi/${yid}/0.jpg`; }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/10">
                                                        <Video size={80} />
                                                    </div>
                                                )}

                                                {/* Overlays */}
                                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:bg-[#5B4CF5] transition-all duration-300">
                                                        <Play size={28} fill="currentColor" strokeWidth={0} />
                                                    </div>
                                                </div>

                                                {/* Meta Info */}
                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="bg-[#5B4CF5] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">Masterclass</span>
                                                        <span className="text-[10px] text-white/60 font-bold flex items-center gap-1">
                                                            <Clock size={10} /> 12:40
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-white leading-tight drop-shadow-md">{video.title}</h3>
                                                </div>
                                            </div>

                                            <div className="mt-4 px-2 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                        <BookOpen size={14} className="text-[#5B4CF5]" />
                                                    </div>
                                                    <span className="text-xs font-bold text-white/80">Expert Clinician Lessons</span>
                                                </div>
                                                <ExternalLink size={16} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {!loading && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                        <Heart size={40} className="text-white/10 mb-4" />
                        <p className="text-white/40 font-bold">No sessions match your search.</p>
                    </div>
                )}
            </main>

            {/* Premium Dock */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-2xl rounded-full px-6 py-4 border border-white/10 flex gap-8 shadow-2xl z-40">
                <div className="flex flex-col items-center gap-1 opacity-40">
                    <Clock size={20} />
                    <span className="text-[9px] font-black uppercase">Recent</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[#5B4CF5]">
                    <Play size={20} fill="currentColor" />
                    <span className="text-[9px] font-black uppercase">Browse</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-40">
                    <Heart size={20} />
                    <span className="text-[9px] font-black uppercase">Saved</span>
                </div>
            </div>
        </div>
    );
};

export default Resources;
