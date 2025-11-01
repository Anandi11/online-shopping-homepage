/* Simple chocolate shop script
   - contains product data
   - renders product cards
   - implements a small cart with localStorage persistence
*/
(function(){
  const products = [
    {id:'c1',name:'Dark Velvet',price:6.5,desc:'70% dark chocolate truffle.',color:['#3b1f17','#8b4b2b']},
    {id:'c2',name:'Milky Dream',price:5.0,desc:'Creamy milk chocolate with hazelnut.',color:['#a05a3d','#f3d0c6']},
    {id:'c3',name:'Salted Caramel',price:7.25,desc:'Caramel center with a hint of sea salt.',color:['#8b5e3c','#ffd9b8']},
    {id:'c4',name:'Mint Whisper',price:5.75,desc:'Refreshing mint cream covered in chocolate.',color:['#2f5b3b','#dff0e3']},
    {id:'c5',name:'Orange Zest',price:6.9,desc:'Chocolate infused with citrus notes.',color:['#7a3a2c','#ffd6a6']},
    {id:'c6',name:'Hazelnut Crunch',price:8.0,desc:'Crunchy hazelnut studded chocolate.',color:['#5b3826','#f4e6dd']}
  ];

  const $ = id=>document.getElementById(id);
  const productsEl = $('products');
  const cartBtn = $('cart-btn');
  const cartDrawer = $('cart-drawer');
  const closeCart = $('close-cart');
  const cartItemsEl = $('cart-items');
  const cartCount = $('cart-count');
  const cartTotal = $('cart-total');
  const checkoutBtn = $('checkout-btn');
  const toast = $('toast');

  // Simple cart stored as {id: qty}
  let cart = JSON.parse(localStorage.getItem('choco_cart')||'{}');

  function saveCart(){ localStorage.setItem('choco_cart', JSON.stringify(cart)); }

  function emitToast(msg){ toast.textContent = msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1800); }

  function renderProducts(){
    productsEl.innerHTML = '';
    products.forEach(p=>{
      const card = document.createElement('article'); card.className='card';
      card.innerHTML = `
        <div class="product-img" aria-hidden="true">
          <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect rx="10" width="140" height="100" fill="${p.color[1]}"/>
            <circle cx="36" cy="46" r="22" fill="${p.color[0]}" opacity="0.95" />
          </svg>
        </div>
        <div>
          <div class="product-title">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="price">$${p.price.toFixed(2)}</div>
        </div>
        <div style="display:flex;gap:.5rem;margin-top:.6rem">
          <button class="btn" data-id="${p.id}" data-action="info">Info</button>
          <button class="btn-add" data-id="${p.id}" data-action="add">Add</button>
        </div>
      `;
      productsEl.appendChild(card);
    });
  }

  function cartSummary(){
    let count=0; let total=0;
    for(const id in cart){
      const qty = cart[id];
      const p = products.find(x=>x.id===id);
      if(!p) continue;
      count += qty; total += qty * p.price;
    }
    cartCount.textContent = count;
    cartTotal.textContent = total.toFixed(2);
  }

  function renderCart(){
    cartItemsEl.innerHTML='';
    if(Object.keys(cart).length===0){
      cartItemsEl.innerHTML = '<div style="color:#666;padding:1rem">Your cart is empty.</div>';
      cartSummary();
      return;
    }
    for(const id in cart){
      const qty = cart[id];
      const p = products.find(x=>x.id===id);
      if(!p) continue;
      const item = document.createElement('div'); item.className='cart-item';
      item.innerHTML = `
        <div style="width:64px;height:48px;border-radius:6px;background:${p.color[1]};display:flex;align-items:center;justify-content:center">
          <div style="width:34px;height:34px;border-radius:50%;background:${p.color[0]}"></div>
        </div>
        <div class="meta">
          <div style="font-weight:600">${p.name}</div>
          <div style="color:#777;font-size:.9rem">$${p.price.toFixed(2)} each</div>
          <div class="qty">
            <button class="btn" data-id="${id}" data-action="dec">-</button>
            <span style="padding:.2rem .6rem">${qty}</span>
            <button class="btn" data-id="${id}" data-action="inc">+</button>
            <button class="btn" data-id="${id}" data-action="rm" style="margin-left:8px">Remove</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(item);
    }
    cartSummary();
  }

  // Click handlers
  document.addEventListener('click', e=>{
    const btn = e.target.closest('button'); if(!btn) return;
    const action = btn.dataset.action; const id = btn.dataset.id;
    if(action==='add' && id){ cart[id] = (cart[id]||0)+1; saveCart(); renderCart(); cartSummary(); emitToast('Added to cart'); }
    if(action==='info' && id){ const p=products.find(x=>x.id===id); emitToast(p.name + ' — $'+p.price.toFixed(2)); }
    if(action==='inc' && id){ cart[id] = (cart[id]||0)+1; saveCart(); renderCart(); }
    if(action==='dec' && id){ if(cart[id]>1){ cart[id]--; } else { delete cart[id]; } saveCart(); renderCart(); }
    if(action==='rm' && id){ delete cart[id]; saveCart(); renderCart(); cartSummary(); }
  });

  // Drawer open/close
  cartBtn.addEventListener('click', ()=>{cartDrawer.setAttribute('aria-hidden','false');});
  closeCart.addEventListener('click', ()=>{cartDrawer.setAttribute('aria-hidden','true');});

  checkoutBtn.addEventListener('click', ()=>{
    if(Object.keys(cart).length===0){ emitToast('Your cart is empty'); return; }
    // Simulate checkout
    const items = Object.entries(cart).map(([id,qty])=>`${qty}x ${products.find(p=>p.id===id).name}`).join(', ');
    alert('Order placed!\n' + items + '\nThank you — this is a demo checkout.');
    cart = {}; saveCart(); renderCart(); cartDrawer.setAttribute('aria-hidden','true'); cartSummary();
  });

  // Small UI init
  document.getElementById('year').textContent = new Date().getFullYear();
  renderProducts(); renderCart(); cartSummary();
})();
