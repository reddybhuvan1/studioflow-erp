import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api';
import type { Gallery, GalleryImage } from '../../types';
import { Heart, Loader2, ArrowLeft, Download, Maximize2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ClientGallery() {
    const { id: paramId } = useParams();
    // More robust identification of the ID from path
    const [id, setId] = useState<string>('');

    useEffect(() => {
        if (paramId) {
            setId(paramId);
        } else {
            const matches = window.location.pathname.match(/\/gallery\/([^/]+)/);
            if (matches && matches[1]) setId(matches[1]);
        }
    }, [paramId]);

    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [localSelections, setLocalSelections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!id) return;
        const fetchGallery = async () => {
            try {
                const data = await api.get<Gallery>(`/galleries/${id}`);
                setGallery(data);
                const selections: Record<string, boolean> = {};
                if (data.images) {
                    data.images.forEach(img => {
                        if (img.isSelected) selections[img.id] = true;
                    });
                }
                setLocalSelections(selections);
            } catch (err) {
                console.error("Failed to load gallery:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, [id]);

    const toggleHeart = async (imageId: string) => {
        const isCurrentlySelected = localSelections[imageId];
        setLocalSelections(prev => ({ ...prev, [imageId]: !isCurrentlySelected }));
        
        try {
            await api.put(`/gallery-images/${imageId}/toggle`, {});
        } catch (err) {
            console.error("Failed to persist selection:", err);
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
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Gallery Not Found</p>
                <button onClick={() => window.location.href = '/'} className="btn-primary px-8">Return Home</button>
            </div>
        );
    }

    const images = gallery.images || [];
    const selectionCount = Object.values(localSelections).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-[#fafafa] text-black selection:bg-black selection:text-white">
            {/* Minimal Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center cursor-pointer" onClick={() => window.history.back()}>
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
                        <div className="w-24 h-1 bg-secondary rounded-full overflow-hidden mt-1 text-zinc-100">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: images.length > 0 ? `${(selectionCount / images.length) * 100}%` : 0 }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
                        <Check size={14} /> Confirm Selections
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
                {images.length === 0 ? (
                    <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4 uppercase tracking-[0.4em] font-black text-xs">
                        <ImageIcon size={48} />
                        Waiting for images...
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        {images.map((image, idx) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (idx % 4) * 0.05 }}
                                className="relative group bg-zinc-200 overflow-hidden rounded-sm break-inside-avoid shadow-sm min-h-[200px]"
                            >
                                <img 
                                    src={image.url} 
                                    alt="Gallery item" 
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                                    onClick={() => setSelectedImage(image)}
                                    onError={(e) => {
                                        // Fallback for broken images to keep the UI clean
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=800&auto=format&fit=crop';
                                    }}
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
