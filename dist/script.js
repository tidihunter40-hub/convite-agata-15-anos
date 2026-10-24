(() => {
  const $ = id => document.getElementById(id);
  const stage = $('stage'), invitation = $('invitation'), trigger = $('openEnvelope');
  const rsvpScreen = $('rsvpScreen'), detailsScreen = $('detailsScreen'), dressScreen = $('dressScreen');
  const confirmPresence = $('confirmPresence'), viewLocation = $('viewLocation'), viewDress = $('viewDress');
  const event = window.AGATA_EVENT, musicButton = $('musicControl'), audio = $('ambientAudio');
  let opening = false, selectionPending = false;
  function playOpeningSound() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const context = new AudioContextClass();
      const start = context.currentTime;
      const bell = (offset, frequency, duration, volume) => {
        const tone = context.createOscillator();
        const level = context.createGain();
        tone.type = 'sine';
        tone.frequency.setValueAtTime(frequency, start + offset);
        level.gain.setValueAtTime(0.0001, start + offset);
        level.gain.exponentialRampToValueAtTime(volume, start + offset + 0.025);
        level.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration);
        tone.connect(level).connect(context.destination);
        tone.start(start + offset);
        tone.stop(start + offset + duration + 0.02);
      };
      bell(0, 659.25, 0.95, 0.025);
      bell(0.045, 987.77, 1.15, 0.014);
      const rise = context.createOscillator();
      const riseLevel = context.createGain();
      rise.type = 'sine';
      rise.frequency.setValueAtTime(392, start + 0.65);
      rise.frequency.exponentialRampToValueAtTime(783.99, start + 3.3);
      riseLevel.gain.setValueAtTime(0.0001, start + 0.65);
      riseLevel.gain.exponentialRampToValueAtTime(0.004, start + 1.3);
      riseLevel.gain.exponentialRampToValueAtTime(0.0001, start + 3.35);
      rise.connect(riseLevel).connect(context.destination);
      rise.start(start + 0.65);
      rise.stop(start + 3.4);
      bell(3.35, 1046.5, 1.35, 0.022);
      bell(3.43, 1567.98, 1.45, 0.012);
      if (context.state === 'suspended') context.resume().catch(() => {});
      window.setTimeout(() => context.close().catch(() => {}), 6500);
    } catch { /* O convite continua abrindo se o navegador bloquear áudio. */ }
  }

  $('eventDate').textContent = event.date;
  $('eventTime').textContent = event.time;
  $('venueName').textContent = event.venue;
  $('venueAddress').textContent = event.address;
  $('venueWhen').textContent = event.date + ' ✦ ' + event.time;
  $('mapsLink').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(event.address);
  const phone = String(event.rsvpWhatsApp).replace(/\D/g, '');
  const rsvpLink = $('rsvpWhatsApp');
  rsvpLink.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(event.rsvpMessage);
  const deadline = Date.parse(event.rsvpClosesAt);
  const target = Date.parse(event.eventAt);
  function updateRsvp() {
    const closed = Date.now() >= deadline;
    $('rsvpDeadlineText').hidden = closed;
    $('rsvpClosed').hidden = !closed;
    rsvpLink.hidden = closed;
    $('rsvpHint').hidden = closed;
    $('rsvpExpiredCover').hidden = !closed;
  }
  function updateCountdown() {
    const remaining = Math.max(0, target - Date.now());
    const total = Math.ceil(remaining / 1000);
    const values = [Math.floor(total / 86400), Math.floor(total % 86400 / 3600), Math.floor(total % 3600 / 60), total % 60];
    ['countDays','countHours','countMinutes','countSeconds'].forEach((id, i) => $(id).textContent = String(values[i]).padStart(2, '0'));
    $('countdownFace').hidden = remaining === 0;
    $('countdownComplete').hidden = remaining !== 0;
    updateRsvp();
  }
  let timer;
  function startTimer() {
    window.clearInterval(timer);
    updateCountdown();
    timer = window.setInterval(updateCountdown, 1000);
  }
  startTimer();
  document.addEventListener('visibilitychange', () => document.hidden ? window.clearInterval(timer) : startTimer());
  window.addEventListener('pagehide', () => window.clearInterval(timer));
  window.addEventListener('pageshow', startTimer);
  if (event.musicSrc) {
    audio.src = event.musicSrc;
    musicButton.hidden = false;
    musicButton.classList.add('is-muted');
    musicButton.addEventListener('click', async () => {
      if (audio.paused) {
        try {
          await audio.play();
          musicButton.classList.remove('is-muted');
          musicButton.setAttribute('aria-label', 'Silenciar música');
        } catch { musicButton.classList.add('is-muted'); }
      } else {
        audio.pause();
        musicButton.classList.add('is-muted');
        musicButton.setAttribute('aria-label', 'Ativar música');
      }
    });
  }
  function show(screen, className, focus) {
    stage.classList.add(className);
    invitation.setAttribute('aria-hidden', 'true');
    screen.setAttribute('aria-hidden', 'false');
    focus.focus({ preventScroll: true });
  }
  function back(screen, className, focus) {
    stage.classList.remove(className);
    screen.setAttribute('aria-hidden', 'true');
    invitation.setAttribute('aria-hidden', 'false');
    focus.focus({ preventScroll: true });
  }
  function reveal() {
    stage.classList.remove('is-opening', 'is-unveiling', 'is-settling');
    stage.classList.add('is-open');
    invitation.setAttribute('aria-hidden', 'false');
    confirmPresence.focus({ preventScroll: true });
  }
  trigger.addEventListener('click', () => {
    if (opening) return;
    opening = true;
    playOpeningSound();
    stage.classList.add('is-opening');
    window.setTimeout(() => stage.classList.add('is-card-shown'), 3350);
    window.setTimeout(() => stage.classList.add('is-unveiling', 'is-settling'), 4400);
    window.setTimeout(reveal, 5900);
  });
  $('returnCover').addEventListener('click', () => {
    stage.classList.remove('is-open', 'is-opening', 'is-unveiling', 'is-settling', 'is-card-shown', 'show-rsvp', 'show-details', 'show-dress');
    [invitation, rsvpScreen, detailsScreen, dressScreen].forEach(screen => screen.setAttribute('aria-hidden', 'true'));
    opening = false;
    trigger.focus({ preventScroll: true });
  });
  function pressThen(control, action) {
    if (selectionPending) return;
    selectionPending = true;
    control.classList.add('is-activating');
    window.setTimeout(() => {
      control.classList.remove('is-activating');
      selectionPending = false;
      action();
    }, 340);
  }
  confirmPresence.addEventListener('click', () => pressThen(confirmPresence, () => {
    updateRsvp();
    show(rsvpScreen, 'show-rsvp', $('backFromRsvp'));
  }));
  $('backFromRsvp').addEventListener('click', () => back(rsvpScreen, 'show-rsvp', confirmPresence));
  viewLocation.addEventListener('click', () => pressThen(viewLocation, () => show(detailsScreen, 'show-details', $('returnInvitation'))));
  $('returnInvitation').addEventListener('click', () => back(detailsScreen, 'show-details', viewLocation));
  viewDress.addEventListener('click', () => pressThen(viewDress, () => show(dressScreen, 'show-dress', $('backFromDress'))));
  $('backFromDress').addEventListener('click', () => back(dressScreen, 'show-dress', viewDress));
})();
