let produits = JSON.parse(localStorage.getItem('produits')) || [];
let strategies = JSON.parse(localStorage.getItem('strategies')) || [];
let marketing = JSON.parse(localStorage.getItem('marketing')) || [];
let ventes = JSON.parse(localStorage.getItem('ventes')) || [];

// Afficher une section
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
  
  if (sectionId === 'produits') chargerProduits();
  if (sectionId === 'strategies') chargerStrategies();
  if (sectionId === 'marketing') chargerMarketing();
  if (sectionId === 'ventes') {
    chargerVentes();
    chargerOptionsProduits();
  }
  if (sectionId === 'dashboard') updateDashboard();
}

// Produits
function ajouterProduit() {
  document.getElementById('modalProduit').classList.remove('hidden');
  document.getElementById('modalTitle').textContent = 'Nouveau reproducteur / lot';
  document.getElementById('formProduit').reset();
  document.getElementById('editIndex').value = '';
}

function sauvegarderProduit(e) {
  e.preventDefault();
  
  const produit = {
    race: document.getElementById('race').value,
    nom: document.getElementById('nom').value,
    age: parseInt(document.getElementById('age').value),
    stock: parseInt(document.getElementById('stock').value),
    cout: parseFloat(document.getElementById('cout').value),
    prixVente: parseFloat(document.getElementById('prixVente').value)
  };

  const editIndex = document.getElementById('editIndex').value;
  
  if (editIndex !== '') {
    produits[editIndex] = produit;
  } else {
    produits.push(produit);
  }
  
  localStorage.setItem('produits', JSON.stringify(produits));
  closeModal();
  chargerProduits();
  updateDashboard();
}

function chargerProduits() {
  const tbody = document.querySelector('#tableProduits tbody');
  tbody.innerHTML = '';
  
  produits.forEach((p, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = 
      <td>${p.race}</td>
      <td>${p.nom}</td>
      <td>${p.age}</td>
      <td><strong>${p.stock}</strong></td>
      <td>${p.cout.toFixed(2)} €</td>
      <td>${p.prixVente.toFixed(2)} €</td>
      <td>
        <button onclick="editerProduit(${index})">✏️</button>
        <button onclick="supprimerProduit(${index})">🗑️</button>
      </td>
    ;
    tbody.appendChild(tr);
  });
}

function editerProduit(index) {
  const p = produits[index];
  document.getElementById('modalProduit').classList.remove('hidden');
  document.getElementById('modalTitle').textContent = 'Modifier reproducteur';
  
  document.getElementById('race').value = p.race;
  document.getElementById('nom').value = p.nom;
  document.getElementById('age').value = p.age;
  document.getElementById('stock').value = p.stock;
  document.getElementById('cout').value = p.cout;
  document.getElementById('prixVente').value = p.prixVente;
  document.getElementById('editIndex').value = index;
}

function supprimerProduit(index) {
  if (confirm('Supprimer ce lot ?')) {
    produits.splice(index, 1);
    localStorage.setItem('produits', JSON.stringify(produits));
    chargerProduits();
    updateDashboard();
  }
}

function closeModal() {
  document.getElementById('modalProduit').classList.add('hidden');
}

// Stratégies
function ajouterStrategie() {
  const nom = prompt("Nom de la stratégie (ex: Vente reproducteurs printemps) ?");
  if (!nom) return;
  
  const desc = prompt("Description / tactique :");
  strategies.push({nom, desc, date: new Date().toLocaleDateString()});
  localStorage.setItem('strategies', JSON.stringify(strategies));
  chargerStrategies();
}

function chargerStrategies() {
  const container = document.getElementById('listeStrategies');
  container.innerHTML = strategies.map((s, i) => 
    <div style="background:#e8f5e9;padding:15px;margin:10px 0;border-radius:6px;">
      <strong>${s.nom}</strong> - ${s.date}<br>
      ${s.desc}
      <button onclick="supprimerStrategie(${i})" style="float:right;">Supprimer</button>
    </div>
  ).join('');
}
function supprimerStrategie(i) {
  strategies.splice(i, 1);
  localStorage.setItem('strategies', JSON.stringify(strategies));
  chargerStrategies();
}

// Marketing
function ajouterIdeeMarketing() {
  const idee = prompt("Nouvelle idée marketing (ex: Reel TikTok lapins nains) ?");
  if (!idee) return;
  marketing.push({idee, date: new Date().toLocaleDateString()});
  localStorage.setItem('marketing', JSON.stringify(marketing));
  chargerMarketing();
}

function chargerMarketing() {
  const container = document.getElementById('listeMarketing');
  container.innerHTML = marketing.map((m, i) => 
    <div style="background:#fff3e0;padding:15px;margin:10px 0;border-radius:6px;">
      \( {m.idee} <small>( \){m.date})</small>
      <button onclick="supprimerMarketing(${i})" style="float:right;">×</button>
    </div>
  ).join('');
}

function supprimerMarketing(i) {
  marketing.splice(i, 1);
  localStorage.setItem('marketing', JSON.stringify(marketing));
  chargerMarketing();
}

// Ventes
function chargerOptionsProduits() {
  const select = document.getElementById('venteProduit');
  select.innerHTML = '<option value="">Sélectionner...</option>';
  produits.forEach((p, i) => {
    select.innerHTML += <option value="\( {i}"> \){p.race} - ${p.nom}</option>;
  });
}

function enregistrerVente(e) {
  e.preventDefault();
  
  const indexProduit = parseInt(document.getElementById('venteProduit').value);
  if (isNaN(indexProduit)) return alert("Sélectionne un produit");
  
  const quantite = parseInt(document.getElementById('venteQuantite').value);
  const prixUnitaire = parseFloat(document.getElementById('ventePrix').value);
  
  const produit = produits[indexProduit];
  
  if (quantite > produit.stock) {
    return alert("Stock insuffisant !");
  }
  
  produit.stock -= quantite;
  
  const vente = {
    date: document.getElementById('venteDate').value,
    produit: ${produit.race} - ${produit.nom},
    quantite,
    prixTotal: (quantite * prixUnitaire).toFixed(2)
  };
  
  ventes.unshift(vente);
  localStorage.setItem('produits', JSON.stringify(produits));
  localStorage.setItem('ventes', JSON.stringify(ventes));
  
  alert("Vente enregistrée !");
  e.target.reset();
  chargerVentes();
  chargerProduits();
  updateDashboard();
}

function chargerVentes() {
  const tbody = document.querySelector('#tableVentes tbody');
  tbody.innerHTML = ventes.map(v => 
    <tr>
      <td>${v.date}</td>
      <td>${v.produit}</td>
      <td>${v.quantite}</td>
      <td>${v.prixTotal} €</td>
    </tr>
  ).join('');
}

// Dashboard
function updateDashboard() {
  let totalStock = 0;
  let valeurStock = 0;
  let ca = 0;
  
  produits.forEach(p => {
    totalStock += p.stock;
    valeurStock += p.stock * p.prixVente;
  });
  
  ventes.forEach(v => ca += parseFloat(v.prixTotal));
  
  document.getElementById('stats').innerHTML = 
    <div class="stat-card">
      <h3>Reproducteurs en stock</h3>
      <p style="font-size:2em">${totalStock}</p>
    </div>
    <div class="stat-card">
      <h3>Valeur du stock</h3>
      <p style="font-size:2em">${valeurStock.toFixed(0)} €</p>
    </div>
    <div class="stat-card">
      <h3>Chiffre d'affaires</h3>
      <p style="font-size:2em">${ca.toFixed(0)} €</p>
    </div>
    <div class="stat-card">
      <h3>Nombre de stratégies</h3>
      <p style="font-size:2em">${strategies.length}</p>
    </div>
  ;
}

// Initialisation
showSection('dashboard');
updateDashboard();
