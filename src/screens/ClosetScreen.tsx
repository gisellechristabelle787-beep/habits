import { Shirt, ShoppingBag, Coins as CoinsIcon, Check, Heart, Shield } from 'lucide-react';
import { useState } from 'react';
import { Header } from '../components/Header';
import { COMPANIONS, ItemType, SHOP_ITEMS, ShopItem, useAppContext } from '../AppContext';

export function ClosetScreen() {
  const { equippedCompanionId, equippedOutfitId, coins, ownedItems, health, buyItem, equipOutfit } = useAppContext();
  const currentCompanion = COMPANIONS.find(c => c.id === equippedCompanionId) || COMPANIONS[0];
  const currentOutfit = SHOP_ITEMS.find(i => i.id === equippedOutfitId);
  const [activeTab, setActiveTab] = useState<'shop' | 'closet'>('shop');
  const [activeCategory, setActiveCategory] = useState<ItemType>('clothing');

  const categories: { id: ItemType; label: string }[] = [
    { id: 'clothing', label: 'Clothing' },
    { id: 'accessory', label: 'Accessories' },
    { id: 'furniture', label: 'Furniture' }
  ];

  const displayedItems = SHOP_ITEMS.filter(item => {
    if (item.type !== activeCategory) return false;
    if (activeTab === 'closet') return ownedItems.includes(item.id);
    return true; // allow showing all or unowned in shop. Let's show all in shop.
  });

  return (
    <div className="min-h-screen font-body-md pb-32">
      <Header title="Shop" />

      <main className="pt-2 px-container-padding space-y-stack-lg max-w-2xl mx-auto">
        
        {/* Toggle Shop/Closet */}
        <div className="flex bg-surface-container-low rounded-full p-1 mt-4 shadow-inner border border-outline-variant/20">
           <button 
             onClick={() => setActiveTab('shop')}
             className={`flex-1 py-2 font-label-caps text-[12px] uppercase tracking-widest rounded-full transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'shop' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
           >
             <ShoppingBag className="w-4 h-4" /> Shop
           </button>
           <button 
             onClick={() => setActiveTab('closet')}
             className={`flex-1 py-2 font-label-caps text-[12px] uppercase tracking-widest rounded-full transition-all duration-300 flex justify-center items-center gap-2 ${activeTab === 'closet' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
           >
             <Shirt className="w-4 h-4" /> Closet
           </button>
        </div>

        {/* Avatar Preview Section */}
        <section className="relative w-full aspect-square max-w-[300px] mx-auto rounded-[2rem] overflow-hidden glass-card p-4 group mt-4">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-container/20 to-transparent"></div>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="w-4/5 transform transition-transform duration-500 ease-out drop-shadow-2xl">
              <img 
                alt="Mascot Preview" 
                className="w-full h-auto drop-shadow-2xl relative z-10" 
                src={currentCompanion.image} 
                style={{ filter: currentCompanion.filter }}
              />
            </div>
            {currentOutfit && (
               <div className="absolute top-4 left-4 max-w-[120px] bg-primary-container px-3 py-1.5 rounded-2xl shadow-sm border border-primary/20">
                 <p className="font-label-caps text-[10px] text-on-primary-container uppercase truncate">{currentOutfit.name}</p>
               </div>
            )}
          </div>
        </section>

        {/* Category Tabs */}
        <section className="flex bg-surface-container-low/50 rounded-2xl p-1 gap-1 overflow-x-auto hide-scrollbar">
          {categories.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveCategory(cat.id)}
               className={`flex-shrink-0 px-4 py-2 font-label-caps text-[11px] rounded-xl transition-all duration-300 font-bold uppercase ${activeCategory === cat.id ? 'bg-secondary text-on-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
             >
               {cat.label}
             </button>
          ))}
        </section>

        {/* Items Grid */}
        <section className="grid grid-cols-2 gap-4">
          {displayedItems.length === 0 && (
            <div className="col-span-2 text-center py-8 text-on-surface-variant font-label-caps text-[12px] uppercase opacity-70">
              {activeTab === 'closet' ? "You don't own any items here yet." : "No items available."}
            </div>
          )}
          {displayedItems.map(item => {
            const isOwned = ownedItems.includes(item.id);
            const isEquipped = equippedOutfitId === item.id;
            const canAfford = coins >= item.price;
            
            return (
              <div key={item.id} className={`glass-card rounded-3xl p-4 flex flex-col items-center gap-3 relative transition-all ${isEquipped ? 'border-2 border-primary shadow-xl bg-primary-container/20' : 'border-2 border-transparent hover:border-primary-container/50'}`}>
                {isEquipped && <div className="absolute top-2 right-2 bg-primary text-on-primary rounded-full px-2 py-0.5 font-ui-pixel-sm text-[8px] uppercase tracking-wider shrink-0 z-10">EQUIPPED</div>}
                
                <div className="w-full aspect-square bg-surface-container-low rounded-2xl flex items-center justify-center p-3 relative overflow-hidden text-[36px]">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className={`w-full h-full object-contain ${!isOwned ? 'opacity-50 grayscale' : 'drop-shadow-sm'}`} />
                  ) : item.icon ? (
                    <span className={!isOwned ? 'opacity-50 grayscale' : 'drop-shadow-sm'}>{item.icon}</span>
                  ) : (
                    <>
                      {item.type === 'clothing' && <Shirt className={`w-8 h-8 ${isOwned ? 'text-primary' : 'text-on-surface-variant'}`} />}
                      {item.type === 'hat' && <Shield className={`w-8 h-8 ${isOwned ? 'text-secondary' : 'text-on-surface-variant'}`} />}
                      {item.type === 'accessory' && <Shield className={`w-8 h-8 ${isOwned ? 'text-tertiary' : 'text-on-surface-variant'}`} />}
                      {item.type === 'furniture' && <Check className={`w-8 h-8 ${isOwned ? 'text-[#f59e0b]' : 'text-on-surface-variant'}`} />}
                    </>
                  )}
                </div>
                
                <div className="text-center w-full">
                  <h3 className="font-bold text-on-surface text-[12px] truncate px-1">{item.name}</h3>
                  {!isOwned && (
                     <p className={`text-[10px] font-label-caps mt-1 flex items-center justify-center gap-1 font-bold ${canAfford ? 'text-[#f59e0b]' : 'text-error'}`}>
                       <CoinsIcon className="w-3 h-3" /> {item.price}
                     </p>
                  )}
                </div>

                {activeTab === 'shop' && !isOwned && (
                  <button 
                    disabled={!canAfford}
                    onClick={() => buyItem(item.id, item.price)}
                    className={`w-full py-2 rounded-xl font-bold font-label-caps text-[10px] uppercase tracking-widest transition-transform ${canAfford ? 'bg-primary text-on-primary active:scale-95 shadow-md' : 'bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed'}`}
                  >
                    Buy
                  </button>
                )}
                
                {(isOwned) && item.type !== 'furniture' && (
                  <button 
                    onClick={() => equipOutfit(item.id)}
                    className={`w-full py-2 rounded-xl font-bold font-label-caps text-[10px] uppercase tracking-widest active:scale-95 transition-all ${isEquipped ? 'bg-inverse-surface text-inverse-on-surface shadow-md' : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'}`}
                  >
                    {isEquipped ? 'Unequip' : 'Equip'}
                  </button>
                )}

                 {(isOwned) && item.type === 'furniture' && (
                  <div className="w-full py-2 text-center text-on-surface-variant font-label-caps text-[9px] uppercase tracking-widest opacity-80 border border-outline-variant/30 rounded-xl">
                    In Room
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
