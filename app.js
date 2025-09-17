/* FILE: public/js/app.js
   Large front-end JS: navigation, slider, countdown, counters, accordion, subscribe, small utilities.
*/

(function(){
  'use strict';

  // query helpers
  const $ = (s)=> document.querySelector(s);
  const $$ = (s)=> Array.from(document.querySelectorAll(s));

  /* ========== COUNTDOWN ========== */
  const target = new Date('2025-08-09T00:00:00Z');
  function updateCountdown(){
    const el = $('#home-countdown');
    if(!el) return;
    const now = new Date();
    let diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours * (1000*60*60);
    const minutes = Math.floor(diff / (1000*60));
    el.textContent = days + ' days ' + hours + ' hrs ' + minutes + ' mins';
  }
  updateCountdown();
  setInterval(updateCountdown, 60*1000);

  /* ========== ANIMATED COUNTERS ========== */
  function animateCounters(){
    const els = document.querySelectorAll('.stat-num');
    els.forEach(el=>{
      const target = Number(el.dataset.target) || parseInt(el.textContent.replace(/\D/g,'')) || 0;
      el.textContent = '0';
      let current = 0;
      const dur = 900;
      const step = 16;
      const ticks = Math.ceil(dur/step);
      const inc = target / ticks;
      const id = setInterval(()=> {
        current += inc;
        el.textContent = Math.floor(current);
        if(current >= target){ el.textContent = target + (String(el.dataset.suffix || '') || ''); clearInterval(id); }
      }, step);
    });
  }
  document.addEventListener('DOMContentLoaded', animateCounters);

  /* ========== SLIDER ========== */
  const slidesEl = $('#slides');
  let slideIndex = 0;
  function goToSlide(i){
    const slideCount = slidesEl ? slidesEl.children.length : 0;
    if(!slidesEl || slideCount === 0) return;
    slideIndex = (i + slideCount) % slideCount;
    slidesEl.style.transform = `translateX(${-slideIndex * 100}%)`;
  }
  $('#prevSlide') && $('#prevSlide').addEventListener('click', ()=> goToSlide(slideIndex - 1));
  $('#nextSlide') && $('#nextSlide').addEventListener('click', ()=> goToSlide(slideIndex + 1));
  setInterval(()=> goToSlide(slideIndex + 1), 7000);

  /* ========== ACCORDION ========== */
  $$('.acc-head').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const body = btn.nextElementSibling;
      const open = body.style.display === 'block';
      $$('.acc-body').forEach(b=> b.style.display = 'none');
      body.style.display = open ? 'none' : 'block';
    });
  });

  /* ========== SUBSCRIBE FORM ========== */
  const subForm = $('#subscribeForm');
  if(subForm){
    subForm.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(this);
      const email = fd.get('subEmail');
      const msgEl = $('#subMessage');
      if(!email || !/^\S+@\S+\.\S+$/.test(email)){
        showMessage(msgEl, 'Please enter a valid email', true);
        return;
      }
      fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
        .then(r=>r.json()).then(j=>{
          if(j.ok){ showMessage(msgEl, 'Subscribed — thank you!', false); this.reset(); }
          else showMessage(msgEl, 'Subscription failed', true);
        }).catch(()=> showMessage(msgEl, 'Network issue — try again', true));
    });
  }

  function showMessage(el, text, isError){
    if(!el) return;
    el.style.display = 'block';
    el.textContent = text;
    el.style.color = isError ? '#ef4444' : '#14a44d';
    setTimeout(()=> el.style.display = 'none', 3000);
  }

  /* ========== RIBBON ANIMATION ========== */
  $$('.ribbon').forEach((r, i)=>{
    try {
      r.animate([
        { transform: 'translateY(0px) rotate(-1deg)' },
        { transform: 'translateY(-6px) rotate(2deg)' },
        { transform: 'translateY(0px) rotate(-1deg)' }
      ], { duration: 3200 + i*200, iterations: Infinity, easing: 'ease-in-out' });
    } catch(e){}
  });

  /* ========== Accessibility: keyboard shortcuts ========== */
  document.addEventListener('keydown', (e)=>{
    if(e.key.toLowerCase() === 'i') window.location.href = '/impact25';
    if(e.key.toLowerCase() === 'e') window.location.href = '/executive';
  });

  /* ========== Lazy loading for images (progressive) ========== */
  document.querySelectorAll('.masonry img').forEach(img => {
    if('loading' in HTMLImageElement.prototype) img.loading = 'lazy';
  });

  /* ========== Local analytics (simple) ========== */
  try {
    const k='llf_visits'; let v=Number(localStorage.getItem(k)||'0'); v+=1; localStorage.setItem(k,String(v));
    console.log('LLF visits:', v);
  } catch(e){}

})();