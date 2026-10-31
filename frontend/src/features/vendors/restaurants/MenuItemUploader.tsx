import React, { useState, useRef, FormEvent } from 'react';

interface MenuAddon {
  id: string;
  name: string;
  price: number;
}

export const MenuItemUploader: React.FC = () => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState<number>(0);
  const [category, setCategory] = useState('Ala Carte'); // Ala Carte, Combo Meal, Drinks, Dessert
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Custom states for typical restaurant menu structures
  const [isAvailable, setIsAvailable] = useState(true);
  const [prepTime, setPrepTime] = useState<number>(15); // minutes
  const [addons, setAddons] = useState<MenuAddon[]>([]);
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Preview Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Custom Modifiers (e.g. "Extra Rice +20", "Upgrade to Large Drink +35")
  const handleAddAddon = () => {
    if (!newAddonName.trim()) return;
    const newAddon: MenuAddon = {
      id: crypto.randomUUID(),
      name: newAddonName.trim(),
      price: newAddonPrice
    };
    setAddons([...addons, newAddon]);
    setNewAddonName('');
    setNewAddonPrice(0);
  };

  const handleRemoveAddon = (id: string) => {
    setAddons(addons.filter((addon) => addon.id !== id));
  };

  // Form Submission Lifecycle
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const menuItemPayload = {
      itemName,
      description,
      basePrice,
      category,
      isAvailable,
      prepTime,
      addons,
      imageString: imagePreview // Send as base64 string or convert to a FormData blob
    };

    console.log('Dispatching menu item payload to database endpoints:', menuItemPayload);
    // Asynchronous backend processing goes here
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800">Menu Item Uploader</h3>
        <p className="text-sm text-gray-500">Publish a new dish, combo meal, or beverage options to your storefront display panel.</p>
      </div>

      {/* Item Image Dropzone Canvas */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Dish Photo</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition-all bg-gray-50 flex flex-col items-center justify-center min-h-[160px]"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="max-h-40 object-contain rounded-lg shadow-sm" />
          ) : (
            <div className="space-y-1 text-gray-400">
              <span className="block text-3xl">📸</span>
              <p className="text-xs font-semibold text-gray-600">Click to upload menu graphic asset</p>
              <p className="text-[10px] text-gray-400">Supports PNG, JPG, or WebP formats</p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* core identity fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item Title / Name</label>
          <input type="text" required value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="e.g. Sizzling Beef Sisig with Egg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Menu Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-white">
            <option value="Ala Carte">Ala Carte / Single Serving</option>
            <option value="Combo Meal">Rice Combo Meals</option>
            <option value="Beverages">Beverages / Softdrinks</option>
            <option value="Desserts">Desserts & Pastries</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Describe the ingredients, serving portions, or common food allergen parameters..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (PHP)</label>
          <input type="number" required min="0" value={basePrice || ''} onChange={(e) => setBasePrice(Number(e.target.value))} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="₱ 0.00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Average Prep Time (Minutes)</label>
          <input type="number" required min="1" value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
        </div>
      </div>

      {/* SECTION: Item Add-ons & Modifiers Grid */}
      <div className="p-4 border rounded-xl bg-gray-50/50 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-gray-800">Dish Add-ons & Options</h4>
          <p className="text-xs text-gray-500">Provide options for custom sides, sauces, or meal sizes.</p>
        </div>

        <div className="flex gap-2">
          <input type="text" value={newAddonName} onChange={(e) => setNewAddonName(e.target.value)} className="flex-1 p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 bg-white" placeholder="e.g. Extra Plain Rice" />
          <input type="number" value={newAddonPrice || ''} onChange={(e) => setNewAddonPrice(Number(e.target.value))} className="w-24 p-2 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 bg-white" placeholder="₱ Price" />
          <button type="button" onClick={handleAddAddon} className="px-3 bg-gray-800 text-white text-xs font-bold rounded-lg hover:bg-gray-700 transition-all">Add</button>
        </div>

        {addons.length > 0 && (
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {addons.map((addon) => (
              <div key={addon.id} className="flex items-center justify-between p-2 text-xs bg-white border rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">{addon.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-emerald-600">+₱{addon.price.toFixed(2)}</span>
                  <button type="button" onClick={() => handleRemoveAddon(addon.id)} className="text-red-500 font-bold hover:text-red-700">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toggle Operations Status Switch */}
      <div className="flex items-center justify-between p-3 border rounded-xl bg-gray-50">
        <div>
          <p className="text-xs font-bold text-gray-800">Publish Immediately</p>
          <p className="text-[11px] text-gray-500">Uncheck this if the item is out of stock or seasonal.</p>
        </div>
        <button 
          type="button" 
          onClick={() => setIsAvailable(!isAvailable)} 
          className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${isAvailable ? 'bg-emerald-600' : 'bg-gray-400'}`}
        >
          {isAvailable ? 'AVAILABLE' : 'HIDDEN'}
        </button>
      </div>

      {/* Form Submission Action Control */}
      <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-sm rounded-xl shadow transition-all">
        Upload Item to Menu
      </button>
    </form>
  );
};
