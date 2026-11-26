// Tirana Caffe: mobile menu, the live "Open / Closed" door sign and the reservation ticket.
(function () {
  'use strict';

  // ---- mobile navigation (full-screen panel)
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('nav-panel');
  function setNav(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setNav(panel.hidden); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { setNav(false); toggle.focus(); }
  });

  // ---- on phones, each bakery tag carries its own drawing
  document.querySelectorAll('.shelf svg').forEach(function (svg, i) {
    var tag = document.querySelectorAll('.tags .tag')[i];
    if (!tag) return;
    var copy = svg.cloneNode(true);
    copy.setAttribute('class', 'art');
    copy.setAttribute('aria-hidden', 'true');
    tag.insertBefore(copy, tag.firstChild);
  });

  // ---- door sign: open Monday to Saturday, 08:00 to 22:00
  var sign = document.getElementById('sign');
  var state = document.getElementById('sign-state');
  var when = document.getElementById('sign-when');
  function updateSign() {
    var now = new Date();
    var d = now.getDay();
    var h = now.getHours() + now.getMinutes() / 60;
    var open = d !== 0 && h >= 8 && h < 22;
    sign.classList.toggle('closed', !open);
    state.textContent = open ? 'Open' : 'Closed';
    if (open) when.textContent = 'until 22:00 today';
    else if (d !== 0 && h < 8) when.textContent = 'opening at 08:00';
    else if (d === 0 || d === 6) when.textContent = 'see you Monday at 08:00';
    else when.textContent = 'see you tomorrow at 08:00';
  }
  updateSign();
  setInterval(updateSign, 60000);

  // ---- reservation ticket
  var form = document.getElementById('booking');
  var date = document.getElementById('date');
  var time = document.getElementById('time');
  var occasion = document.getElementById('occasion');
  var done = document.getElementById('booking-done');

  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  var today = new Date();
  date.min = iso(today);
  var first = new Date(today);
  if (first.getHours() >= 21 || first.getDay() === 0) first.setDate(first.getDate() + 1);
  if (first.getDay() === 0) first.setDate(first.getDate() + 1);
  date.value = iso(first);

  var slots = {
    'breakfast': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'],
    'lunch or dinner': ['12:00', '12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00'],
    'high tea': ['15:00', '15:30', '16:00', '16:30', '17:00']
  };
  function fillTimes() {
    var keep = time.value;
    time.innerHTML = '';
    slots[occasion.value].forEach(function (t) {
      var o = document.createElement('option');
      o.textContent = t;
      time.appendChild(o);
    });
    if (slots[occasion.value].indexOf(keep) > -1) time.value = keep;
  }
  occasion.addEventListener('change', fillTimes);
  fillTimes();

  // "Book high tea" picks the occasion for you
  document.querySelectorAll('[data-occasion]').forEach(function (a) {
    a.addEventListener('click', function () {
      occasion.value = a.dataset.occasion.toLowerCase();
      fillTimes();
    });
  });

  function check(input, ok) {
    var err = document.getElementById(input.id + '-error');
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) {
      err.hidden = ok;
      if (ok) input.removeAttribute('aria-describedby');
      else input.setAttribute('aria-describedby', err.id);
    }
    return ok;
  }
  function validDate() {
    if (!date.value) return false;
    var d = new Date(date.value + 'T12:00:00');
    return date.value >= date.min && d.getDay() !== 0;
  }

  ['name', 'phone'].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('blur', function () {
      if (el.value) check(el, id === 'name' ? el.value.trim() !== '' : el.checkValidity());
    });
  });
  date.addEventListener('change', function () { check(date, validDate()); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('name');
    var phone = document.getElementById('phone');
    var ok = [check(date, validDate()), check(name, name.value.trim() !== ''), check(phone, phone.checkValidity())];
    if (ok.indexOf(false) > -1) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    // No server yet: this is where the request would be sent.
    var day = new Date(date.value + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    var guests = document.getElementById('guests').value;
    done.textContent = 'Thank you, ' + name.value.trim() + '. A table for ' + guests + ' on ' + day +
      ' at ' + time.value + ' — we will call you to confirm.';
    done.hidden = false;
    form.querySelector('.send').textContent = 'Request sent';
  });
})();
