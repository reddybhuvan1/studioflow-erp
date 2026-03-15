import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import type { Gallery, GalleryImage } from '../../types';
import { Heart, Loader2, ArrowLeft, Download, Maximize2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ClientGallery() {
    const { id: paramId } = useParams();
    // Fallback for when not using a full router setup
    const id = paramId || window.location.pathname.split('/').pop();
    
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [localSelections, setLocalSelections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await api.get<Gallery>(`/galleries/${id}`);
                setGallery(data);
                const selections: Record<string, boolean> = {};
                data.images.forEach(img => {
                    if (img.isSelected) selections[img.id] = true;
                });
                setLocalSelections(selections);
            } catch (err) {
                console.error("Failed to load gallery:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchGallery();
    }, [id]);

    const toggleHeart = async (imageId: string) => {
        const isCurrentlySelected = localSelections[imageId];
        setLocalSelections(prev => ({ ...prev, [imageId]: !isCurrentlySelected }));
        
        try {
            await api.put(`/gallery-images/${imageId}/toggle`, {});
        } catch (err) {
            console.error("Failed to persist selection:", err);
            // Revert on failure
            setLocalSelections(prev => ({ ...prev, [imageId]: isCurrentlySelected }));
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Loading Your Moments</p>
            </div>
        );
    }

    if (!gallery) {
        return (
            <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-6">
                <h1 className="text-6xl font-black tracking-tighter opacity-10">404</h1>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Gallery Not Found or Access Expired</p>
                <button onClick={() => window.close()} className="btn-primary px-8">Return</button>
            </div>
        );
    }

    const selectionCount = Object.values(localSelections).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-[#fafafa] text-black selection:bg-black selection:text-white">
            {/* Minimal Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center">
                        <ArrowLeft size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-widest">{gallery.title}</h1>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Client Proofing Portal</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest">{selectionCount} Selected</span>
                        <div className="w-24 h-1 bg-secondary rounded-full overflow-hidden mt-1">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(selectionCount / gallery.images.length) * 100}%` }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                        <Download size={14} /> Finish Selection
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto space-y-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block px-4 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.3em] rounded-full"
                >
                    Private Selection Gallery
                </motion.div>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-none">
                    Capture the <span className="font-italic">magic</span> of your special day.
                </h2>
                <p className="text-muted-foreground text-sm font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
                    Swipe through your photos and tap the heart icon to save your favorites for final retouching and delivery. We've curated these highlights just for you.
                </p>
            </header>

            {/* Grid */}
            <main className="px-4 pb-32 max-w-[1600px] mx-auto">
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                    {gallery.images.map((image, idx) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (idx % 4) * 0.1 }}
                            className="relative group bg-white overflow-hidden rounded-sm break-inside-avoid"
                        >
                            <img 
                                src={image.url} 
                                alt="" 
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                                onClick={() => setSelectedImage(image)}
                            />
                            
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); toggleHeart(image.id); }}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${localSelections[image.id] ? 'bg-primary text-white scale-110' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black'}`}
                                >
                                    <Heart size={20} fill={localSelections[image.id] ? "currentColor" : "none"} />
                                </button>
                                <button 
                                    onClick={() => setSelectedImage(image)}
                                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                                >
                                    <Maximize2 size={20} />
                                </button>
                            </div>

                            {localSelections[image.id] && (
                                <div className="absolute top-4 left-4 bg-primary text-white p-1 rounded-full shadow-xl">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
                    >
                        <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
                        >
                            <X size={32} />
                        </button>
                        
                        <div className="relative max-w-full max-h-full">
                            <motion.img 
                                layoutId={selectedImage.id}
                                src={selectedImage.url} 
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                                alt=""
                            />
                            <div className="mt-8 flex justify-center gap-6">
                                <button 
                                    onClick={() => toggleHeart(selectedImage.id)}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase tracking-widest transition-all ${localSelections[selectedImage.id] ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    <Heart size={20} fill={localSelections[selectedImage.id] ? "currentColor" : "none"} />
                                    {localSelections[selectedImage.id] ? 'Selected' : 'Select Photo'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="py-20 border-t border-black/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Powered by StudioFlow ERP</p>
            </footer>
        </div>
    );
}
