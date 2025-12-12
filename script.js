/* ============================
FILE: script.js
Path: ./script.js
Description: shared logic for all pages (load/save/render)
============================ */

/* ---------- Storage helpers ---------- */
const STORAGE_KEY = "bookshelf_books_v1";

function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("loadBooks error", e);
    return [];
  }
}

function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

/* ---------- Utils ---------- */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

function findBookById(id) {
  const books = loadBooks();
  return books.find(b => b.id === id);
}

function removeBookById(id) {
  let books = loadBooks();
  books = books.filter(b => b.id !== id);
  saveBooks(books);
  return books;
}

/* ---------- Rendering helpers for Dicoding-required markup ---------- */
function createBookCard(book) {
  const div = document.createElement("div");
  div.className = "book-card";
  div.setAttribute("data-bookid", book.id);
  div.setAttribute("data-testid", "bookItem");

  const img = document.createElement("img");
  img.src = book.coverDataUrl || placeholderImage();
  img.alt = book.title || "cover";

  const h3 = document.createElement("h3");
  h3.setAttribute("data-testid", "bookItemTitle");
  h3.innerText = book.title || "—";

  const p1 = document.createElement("p");
  p1.setAttribute("data-testid", "bookItemAuthor");
  p1.innerText = `Penulis: ${book.author || "—"}`;

  const p2 = document.createElement("p");
  p2.setAttribute("data-testid", "bookItemYear");
  p2.innerText = `Tahun: ${book.year || "—"}`;

  const btnComplete = document.createElement("button");
  btnComplete.setAttribute("data-testid", "bookItemIsCompleteButton");
  btnComplete.className = book.isComplete ? "btn-dark" : "btn-green";
  btnComplete.innerText = book.isComplete ? "Belum" : "Selesai";
  btnComplete.onclick = () => {
    const books = loadBooks();
    const idx = books.findIndex(b => b.id === book.id);
    if (idx > -1) {
      books[idx].isComplete = !books[idx].isComplete;
      if (books[idx].isComplete) books[idx].progress = 100;
      saveBooks(books);
      refreshCurrentPage();
    }
  };

  const btnDelete = document.createElement("button");
  btnDelete.setAttribute("data-testid", "bookItemDeleteButton");
  btnDelete.className = "btn-red";
  btnDelete.innerText = "Hapus";
  btnDelete.onclick = () => {
    if (!confirm("Hapus buku ini?")) return;
    removeBookById(book.id);
    refreshCurrentPage();
  };

  const btnEdit = document.createElement("button");
  btnEdit.setAttribute("data-testid", "bookItemEditButton");
  btnEdit.className = "btn-dark";
  btnEdit.innerText = "Edit";
  btnEdit.onclick = () => {
    window.location.href = `add_book.html?id=${book.id}`;
  };

  // append
  div.appendChild(img);
  div.appendChild(h3);
  div.appendChild(p1);
  div.appendChild(p2);
  div.appendChild(btnComplete);
  div.appendChild(btnDelete);
  div.appendChild(btnEdit);

  // click on image/title -> go detail
  img.style.cursor = "pointer";
  img.onclick = () => window.location.href = `book_detail.html?id=${book.id}`;
  h3.onclick = img.onclick;

  return div;
}

function createSaveCard(book) {
  const wrapper = document.createElement("div");
  wrapper.className = "book-save-card";
  wrapper.setAttribute("data-bookid", book.id);
  wrapper.setAttribute("data-testid", "bookItem");

  const img = document.createElement("img");
  img.src = book.coverDataUrl || placeholderImage();
  img.alt = book.title;

  const info = document.createElement("div");
  info.className = "book-info";

  const titleRow = document.createElement("div");
  titleRow.className = "book-save-title";
  const title = document.createElement("span");
  title.setAttribute("data-testid", "bookItemTitle");
  title.innerText = book.title;
  const yearBadge = document.createElement("span");
  yearBadge.className = "year-badge";
  yearBadge.setAttribute("data-testid", "bookItemYear");
  yearBadge.innerText = book.year || "—";
  titleRow.appendChild(title);
  titleRow.appendChild(yearBadge);

  const author = document.createElement("p");
  author.className = "book-save-author";
  author.setAttribute("data-testid", "bookItemAuthor");
  author.innerText = `Penulis: ${book.author || "—"}`;

  const progArea = document.createElement("div");
  progArea.className = "progress-area";
  const progBar = document.createElement("div");
  progBar.className = "progress-bar-container";
  const progFill = document.createElement("div");
  progFill.className = "progress-bar-fill";
  progFill.style.width = (book.progress || 0) + "%";
  if (!book.isComplete && (book.progress||0) < 100 && (book.progress||0) > 0) progFill.classList.add("orange");
  progBar.appendChild(progFill);
  const progPercent = document.createElement("span");
  progPercent.className = "progress-percent";
  progPercent.innerText = (book.progress || 0) + "%";
  progArea.appendChild(progBar);
  progArea.appendChild(progPercent);

  const btnRow = document.createElement("div");
  btnRow.className = "btn-row";
  const completeBtn = document.createElement("button");
  completeBtn.setAttribute("data-testid","bookItemIsCompleteButton");
  completeBtn.className = book.isComplete ? "btn-dark" : "btn-green";
  completeBtn.innerText = book.isComplete ? "Belum" : "Selesai";
  completeBtn.onclick = () => {
    const books = loadBooks();
    const i = books.findIndex(b => b.id === book.id);
    if (i>-1) {
      books[i].isComplete = !books[i].isComplete;
      if (books[i].isComplete) books[i].progress = 100;
      saveBooks(books);
      refreshCurrentPage();
    }
  };
  const editBtn = document.createElement("button");
  editBtn.setAttribute("data-testid","bookItemEditButton");
  editBtn.className = "btn-dark";
  editBtn.innerText = "Edit";
  editBtn.onclick = () => window.location.href = `add_book.html?id=${book.id}`;
  const delBtn = document.createElement("button");
  delBtn.setAttribute("data-testid","bookItemDeleteButton");
  delBtn.className = "btn-red";
  delBtn.innerText = "Delete";
  delBtn.onclick = () => {
    if (!confirm("Hapus buku ini?")) return;
    removeBookById(book.id);
    refreshCurrentPage();
  };

  btnRow.appendChild(completeBtn);
  btnRow.appendChild(editBtn);
  btnRow.appendChild(delBtn);

  info.appendChild(titleRow);
  info.appendChild(author);
  info.appendChild(progArea);
  info.appendChild(btnRow);

  wrapper.appendChild(img);
  wrapper.appendChild(info);

  // click to detail
  img.style.cursor = "pointer";
  img.onclick = () => window.location.href = `book_detail.html?id=${book.id}`;
  title.onclick = img.onclick;

  return wrapper;
}

function placeholderImage(){
  return "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><rect width='100%' height='100%' fill='#2b2b2b' rx='12'/><text x='50%' y='50%' fill='#aaa' font-size='20' text-anchor='middle' font-family='sans-serif' dy='.3em'>No Cover</text></svg>`);
}

/* ---------- Page renderers ---------- */
function refreshCurrentPage(){ // rerun appropriate renderer based on current page
  const p = location.pathname.split("/").pop();
  if(p === "home.html" || p === "") renderHome();
  else if(p === "explore.html") renderExplore();
  else if(p === "save.html") renderSave();
  else if(p === "add_book.html") renderAddBook();
  else if(p === "book_detail.html") renderBookDetail();
}

/* HOME */
function renderHome() {
  const books = loadBooks();

  const completeCount = books.filter(b => b.isComplete).length;
  const incompleteCount = books.length - completeCount;

  const percentComplete = books.length ? Math.round((completeCount / books.length) * 100) : 0;
  const percentUnread = 100 - percentComplete;

  // =============================
  // RENDER HTML UTAMA
  // =============================
  const container = document.querySelector(".page-container");
  container.innerHTML = `
    <h1 style="font-size:26px;margin-bottom:16px">Selamat Datang 👋</h1>
    <h2 style="font-size:20px;margin-bottom:12px">Di Bookshelf</h2>

    <div class="section-title">Progress Membaca</div>

    <div class="card" style="margin-bottom:20px">
      <p style="margin-bottom:8px; font-weight:600">Selesai (${percentComplete}%)</p>
      <div style="width:100%;height:14px;background:#333;border-radius:10px;overflow:hidden">
        <div style="width:${percentComplete}%;height:100%;background:var(--accent)"></div>
      </div>

      <p style="margin-top:16px;margin-bottom:8px; font-weight:600">Belum Dibaca (${percentUnread}%)</p>
      <div style="width:100%;height:14px;background:#333;border-radius:10px;overflow:hidden">
        <div style="width:${percentUnread}%;height:100%;background:var(--danger)"></div>
      </div>
    </div>

    <div class="section-title">Koleksi Buku Kamu</div>
    <div id="homeScroll" class="home-collection-scroll"></div>

    <div class="section-title" style="margin-top:22px">Buku Terbaru</div>
    <div id="latestBooks"></div>
  `;

  // =============================
  // RENDER KOLEKSI – SLIDER KECIL
  // =============================
  const scrollBox = document.getElementById("homeScroll");

  if (books.length === 0) {
    scrollBox.innerHTML = `<div class="card h-center">Belum ada buku, tambahkan dari icon +</div>`;
  } else {
    books.forEach(b => {
      const card = document.createElement("div");
      card.className = "small-card";
      card.innerHTML = `
        <img src="${b.coverDataUrl || placeholderImage()}">
        <div class="small-card-title">${b.title}</div>
        <div class="small-card-author">${b.author}</div>
      `;
      
      card.onclick = () => location.href = `book_detail.html?id=${b.id}`;
      scrollBox.appendChild(card);
    });
  }
function placeholderImage(){
  // Menggunakan file bukuku.png sebagai placeholder default
  // Jika file tidak ada, browser akan menampilkan icon broken image
  return "bukuku.png";
}
  // =============================
  // RENDER BUKU TERBARU – LIST
  // =============================
  const latestBox = document.getElementById("latestBooks");
  latestBox.innerHTML = "";
  const latest = [...books].slice(-4).reverse();

  latest.forEach(b => {
    const percent = b.progress || 0;

    const item = document.createElement("div");
    item.className = "latest-item";
    item.innerHTML = `
      <img src="${b.coverDataUrl || placeholderImage()}">

      <div class="latest-info">
        <div class="latest-title">${b.title}</div>
        <div class="latest-author">${b.author}</div>

        <div style="display:flex;align-items:center;gap:6px;">
            <div class="latest-progress-bar">
                <div class="latest-progress-fill" style="width:${percent}%"></div>
            </div>
            <div class="latest-percent">${percent}%</div>
        </div>
      </div>
    `;

    function placeholderImage(){
  
  // Jika file tidak ada, browser akan menampilkan icon broken image
  return "bukuku.png";
}

    item.onclick = () => location.href = `book_detail.html?id=${b.id}`;
    latestBox.appendChild(item);
  });
}


/* ========== EXPLORE FINAL (LIST MODE) ========== */
function renderExplore() {
  const books = loadBooks();

  const container = document.querySelector(".page-container");
  container.innerHTML = `
    <h2 style="font-size:26px;margin-bottom:15px;">Jelajahi Buku 📚</h2>

    <input type="text" id="searchInput" 
      class="search-large" 
      placeholder="Cari berdasarkan judul buku...">

    <div class="category-wrap" id="categoryRow"></div>

    <div class="explore-title-row">
      <h1>All Books</h1>
      <span id="exploreCount">0 Buku</span>
    </div>

    <div id="exploreList" class="explore-list"></div>
  `;

  /* Categories */
  const categories = [
    "Semua","Fiction","Non Fiksi","Teknologi",
    "self-help","Sejarah","Sains","biography","business","Lainnya"
  ];

  const catWrap = document.getElementById("categoryRow");
  categories.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    if (i === 0) btn.classList.add("active");
    btn.innerText = c;
    btn.dataset.category = c;
    btn.onclick = () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updateExplore();
    };
    catWrap.appendChild(btn);
  });

  document.getElementById("searchInput").addEventListener("input", updateExplore);

  updateExplore();

  function updateExplore() {
    const term = document.getElementById("searchInput").value.toLowerCase();
    const activeCat = document.querySelector(".category-btn.active").dataset.category;

    let list = books.slice();

    if (activeCat !== "Semua") {
      list = list.filter(b => (b.category || "").toLowerCase().includes(activeCat.toLowerCase()));
    }

    if (term) {
      list = list.filter(b => (b.title || "").toLowerCase().includes(term));
    }

    /* RENDER LIST PANJANG */
    const box = document.getElementById("exploreList");
    box.innerHTML = "";
    
    if (list.length === 0) {
      box.innerHTML = `<div class="card">Tidak ada hasil</div>`;
    }

    list.forEach(b => {
      const percent = b.progress || 0;
      const isComplete = b.isComplete || percent === 100;

      const item = document.createElement("div");
      item.className = "explore-item";

      // Tentukan tombol berdasarkan status buku
      let buttonsHTML = '';
      if (isComplete) {
        // Buku sudah selesai: Tandai Belum, Edit, Hapus
        buttonsHTML = `
          <div class="explore-buttons">
            <button class="btn-ex btn-not" title="Tandai belum selesai">
              <i>📘</i> Tandai Belum
            </button>
            <button class="btn-ex btn-edit">
              <i>✏</i> Edit
            </button>
            <button class="btn-ex btn-del">
              <i>🗑</i> Hapus
            </button>
          </div>
        `;
      } else {
        // Buku belum selesai: Tandai Selesai, Edit, Hapus
        buttonsHTML = `
          <div class="explore-buttons">
            <button class="btn-ex btn-done" title="Tandai selesai">
              <i>✔</i> Tandai Selesai
            </button>
            <button class="btn-ex btn-edit">
              <i>✏</i> Edit
            </button>
            <button class="btn-ex btn-del">
              <i>🗑</i> Hapus
            </button>
          </div>
        `;
      }

      // HTML untuk progress dengan persentase
      const progressHTML = `
      <div class="explore-progress-box">
        <div class="explore-progress-text">${percent}%</div>
        <div class="explore-progress-track">
          <div class="explore-progress-fill ${percent === 100 ? "complete" : ""}" 
              style="width:${percent}%"></div>
        </div>
      </div>
    `;


      item.innerHTML = `
        <img src="${b.coverDataUrl || placeholderImage()}">

        <div class="explore-info">
          <div>
            <div class="explore-title">${b.title}</div>
            <div class="explore-author">${b.author}</div>

            ${progressHTML}
            
            ${isComplete ? '<div class="completed-badge">✓ Selesai</div>' : ''}
          </div>

          ${buttonsHTML}
        </div>
      `;
      function placeholderImage(){
        // Menggunakan file bukuku.png sebagai placeholder default  
        return "bukuku.png";
    }
      // BUTTON LOGIC
      if (isComplete) {
        // Tombol "Tandai Belum" untuk buku selesai
        const btnNot = item.querySelector(".btn-not");
        btnNot.onclick = (e) => {
          e.stopPropagation();
          b.isComplete = false;
          b.progress = 0;
          saveBooks(books);
          updateExplore();
        };
      } else {
        // Tombol "Tandai Selesai" untuk buku belum selesai
        const btnDone = item.querySelector(".btn-done");
        btnDone.onclick = (e) => {
          e.stopPropagation();
          b.isComplete = true;
          b.progress = 100;
          saveBooks(books);
          updateExplore();
        };
      }

      // Tombol Edit (sama untuk kedua kondisi)
      const btnEdit = item.querySelector(".btn-edit");
      btnEdit.onclick = (e) => {
        e.stopPropagation();
        location.href = `add_book.html?id=${b.id}`;
      };

      // Tombol Hapus (sama untuk kedua kondisi)
      const btnDel = item.querySelector(".btn-del");
      btnDel.onclick = (e) => {
        e.stopPropagation();
        if (confirm("Hapus buku ini?")) {
          const idx = books.findIndex(x => x.id === b.id);
          books.splice(idx, 1);
          saveBooks(books);
          updateExplore();
        }
      };

      // CLICK CARD → DETAIL
      item.onclick = () => location.href = `book_detail.html?id=${b.id}`;

      box.appendChild(item);
    });

    document.getElementById("exploreCount").textContent = `${list.length} Buku`;
  }
}



/* ============================
SAVE PAGE (SMALL CARDS)
============================ */
function renderSave() {
  const books = loadBooks();
  const container = document.querySelector(".page-container");
  const total = books.length;
  container.innerHTML = `
    <div class="section-header" style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;margin-bottom:10px">
      <h2 style="font-family:'Montserrat',sans-serif;font-size:20px">Koleksi Buku</h2>
      <span id="totalCollection" style="font-family:'Poppins',sans-serif;font-size:14px;color:var(--accent)">${total} buku</span>
    </div>
    <div style="margin-top:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="font-size:18px">📘 Belum Selesai Dibaca</h3>
        <span id="totalIncomplete" style="font-size:13px;color:orange">0 buku</span>
      </div>
      <div id="incompleteBookList"></div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px;margin-bottom:8px">
        <h3 style="font-size:18px">✅ Selesai Dibaca</h3>
        <span id="totalComplete" style="font-size:13px;color:var(--accent)">0 buku</span>
      </div>
      <div id="completeBookList"></div>
    </div>
  `;

  const incompleteBox = document.getElementById("incompleteBookList");
  const completeBox = document.getElementById("completeBookList");
  incompleteBox.innerHTML = "";
  completeBox.innerHTML = "";

  const incomplete = books.filter(b => !b.isComplete);
  const complete = books.filter(b => b.isComplete);

  document.getElementById("totalIncomplete").innerText = `${incomplete.length} buku`;
  document.getElementById("totalComplete").innerText = `${complete.length} buku`;

  if (incomplete.length === 0) {
    incompleteBox.innerHTML = `<div class="card">Tidak ada buku belum selesai.</div>`;
  } else {
    incomplete.forEach(b => incompleteBox.appendChild(createSaveCard(b)));
  }

  if (complete.length === 0) {
    completeBox.innerHTML = `<div class="card">Tidak ada buku selesai.</div>`;
  } else {
    complete.forEach(b => completeBox.appendChild(createSaveCard(b)));
  }
}

function createSaveCard(book) {
  const percent = book.progress || 0;
  const isComplete = book.isComplete || percent === 100;
  
  // Warna progress bar berdasarkan status
  const progressColor = isComplete ? "var(--accent)" : "orange";
  const progressClass = isComplete ? "" : "orange";

  const card = document.createElement("div");
  card.className = "book-save-card";
  
  card.innerHTML = `
    <img src="${book.coverDataUrl || placeholderImage()}" alt="${book.title}">
    <div class="book-info">
      <div class="book-save-title">
        <span>${book.title}</span>
        <span class="year-badge">${book.year || "-"}</span>
      </div>
      <div class="book-save-author">${book.author || "Tidak diketahui"}</div>
      
      <div class="progress-area">
        <div class="progress-bar-container">
          <div class="progress-bar-fill ${progressClass}" style="width:${percent}%; background-color:${progressColor}"></div>
        </div>
        <div class="progress-percent" style="color:${progressColor}">${percent}%</div>
      </div>
      
      <div class="book-save-actions">
        ${isComplete ? 
          `<button class="btn-save btn-mark-incomplete" data-id="${book.id}">
            <i>📘</i> Tandai Belum
          </button>` : 
          `<button class="btn-save btn-mark-complete" data-id="${book.id}">
            <i>✔</i> Tandai Selesai
          </button>`
        }
        <button class="btn-save btn-edit" data-id="${book.id}">
          <i>✏</i> Edit
        </button>
        <button class="btn-save btn-delete" data-id="${book.id}">
          <i>🗑</i> Hapus
        </button>
      </div>
    </div>
  `;
function placeholderImage(){
  
  return "bukuku.png";
}
  // Event listeners untuk tombol
  const markBtn = card.querySelector(isComplete ? ".btn-mark-incomplete" : ".btn-mark-complete");
  const editBtn = card.querySelector(".btn-edit");
  const deleteBtn = card.querySelector(".btn-delete");

  markBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const books = loadBooks();
    const bookIndex = books.findIndex(b => b.id === book.id);
    
    if (bookIndex !== -1) {
      if (isComplete) {
        // Ubah dari selesai ke belum selesai
        books[bookIndex].isComplete = false;
        books[bookIndex].progress = 0;
      } else {
        // Ubah dari belum selesai ke selesai
        books[bookIndex].isComplete = true;
        books[bookIndex].progress = 100;
      }
      saveBooks(books);
      renderSave(); // Render ulang halaman
    }
  });

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    location.href = `add_book.html?id=${book.id}`;
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("Hapus buku ini?")) {
      const books = loadBooks();
      const bookIndex = books.findIndex(b => b.id === book.id);
      if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        saveBooks(books);
        renderSave(); // Render ulang halaman
      }
    }
  });

  // Klik card untuk ke detail
  card.addEventListener("click", () => {
    location.href = `book_detail.html?id=${book.id}`;
  });

  return card;
}

/* ADD / EDIT BOOK */
function renderAddBook(){
  // form elements exist in HTML; this just wires behavior
  const qs = new URLSearchParams(location.search);
  const editId = qs.get("id");
  const form = document.getElementById("addBookForm");
  const coverInput = document.getElementById("bookCover");
  const titleInput = document.getElementById("bookTitle");
  const authorInput = document.getElementById("bookAuthor");
  const yearInput = document.getElementById("bookYear");
  const descInput = document.getElementById("bookDescription");
  const catButtons = document.querySelectorAll(".category-btn, .cat-card");
  const isCompleteCheckbox = document.getElementById("isComplete");
  const submitBtn = document.getElementById("submitBtn");
  const coverBox = document.getElementById("coverBox");
  const coverPreview = document.getElementById("coverPreview");
  const coverPlaceholder = document.getElementById("coverPlaceholder");
  let currentCoverData = null;

  // --- Category buttons: re-query after DOM load and attach listeners reliably ---
  function bindCategoryButtons() {
    // select both possible classes that may exist in pages (.category-btn or .cat-card)
    const nodes = Array.from(document.querySelectorAll(".category-btn, .cat-card"));
    if (nodes.length === 0) return; // nothing to do

    nodes.forEach(btn => {
      // remove existing listeners
      btn.onclick = null;
      // add new listener
      btn.onclick = () => {
        // remove active from all
        document.querySelectorAll(".category-btn.active, .cat-card.active").forEach(x => x.classList.remove("active"));
        // set active on clicked
        btn.classList.add("active");
      };
    });
  }

  // call once to bind
  bindCategoryButtons();

  // load if editing
  if(editId){
    const book = findBookById(editId);
    if(!book){ 
      alert("Buku tidak ditemukan"); 
      location.href="home.html"; 
      return; 
    }
    
    // Update judul halaman untuk mode edit
    document.querySelector("h2").textContent = "Edit Buku";
    
    // fill form
    if(book.coverDataUrl) {
      currentCoverData = book.coverDataUrl;
      // TAMPILKAN GAMBAR YANG SUDAH ADA
      coverPreview.src = currentCoverData;
      coverPreview.style.display = "block";
      coverPlaceholder.style.display = "none";
    } else {
      // Jika tidak ada gambar, tampilkan placeholder
      coverPreview.style.display = "none";
      coverPlaceholder.style.display = "block";
    }
    
    titleInput.value = book.title || "";
    authorInput.value = book.author || "";
    yearInput.value = book.year || "";
    descInput.value = book.description || "";
    isCompleteCheckbox.checked = !!book.isComplete;
    submitBtn.innerText = "Update Buku";

    // set active category - PERBAIKAN LOGIKA
    if (book.category) {
      const bookCategory = book.category.toLowerCase().trim();
      catButtons.forEach(btn => {
        // Cek data-category terlebih dahulu, lalu innerText
        const btnCategory = (btn.dataset.category || btn.innerText || "").toLowerCase().trim();
        
        if (btnCategory === bookCategory) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
  } else {
    // Mode tambah baru
    submitBtn.innerText = "+ Masukkan Buku ke Rak";
    // Mode tambah baru: pastikan placeholder ditampilkan
    coverPreview.style.display = "none";
    coverPlaceholder.style.display = "block";
    
    // Default kategori ke "Lainnya" untuk buku baru
    setTimeout(() => {
      const defaultCat = document.querySelector('.cat-card[data-category="Other"], .cat-card:contains("Lainnya")');
      if (defaultCat) {
        defaultCat.click();
      }
    }, 100);
  }

  // cover input -> dataURL
  coverInput.addEventListener("change", (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const fr = new FileReader();
    fr.onload = ()=> {
      currentCoverData = fr.result;
      // Update preview setelah upload gambar baru
      coverPreview.src = currentCoverData;
      coverPreview.style.display = "block";
      coverPlaceholder.style.display = "none";
      // Tampilkan tombol hapus jika dalam mode edit
      if (editId) addRemoveCoverButton();
    };
    fr.readAsDataURL(file);
  });

  // checkbox card toggle (if exists)
  const checkCard = document.getElementById("checkCard");
  if(checkCard){
    checkCard.addEventListener("click", (ev)=>{
      if(ev.target !== isCompleteCheckbox) {
        isCompleteCheckbox.checked = !isCompleteCheckbox.checked;
        updateSubmitText();
      }
    });
  }
  
  if(isCompleteCheckbox) {
    isCompleteCheckbox.addEventListener("change", updateSubmitText);
  }
  
  function updateSubmitText(){
    if (!editId) {
      // Hanya untuk mode tambah baru
      submitBtn.innerText = isCompleteCheckbox.checked 
        ? "+ Masukkan Buku ke Rak (Selesai dibaca)" 
        : "+ Masukkan Buku ke Rak (Belum dibaca)";
    }
  }
  
  updateSubmitText();

  // Click → buka file picker
  coverBox.addEventListener("click", () => {
    document.getElementById("bookCover").click();
  });

  // Drag events (UI highlight)
  coverBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    coverBox.style.borderColor = "#00ffc6";
  });
  
  coverBox.addEventListener("dragleave", () => {
    coverBox.style.borderColor = "#333";
  });

  // Drop file
  coverBox.addEventListener("drop", (e) => {
    e.preventDefault();
    coverBox.style.borderColor = "#333";

    const file = e.dataTransfer.files[0];
    if (file) {
      const fr = new FileReader();
      fr.onload = () => {
        currentCoverData = fr.result;
        coverPreview.src = currentCoverData;
        coverPreview.style.display = "block";
        coverPlaceholder.style.display = "none";
        if (editId) addRemoveCoverButton();
      };
      fr.readAsDataURL(file);
    }
  });

  // Tambahkan tombol untuk hapus gambar cover jika sedang edit
  function addRemoveCoverButton() {
    // Hapus tombol yang mungkin sudah ada
    const existingBtn = document.querySelector('.remove-cover-btn');
    if (existingBtn) existingBtn.remove();
    
    // Hanya tambahkan jika sedang edit dan ada gambar
    if (editId && currentCoverData) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-cover-btn';
      removeBtn.innerHTML = '<i>🗑</i> Hapus Cover';
      removeBtn.style.cssText = `
        margin-top: 10px;
        padding: 6px 12px;
        background: #f56565;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      `;
      
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm("Hapus cover buku ini?")) {
          currentCoverData = null;
          coverPreview.style.display = 'none';
          coverPlaceholder.style.display = 'block';
          coverInput.value = ''; // Reset input file
          removeBtn.remove();
        }
      };
      
      coverBox.parentNode.insertBefore(removeBtn, coverBox.nextSibling);
    }
  }
  
  // Panggil fungsi untuk menambah tombol hapus jika dalam mode edit
  if (editId && currentCoverData) {
    setTimeout(addRemoveCoverButton, 100);
  }

  // handle form submit
  form.onsubmit = (ev)=>{
    ev.preventDefault();
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = yearInput.value.trim();
    const desc = descInput.value.trim();
    
    // Cari kategori yang aktif
    const activeButton = [...catButtons].find(b => b.classList.contains("active"));
    let category = "Other"; // default
    
    if (activeButton) {
      // Prioritaskan data-category, lalu innerText
      category = activeButton.dataset.category || activeButton.innerText.trim();
    }
    
    if(!title || !author || !year){ 
      alert("Mohon isi judul, penulis, dan tahun."); 
      return; 
    }

    const books = loadBooks();
    if(editId){
      const idx = books.findIndex(b => b.id === editId);
      if(idx > -1){
        books[idx].title = title;
        books[idx].author = author;
        books[idx].year = year;
        books[idx].description = desc;
        books[idx].category = category;
        
        // Handle cover
        if (currentCoverData === null) {
          // Pengguna ingin menghapus cover
          books[idx].coverDataUrl = null;
        } else if (currentCoverData) {
          // Ada cover baru atau tidak berubah
          books[idx].coverDataUrl = currentCoverData;
        }
        // Jika currentCoverData undefined, biarkan seperti semula
        
        books[idx].isComplete = !!isCompleteCheckbox.checked;
        books[idx].progress = isCompleteCheckbox.checked ? 100 : (books[idx].progress || 0);
        
        saveBooks(books);
        
        // Redirect ke halaman home setelah edit (sesuai permintaan)
        window.location.href = "explore.html";
      }
    } else {
      const newBook = {
        id: uid(),
        title, 
        author, 
        year, 
        description: desc, 
        category,
        coverDataUrl: currentCoverData || null,
        isComplete: !!isCompleteCheckbox.checked,
        progress: isCompleteCheckbox.checked ? 100 : 0,
        createdAt: new Date().toISOString()
      };
      books.push(newBook);
      saveBooks(books);
      window.location.href = "home.html";
    }
  };
}

/* ============================
BOOK DETAIL PAGE
============================ */
function renderBookDetail() {
  const qs = new URLSearchParams(location.search);
  const bookId = qs.get("id");
  
  if (!bookId) {
    alert("Buku tidak ditemukan");
    window.location.href = "home.html";
    return;
  }
  
  const book = findBookById(bookId);
  
  if (!book) {
    alert("Buku tidak ditemukan");
    window.location.href = "home.html";
    return;
  }
  
  // Set data buku
  const coverImg = document.getElementById("cover");
  coverImg.src = book.coverDataUrl || "bukuku.png";
  
  document.getElementById("title").textContent = book.title || "Tanpa Judul";
  document.getElementById("author").textContent = book.author || "Tidak diketahui";
  document.getElementById("desc").textContent = book.description || "Tidak ada deskripsi";
  document.getElementById("detailYear").textContent = book.year || "—";
  document.getElementById("detailCategory").textContent = book.category || "—";
  
  // Set progress
  const progress = book.progress || 0;
  const progressBar = document.getElementById("progressBar");
  const percentLabel = document.getElementById("percentLabel");
  const rangeInput = document.getElementById("rangeInput");
  
  progressBar.style.width = `${progress}%`;
  percentLabel.textContent = `${progress}%`;
  rangeInput.value = progress;
  
  // Set status
  const statusChip = document.getElementById("detailStatus");
  const isComplete = book.isComplete || progress === 100;
  
  if (isComplete) {
    statusChip.textContent = "Selesai";
    statusChip.className = "status-chip green-chip";
    progressBar.style.background = "linear-gradient(90deg, #48bb78, #38a169)";
  } else {
    statusChip.textContent = "Belum selesai";
    statusChip.className = "status-chip orange-chip";
    progressBar.style.background = "linear-gradient(90deg, #ed8936, #dd6b20)";
  }
  
  // Update progress when slider changes
  rangeInput.addEventListener("input", function() {
    const newProgress = parseInt(this.value);
    progressBar.style.width = `${newProgress}%`;
    percentLabel.textContent = `${newProgress}%`;
    
    // Update progress color based on value
    if (newProgress === 100) {
      progressBar.style.background = "linear-gradient(90deg, #48bb78, #38a169)";
    } else if (newProgress >= 50) {
      progressBar.style.background = "linear-gradient(90deg, #4299e1, #3182ce)";
    } else {
      progressBar.style.background = "linear-gradient(90deg, #ed8936, #dd6b20)";
    }
  });
  
  // Save progress when slider is released
  rangeInput.addEventListener("change", function() {
    const newProgress = parseInt(this.value);
    
    // Update book data
    const books = loadBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex !== -1) {
      books[bookIndex].progress = newProgress;
      books[bookIndex].isComplete = newProgress === 100;
      saveBooks(books);
      
      // Update status
      if (newProgress === 100) {
        statusChip.textContent = "Selesai";
        statusChip.className = "status-chip green-chip";
      } else {
        statusChip.textContent = "Belum selesai";
        statusChip.className = "status-chip orange-chip";
      }
    }
  });
  
  // Icon button actions
  document.querySelectorAll(".icon-btn").forEach((btn, index) => {
    btn.addEventListener("click", function() {
      switch(index) {
        case 0: // Favorite
          alert("Buku ditambahkan ke favorit!");
          break;
        case 1: // Share
          if (navigator.share) {
            navigator.share({
              title: book.title,
              text: `Baca "${book.title}" oleh ${book.author}`,
              url: window.location.href
            });
          } else {
            alert("Fitur share tidak didukung di browser ini");
          }
          break;
        case 2: // External
          window.open(`https://www.google.com/search?q=${encodeURIComponent(book.title + " " + book.author)}`, "_blank");
          break;
      }
    });
  });
}
/* ---------- Init on page load ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  // If no books in storage, seed with zero books (do nothing)
  // Ensure refreshCurrentPage binds to current HTML structure
  refreshCurrentPage();

  // Back button(s) handlers
  document.querySelectorAll(".back-btn, .back-arrow").forEach(b=>{
    b.addEventListener("click", ()=> { history.back(); });
  });
});
