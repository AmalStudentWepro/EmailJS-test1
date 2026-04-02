  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
  import { getDatabase, ref, onValue, set, increment, serverTimestamp, onDisconnect, get }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

  const firebaseConfig = {
  apiKey:            "AIzaSyDQQjI8QgB0LV_cgvgpUWvgWLrTqdCqlQ4",
  authDomain:        "dexomi-dev1.firebaseapp.com",
  databaseURL:       "https://dexomi-dev1-default-rtdb.firebaseio.com",
  projectId:         "dexomi-dev1",
  storageBucket:     "dexomi-dev1.firebasestorage.app",
  messagingSenderId: "305192876608",
  appId:             "1:305192876608:web:4ecf585367de909949bda5"
};

  const app = initializeApp(firebaseConfig);
  const db  = getDatabase(app);

  const MAX = 100;
  const circumference = 2 * Math.PI * 100; // 628

  function updateCircle(count) {
    const n = Math.min(count, MAX);
    const offset = circumference - (n / MAX) * circumference;
    document.getElementById('circleFill').style.strokeDashoffset = offset;
    document.getElementById('onlineCount').textContent = count;
    document.getElementById('statTime').textContent =
      new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const sessionRef = ref(db, 'presence/' + Math.random().toString(36).slice(2));
  set(sessionRef, true);
  onDisconnect(sessionRef).remove();

  onValue(ref(db, 'presence'), snap => {
    const count = snap.exists() ? Object.keys(snap.val()).length : 0;
    updateCircle(count);

    const maxRef = ref(db, 'stats/maxToday');
    get(maxRef).then(s => {
      const cur = s.exists() ? s.val() : 0;
      if (count > cur) set(maxRef, count);
      document.getElementById('statMax').textContent = Math.max(count, cur);
    });
  });

  const totalRef = ref(db, 'stats/totalVisits');
  set(totalRef, increment(1));
  onValue(totalRef, snap => {
    document.getElementById('statTotal').textContent = snap.exists() ? snap.val() : 0;
  });