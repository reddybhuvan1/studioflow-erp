import { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { Image as ImageIcon, Plus, Trash2, ExternalLink, Globe, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GalleryManagement() {
    const { sessions, clients, galleries, createGallery, addImagesToGallery, deleteGallery, deleteImage } = useApp();
    const [selectedSessionId, setSelectedSessionId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.name || 'Unknown Client';
    
    const projectGalleries = galleries.map(g => {
        const session = sessions.find(s => s.id === g.sessionId);
        return { ...g, clientName: session ? getClientName(session.clientId) : 'Unknown' };
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createGallery({ 
            sessionId: selectedSessionId, 
            title: title || `${getClientName(sessions.find(s => s.id === selectedSessionId)?.clientId || '')}'s Gallery`,
            isPublished: false 
        });
        setIsCreating(false);
        setSelectedSessionId('');
        setTitle('');
    };

    const handleAddImages = (galleryId: string) => {
        const urls = imageUrls.split('\n').map(u => u.trim()).filter(u => u !== '');
        if (urls.length > 0) {
            addImagesToGallery(galleryId, urls);
            setImageUrls('');
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">GALLERIES</h1>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-1">Proofing & Delivery</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-primary"
                    >
                        <Plus size={18} />
                        <span>Create New Gallery</span>
                    </button>
                )}
            </header>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="card-premium p-6 md:p-8 overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center"><Globe size={18} /></div>
                            <h3 className="font-black uppercase tracking-wider">Initialize Gallery</h3>
                        </div>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Active Project</label>
                                <select 
                                    className="input-field"
                                    value={selectedSessionId}
                                    onChange={e => setSelectedSessionId(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a project...</option>
                                    {sessions.filter(s => !galleries.some(g => g.sessionId === s.id)).map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.id} - {getClientName(s.clientId)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Gallery Title (Optional)</label>
                                <input 
                                    className="input-field" 
                                    placeholder="e.g. Wedding Highlights" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                                <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
                                <button type="submit" className="btn-primary sm:px-12">Create Gallery</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-6">
                {projectGalleries.length === 0 ? (
                    <div className="card-premium py-20 text-center flex flex-col items-center gap-4 text-muted-foreground/30">
                        <ImageIcon size={48} />
                        <span className="font-bold text-lg uppercase tracking-widest">No Galleries Active</span>
                        <p className="text-xs max-w-sm">Create a gallery for an active project to start the proofing process with your client.</p>
                    </div>
                ) : projectGalleries.map(gallery => (
                    <div key={gallery.id} className="card-premium overflow-hidden !p-0 border-l-4 border-l-primary">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-black tracking-tight">{gallery.title}</h3>
                                        {gallery.isPublished && (
                                             <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1">
                                                <CheckCircle size={10} /> Live
                                             </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Client: {gallery.clientName} | Project: {gallery.sessionId}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add Image URLs (One per line)</label>
                                    <textarea 
                                        className="input-field h-24 resize-none text-[10px] font-mono"
                                        placeholder="https://example.com/photo1.jpg"
                                        value={imageUrls}
                                        onChange={e => setImageUrls(e.target.value)}
                                    />
                                    <button 
                                        onClick={() => handleAddImages(gallery.id)}
                                        className="w-full flex items-center justify-center gap-2 py-2 bg-secondary hover:bg-zinc-200 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <Plus size={14} /> Batch Add Images
                                    </button>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-4">
                                <div className="p-4 bg-secondary/30 rounded-xl space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-muted-foreground">Stats</span>
                                        <span>{gallery.images.length} Photos</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-muted-foreground">Selections</span>
                                        <span className="text-primary">{gallery.images.filter(i => i.isSelected).length} Hearts</span>
                                    </div>
                                    <div className="pt-2 flex gap-2">
                                        <button 
                                            onClick={() => window.open(`/gallery/${gallery.id}`, '_blank')}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
                                        >
                                            <ExternalLink size={14} /> Open Live
                                        </button>
                                        <button 
                                            onClick={() => deleteGallery(gallery.id)}
                                            className="p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image Strip */}
                        <div className="border-t border-border/50 p-4 bg-secondary/10 flex gap-4 overflow-x-auto no-scrollbar">
                            {gallery.images.map(image => (
                                <div key={image.id} className="relative group shrink-0">
                                    <img src={image.url} className="h-20 w-32 object-cover rounded shadow-sm border border-border/50" alt="" />
                                    {image.isSelected && (
                                        <div className="absolute top-1 right-1 bg-primary text-white p-1 rounded-full shadow-lg">
                                            <CheckCircle size={8} />
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => deleteImage(image.id)}
                                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {gallery.images.length === 0 && (
                                <div className="h-20 flex items-center px-4 text-[9px] font-bold text-muted-foreground border-2 border-dashed border-border/50 rounded-lg w-full justify-center opacity-50">
                                    No images yet. Add some URLs above.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
