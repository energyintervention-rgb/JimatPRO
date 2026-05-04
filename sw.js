// ============================================================
// QUICK-ADD PRODUCT LIST — paste before </script>
// ============================================================
const QUICK_PRODUCTS = {
  my: {
    'Beras & Bijirin': ['Beras 5kg','Beras 10kg','Oat Quaker','Milo Cereal','Cornflakes'],
    'Minuman': ['Milo 1kg','Milo 400g','Nescafe 200g','Nestea 500g','Teh Tarik 1L','Ribena 1L'],
    'Susu & Dairy': ['Susu Segar 1L','Dutch Lady 1L','F&N 1L','Susu Pekat 500g','Yakult 5biji','Yogurt 135g'],
    'Roti & Biskut': ['Gardenia 400g','High 5 400g','Merry 400g','Biskut Marie','Crackers','Roti Canai'],
    'Mi & Pasta': ['Maggi Mee 5bungkus','Mee Segera 5bungkus','Bihun','Mihun','Mi Kuning'],
    'Minyak & Sos': ['Minyak Masak 1L','Minyak Masak 2L','Sos Tomato','Sos Cili','Kicap 500ml','Sos Tiram'],
    'Tepung & Gula': ['Tepung Gandum 1kg','Gula Pasir 1kg','Gula Perang 1kg','Tepung Beras'],
    'Sabun & Pencuci': ['Sabun Mandi','Shampoo','Pencuci Pinggan','Detergen 1kg','Softlan 1L'],
    'Barang Dapur': ['Garam 1kg','Lada Hitam','Kunyit','Santan 200ml','Telur 10biji','Telur 30biji'],
    'Buah & Sayur': ['Pisang','Epal','Tomato 500g','Bawang Besar','Bawang Putih','Bayam','Kangkung'],
    'Daging & Ayam': ['Ayam 1kg','Ayam 1.5kg','Daging 500g','Ikan Bilis 250g','Udang 500g'],
    'Bayi': ['Susu Formula 900g','Lampin','Bedak Bayi','Minyak Bayi'],
  },
  en: {
    'Rice & Grains': ['Rice 5kg','Rice 10kg','Quaker Oat','Milo Cereal','Cornflakes'],
    'Drinks': ['Milo 1kg','Milo 400g','Nescafe 200g','Nestea 500g','Teh Tarik 1L','Ribena 1L'],
    'Milk & Dairy': ['Fresh Milk 1L','Dutch Lady 1L','F&N Milk 1L','Condensed Milk 500g','Yakult 5pcs'],
    'Bread & Biscuits': ['Gardenia 400g','High 5 400g','Marie Biscuit','Crackers','Roti Canai'],
    'Noodles': ['Maggi Mee 5pcs','Instant Noodle 5pcs','Vermicelli','Yellow Noodle'],
    'Oil & Sauce': ['Cooking Oil 1L','Cooking Oil 2L','Tomato Sauce','Chilli Sauce','Soy Sauce 500ml'],
    'Flour & Sugar': ['Wheat Flour 1kg','White Sugar 1kg','Brown Sugar 1kg','Rice Flour'],
    'Soap & Cleaning': ['Soap','Shampoo','Dish Wash','Detergent 1kg','Softlan 1L'],
    'Kitchen': ['Salt 1kg','Black Pepper','Turmeric','Coconut Milk 200ml','Eggs 10pcs','Eggs 30pcs'],
    'Fruits & Veg': ['Banana','Apple','Tomato 500g','Onion','Garlic','Spinach'],
    'Meat & Seafood': ['Chicken 1kg','Chicken 1.5kg','Beef 500g','Anchovies 250g','Prawn 500g'],
    'Baby': ['Formula Milk 900g','Diapers','Baby Powder','Baby Oil'],
  }
};

function showQuickAdd() {
  const existing = document.getElementById('quick-add-overlay');
  if (existing) { existing.remove(); return; }

  const overlay = document.createElement('div');
  overlay.id = 'quick-add-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:flex-end;';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

  const panel = document.createElement('div');
  panel.style.cssText = 'background:var(--bg2);width:100%;max-height:75vh;border-radius:20px 20px 0 0;overflow:hidden;display:flex;flex-direction:column;';

  // Header
  const header = document.createElement('div');
  header.style.cssText = 'padding:14px 16px 10px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;';
  const hTitle = document.createElement('div');
  hTitle.style.cssText = 'font-family:Syne,sans-serif;font-size:0.9rem;font-weight:700;color:var(--gold);';
  hTitle.textContent = '\uD83D\uDED2 ' + (lang==='my'?'Pilih Produk':'Select Product');
  const hClose = document.createElement('button');
  hClose.textContent = '\u2715';
  hClose.style.cssText = 'background:none;border:none;color:var(--text3);font-size:1.2rem;cursor:pointer;';
  hClose.onclick = function() { overlay.remove(); };
  header.appendChild(hTitle);
  header.appendChild(hClose);
  panel.appendChild(header);

  // Search
  const searchWrap = document.createElement('div');
  searchWrap.style.cssText = 'padding:8px 12px;flex-shrink:0;';
  const searchInp = document.createElement('input');
  searchInp.type = 'text';
  searchInp.placeholder = lang==='my'?'Cari produk...':'Search product...';
  searchInp.style.cssText = 'width:100%;padding:8px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--bg3);color:var(--text);font-family:DM Mono,monospace;font-size:0.75rem;';
  searchWrap.appendChild(searchInp);
  panel.appendChild(searchWrap);

  // Product list
  const listWrap = document.createElement('div');
  listWrap.style.cssText = 'overflow-y:auto;flex:1;padding:8px 12px 24px;';

  function renderProducts(filter) {
    listWrap.innerHTML = '';
    const cats = QUICK_PRODUCTS[lang] || QUICK_PRODUCTS['my'];
    Object.keys(cats).forEach(function(cat) {
      const products = cats[cat].filter(function(p) {
        return !filter || p.toLowerCase().includes(filter.toLowerCase());
      });
      if (!products.length) return;
      const catLabel = document.createElement('div');
      catLabel.style.cssText = 'font-size:0.58rem;color:var(--text3);letter-spacing:0.1em;text-transform:uppercase;margin:10px 0 5px;';
      catLabel.textContent = cat;
      listWrap.appendChild(catLabel);
      const grid = document.createElement('div');
      grid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';
      products.forEach(function(prod) {
        const chip = document.createElement('button');
        chip.textContent = prod;
        chip.style.cssText = 'padding:6px 12px;border-radius:20px;border:1.5px solid var(--border2);background:var(--bg3);color:var(--text2);font-family:DM Mono,monospace;font-size:0.68rem;cursor:pointer;white-space:nowrap;';
        chip.onclick = function() { addItemWithProduct(prod); overlay.remove(); };
        chip.onmouseover = function() { chip.style.borderColor='var(--gold)'; chip.style.color='var(--gold)'; };
        chip.onmouseout = function() { chip.style.borderColor='var(--border2)'; chip.style.color='var(--text2)'; };
        grid.appendChild(chip);
      });
      listWrap.appendChild(grid);
    });
  }

  renderProducts('');
  searchInp.oninput = function() { renderProducts(searchInp.value); };
  panel.appendChild(listWrap);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
  setTimeout(function() { searchInp.focus(); }, 150);
}

function addItemWithProduct(productName) {
  items.push({ name: productName, price: '', qty: '', unit: 'g', store: '', discount: '' });
  renderItems();
  setTimeout(function() {
    const cards = document.querySelectorAll('.item-card');
    if (cards.length) cards[cards.length-1].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}
