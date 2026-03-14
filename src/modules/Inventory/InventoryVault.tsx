import React, { useState } from 'react';
import { useApp } from '../../hooks/AppContext';
import { Package, Plus, Search, ShieldAlert, Tag, Calendar, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EquipmentCategory, EquipmentCondition, EquipmentStatus } from '../../types';

export function InventoryVault() {
  const { equipment, addEquipment, deleteEquipment } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<EquipmentCategory | 'ALL'>('ALL');
  const [isAddingEq, setIsAddingEq] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<EquipmentCategory>('CAMERA');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [condition, setCondition] = useState<EquipmentCondition>('EXCELLENT');
  const [status, setStatus] = useState<EquipmentStatus>('AVAILABLE');
  const [notes, setNotes] = useState('');

  // KPIs
  const totalValue = equipment.reduce((sum, eq) => sum + eq.purchasePrice, 0);
  const itemsInMaintenance = equipment.filter(eq => eq.status === 'MAINTENANCE').length;
  const totalItems = equipment.length;

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purchaseDate || !purchasePrice) return;

    addEquipment({
      id: crypto.randomUUID(),
      name,
      category,
      serialNumber,
      purchaseDate,
      purchasePrice: parseFloat(purchasePrice),
      condition,
      status,
      notes
    });

    setIsAddingEq(false);
    setName('');
    setSerialNumber('');
    setPurchaseDate('');
    setPurchasePrice('');
    setNotes('');
  };

  const filteredEq = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || eq.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (s: EquipmentStatus) => {
    switch (s) {
      case 'AVAILABLE': return 'bg-emerald-500/20 text-emerald-300';
      case 'IN_USE': return 'bg-blue-500/20 text-blue-300';
      case 'MAINTENANCE': return 'bg-amber-500/20 text-amber-300';
      case 'LOST': return 'bg-rose-500/20 text-rose-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getConditionColor = (c: EquipmentCondition) => {
    switch (c) {
      case 'EXCELLENT': return 'text-emerald-400';
      case 'GOOD': return 'text-blue-400';
      case 'FAIR': return 'text-amber-400';
      case 'POOR': return 'text-rose-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-400" />
            Equipment Vault
          </h1>
          <p className="text-gray-400 mt-2">Manage and track all studio hardware assets</p>
        </div>
        <button
          onClick={() => setIsAddingEq(true)}
          className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-5 h-5" />
          Add Asset
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1A1A24] border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-5 h-5 text-emerald-400" />
            <h3 className="text-gray-400 font-medium">Total Asset Value</h3>
          </div>
          <p className="text-3xl font-bold text-white">₹{totalValue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-[#1A1A24] border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <h3 className="text-gray-400 font-medium">Total Items</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalItems} <span className="text-sm font-normal text-gray-500">units</span></p>
        </div>
        <div className="bg-[#1A1A24] border border-gray-800 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <h3 className="text-gray-400 font-medium">In Maintenance</h3>
          </div>
          <p className="text-3xl font-bold text-amber-400">{itemsInMaintenance} <span className="text-sm font-normal text-gray-500">items</span></p>
        </div>
      </div>

      {/* Filters & Ledger */}
      <div className="bg-[#1A1A24] border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0F0F16] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="w-full sm:w-auto px-4 py-2 bg-[#0F0F16] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="ALL">All Categories</option>
            <option value="CAMERA">Cameras</option>
            <option value="LENS">Lenses</option>
            <option value="LIGHTING">Lighting</option>
            <option value="AUDIO">Audio</option>
            <option value="ACCESSORY">Accessories</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-[#13131A] text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Asset Details</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Purchase Info</th>
                <th className="px-6 py-4 font-medium">Condition</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredEq.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No equipment found in the vault.</p>
                  </td>
                </tr>
              ) : (
                filteredEq.map(eq => (
                  <tr key={eq.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{eq.name}</div>
                      {eq.serialNumber && <div className="text-sm text-gray-500 font-mono">SN: {eq.serialNumber}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full font-medium tracking-wide">
                        {eq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">₹{eq.purchasePrice.toLocaleString('en-IN')}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(eq.purchaseDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-medium text-sm ${getConditionColor(eq.condition)}`}>
                      {eq.condition}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${getStatusColor(eq.status)}`}>
                        {eq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteEquipment(eq.id)}
                        className="text-gray-500 hover:text-rose-400 transition-colors text-sm font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddingEq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1A1A24] border border-gray-800 rounded-xl p-4 md:p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Log New Asset</h2>
              
              <form onSubmit={handleAddEquipment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Item Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Sony FE 24-70mm f/2.8 GM II"
                      className="w-full px-4 py-2 bg-[#0F0F16] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full px-4 py-2 bg-[#0F0F16] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="CAMERA">Camera Body</option>
                      <option value="LENS">Lens</option>
                      <option value="LIGHTING">Lighting</option>
                      <option value="AUDIO">Audio</option>
                      <option value="ACCESSORY">Accessory</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Purchase Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={purchasePrice}
                      onChange={e => setPurchasePrice(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0F0F16] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Purchase Date *</label>
                    <input
                      type="date"
                      required
                      value={purchaseDate}
                      onChange={e => setPurchaseDate(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0F0F16] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-800 pt-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Serial Number</label>
                    <input
                      type="text"
                      value={serialNumber}
                      onChange={e => setSerialNumber(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-4 py-2 font-mono bg-[#0F0F16] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Condition</label>
                    <select
                      value={condition}
                      onChange={e => setCondition(e.target.value as any)}
                      className="w-full px-4 py-2 bg-[#0F0F16] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="EXCELLENT">Excellent</option>
                      <option value="GOOD">Good</option>
                      <option value="FAIR">Fair</option>
                      <option value="POOR">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as any)}
                      className="w-full px-4 py-2 bg-[#0F0F16] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="IN_USE">In Use</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Notes</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any additional details..."
                    className="w-full px-4 py-2 bg-[#0F0F16] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingEq(false)}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
                  >
                    Save Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
