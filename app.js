/* =========================================================
   Nos recettes — application (aucune installation requise)
   Données : data/recettes.json, data/planning.json, photos/
   Écriture : API GitHub avec un jeton (mode « gestion »)
   ========================================================= */
'use strict';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const REPAS = ['Midi', 'Soir'];
const CATEGORIES = ['Entrée', 'Plat', 'Dessert', 'Soupe', 'Apéritif', 'Accompagnement', 'Petit-déjeuner', 'Boisson', 'Autre'];
const EMOJI = { 'Entrée': '🥗', 'Plat': '🍲', 'Dessert': '🍰', 'Soupe': '🥣', 'Apéritif': '🧀', 'Accompagnement': '🥔', 'Petit-déjeuner': '🥐', 'Boisson': '🍹', 'Autre': '🍽️' };
const RAYONS = ['Fruits et légumes', 'Boucherie – Poissonnerie', 'Crèmerie – Œufs', 'Épicerie', 'Boulangerie', 'Surgelés', 'Boissons', 'Autre'];
const UNITES = ['', 'g', 'kg', 'ml', 'cl', 'l', 'c. à soupe', 'c. à café', 'pincée', 'sachet', 'boîte', 'pot', 'tranche', 'gousse', 'botte', 'verre'];
const ALIAS_UNITES = {
  'g': 'g', 'gr': 'g', 'gramme': 'g', 'grammes': 'g', 'kg': 'kg', 'kilo': 'kg', 'kilos': 'kg',
  'ml': 'ml', 'cl': 'cl', 'dl': 'dl', 'l': 'l', 'litre': 'l', 'litres': 'l',
  'c. à soupe': 'c. à soupe', 'c.à.s': 'c. à soupe', 'càs': 'c. à soupe', 'cs': 'c. à soupe', 'cuillère à soupe': 'c. à soupe', 'cuillères à soupe': 'c. à soupe', 'cuil. à soupe': 'c. à soupe',
  'c. à café': 'c. à café', 'c.à.c': 'c. à café', 'càc': 'c. à café', 'cc': 'c. à café', 'cuillère à café': 'c. à café', 'cuillères à café': 'c. à café', 'cuil. à café': 'c. à café',
  'pincée': 'pincée', 'pincées': 'pincée', 'sachet': 'sachet', 'sachets': 'sachet', 'boîte': 'boîte', 'boîtes': 'boîte',
  'pot': 'pot', 'pots': 'pot', 'tranche': 'tranche', 'tranches': 'tranche', 'gousse': 'gousse', 'gousses': 'gousse',
  'botte': 'botte', 'bottes': 'botte', 'verre': 'verre', 'verres': 'verre'
};
const MOTS_RAYONS = {
  'Fruits et légumes': ['pomme', 'poire', 'citron', 'orange', 'banane', 'fraise', 'tomate', 'carotte', 'oignon', 'échalote', 'ail', 'poireau', 'courgette', 'aubergine', 'poivron', 'salade', 'laitue', 'épinard', 'champignon', 'potiron', 'courge', 'butternut', 'pomme de terre', 'patate', 'chou', 'brocoli', 'concombre', 'radis', 'navet', 'céleri', 'persil', 'ciboulette', 'basilic', 'coriandre', 'menthe', 'thym', 'laurier', 'avocat', 'haricot vert', 'petits pois', 'fruits rouges', 'framboise', 'myrtille', 'abricot', 'pêche', 'raisin', 'gingembre', 'endive', 'fenouil', 'betterave'],
  'Boucherie – Poissonnerie': ['poulet', 'boeuf', 'bœuf', 'veau', 'porc', 'agneau', 'dinde', 'canard', 'lardon', 'jambon', 'saucisse', 'steak', 'viande', 'haché', 'rôti', 'escalope', 'filet', 'poisson', 'saumon', 'cabillaud', 'thon frais', 'crevette', 'moule', 'lard', 'chorizo', 'merguez', 'bacon'],
  'Crèmerie – Œufs': ['oeuf', 'œuf', 'lait', 'beurre', 'crème', 'yaourt', 'yogourt', 'fromage', 'gruyère', 'emmental', 'comté', 'parmesan', 'mozzarella', 'chèvre', 'feta', 'mascarpone', 'ricotta', 'fromage blanc', 'camembert', 'reblochon', 'raclette', 'pâte feuilletée', 'pâte brisée', 'pâte sablée', 'pâte à pizza'],
  'Boulangerie': ['pain', 'baguette', 'brioche', 'pain de mie', 'chapelure'],
  'Surgelés': ['surgelé', 'glace', 'sorbet'],
  'Boissons': ['vin', 'bière', 'cidre', 'jus', 'eau gazeuse', 'sirop', 'rhum', 'calvados'],
  'Épicerie': ['farine', 'sucre', 'sel', 'poivre', 'huile', 'vinaigre', 'riz', 'pâtes', 'semoule', 'lentille', 'pois chiche', 'levure', 'chocolat', 'cacao', 'miel', 'confiture', 'moutarde', 'ketchup', 'mayonnaise', 'bouillon', 'cube', 'épice', 'curry', 'paprika', 'cumin', 'muscade', 'cannelle', 'vanille', 'conserve', 'concentré', 'coulis', 'sauce', 'noix', 'amande', 'noisette', 'raisins secs', 'café', 'thé', 'maïzena', 'fécule', 'quinoa', 'boulgour', 'olive', 'cornichon', 'câpre']
};

const etat = {
  recettes: [],
  planning: { majLe: 0, repas: {} },   // repas["0-Midi"] = { id, portions }
  coches: {},                           // liste de courses : articles cochés (par appareil)
  ajouts: [],                           // articles ajoutés à la main (par appareil)
  filtre: { texte: '', categorie: '' },
  photosTemp: {},                       // photos fraîchement envoyées (avant mise en ligne)
  brouillon: null                       // recette en cours d'édition
};

/* ---------------- Petits outils ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const echap = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lireLocal = (cle, def) => { try { const v = localStorage.getItem(cle); return v ? JSON.parse(v) : def; } catch { return def; } };
const ecrireLocal = (cle, v) => { try { localStorage.setItem(cle, JSON.stringify(v)); } catch { /* stockage indisponible */ } };
const normaliser = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

function toast(msg, duree = 3000) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('visible');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('visible'), duree);
}
function attente(oui, texte = 'Enregistrement…') { $('#attente-texte').textContent = texte; $('#attente').hidden = !oui; }

function nouvelId(titre) {
  const base = normaliser(titre).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'recette';
  return base + '-' + Math.random().toString(36).slice(2, 6);
}

function lireNombre(s) {
  if (s == null) return null;
  s = String(s).trim().replace('½', '.5').replace('¼', '.25').replace('¾', '.75').replace(',', '.');
  if (!s) return null;
  const m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (m) return Number(m[1]) / Number(m[2]);
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}
function afficherNombre(n) {
  if (n == null) return '';
  let r = n >= 10 ? Math.round(n) : Math.round(n * 10) / 10;
  if (Math.abs(r - Math.round(r * 4) / 4) < 0.05 && r < 10) r = Math.round(r * 4) / 4;
  const ent = Math.floor(r), frac = Math.round((r - ent) * 100) / 100;
  const fr = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[frac];
  if (fr && r < 10) return (ent ? ent : '') + fr;
  return String(Math.round(r * 10) / 10).replace('.', ',');
}
const PLURIEL = { 'pincée': 'pincées', 'sachet': 'sachets', 'boîte': 'boîtes', 'pot': 'pots', 'tranche': 'tranches', 'gousse': 'gousses', 'botte': 'bottes', 'verre': 'verres' };
function qteTexte(q, u) {
  const n = q != null ? afficherNombre(q) : '';
  const unite = q != null && q > 1 && PLURIEL[u] ? PLURIEL[u] : u;
  return [n, unite].filter(Boolean).join(' ');
}
function devinerRayon(nom) {
  const n = normaliser(nom);
  let meilleur = 'Autre', long = 0;
  for (const [rayon, mots] of Object.entries(MOTS_RAYONS)) {
    for (const m of mots) {
      const mm = normaliser(m);
      if (n.includes(mm) && mm.length > long) { meilleur = rayon; long = mm.length; }
    }
  }
  return meilleur;
}
function analyserLigne(ligne) {
  ligne = ligne.replace(/^[-•*]\s*/, '').trim();
  if (!ligne) return null;
  let q = null, reste = ligne;
  const m = ligne.match(/^(\d+(?:[.,]\d+)?(?:\s*\/\s*\d+)?|½|¼|¾)\s*(.*)$/);
  if (m) { q = lireNombre(m[1]); reste = m[2]; }
  let u = '';
  const bas = reste.toLowerCase();
  const alias = Object.keys(ALIAS_UNITES).sort((a, b) => b.length - a.length);
  for (const a of alias) {
    if (bas.startsWith(a) && (bas.length === a.length || /[\s.]/.test(bas[a.length]))) {
      u = ALIAS_UNITES[a]; reste = reste.slice(a.length).replace(/^\.?\s*/, ''); break;
    }
  }
  if (u === 'dl') { u = 'cl'; if (q != null) q *= 10; }
  reste = reste.replace(/^(de |d'|d’|des |du )/i, '').trim();
  if (!reste) return null;
  return { q, u, nom: reste, rayon: devinerRayon(reste) };
}

/* ---------------- Connexion GitHub (mode gestion) ---------------- */
function depotDetecte() {
  const h = location.hostname;
  if (h.endsWith('.github.io')) {
    const proprio = h.split('.')[0];
    const seg = location.pathname.split('/').filter(Boolean)[0];
    return { proprio, depot: seg && !seg.includes('.') ? seg : h };
  }
  return { proprio: '', depot: '' };
}
function config() { return lireLocal('recettes-github', null); }
function estGestion() { const c = config(); return !!(c && c.jeton && c.proprio && c.depot); }

async function gh(chemin, opts = {}) {
  const c = config();
  const url = `https://api.github.com/repos/${c.proprio}/${c.depot}/contents/${chemin}` +
    (opts.methode ? '' : `?ref=${encodeURIComponent(c.branche || 'main')}`);
  const r = await fetch(url, {
    method: opts.methode || 'GET', cache: 'no-store',
    headers: { Authorization: `Bearer ${c.jeton}`, Accept: 'application/vnd.github+json' },
    body: opts.corps ? JSON.stringify(opts.corps) : undefined
  });
  if (r.status === 404 && !opts.methode) return null;
  if (!r.ok) {
    let detail = ''; try { detail = (await r.json()).message; } catch { }
    throw new Error(`GitHub a refusé (${r.status}) ${detail}`);
  }
  return r.json();
}
function versBase64(texte) {
  const octets = new TextEncoder().encode(texte);
  let bin = ''; for (let i = 0; i < octets.length; i += 0x8000) bin += String.fromCharCode.apply(null, octets.subarray(i, i + 0x8000));
  return btoa(bin);
}
function depuisBase64(b64) {
  const bin = atob(b64.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}
async function lireFichierGh(chemin) {
  const f = await gh(chemin);
  if (!f) return { contenu: null, sha: null };
  if (!f.content && f.download_url) { // fichier > 1 Mo
    const r = await fetch(f.download_url, { cache: 'no-store' });
    return { contenu: await r.text(), sha: f.sha };
  }
  return { contenu: depuisBase64(f.content), sha: f.sha };
}
async function ecrireFichierGh(chemin, base64, message) {
  const ex = await gh(chemin);
  const c = config();
  return gh(chemin, { methode: 'PUT', corps: { message, content: base64, sha: ex ? ex.sha : undefined, branch: c.branche || 'main' } });
}
async function supprimerFichierGh(chemin, message) {
  const ex = await gh(chemin); if (!ex) return;
  const c = config();
  return gh(chemin, { methode: 'DELETE', corps: { message, sha: ex.sha, branch: c.branche || 'main' } });
}
/* Modifie data/recettes.json de façon sûre : relit la dernière version, applique, réécrit */
async function modifierRecettesGh(modif, message) {
  const { contenu } = await lireFichierGh('data/recettes.json');
  let liste = contenu ? JSON.parse(contenu) : [];
  liste = modif(liste);
  await ecrireFichierGh('data/recettes.json', versBase64(JSON.stringify(liste, null, 2) + '\n'), message);
  etat.recettes = liste;
}

/* ---------------- Chargement des données ---------------- */
async function chargerPublic(chemin, def) {
  try {
    const r = await fetch(chemin + '?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return def;
    return await r.json();
  } catch { return def; }
}
async function charger() {
  let recettes = null, planning = null;
  if (estGestion()) {
    try {
      const a = await lireFichierGh('data/recettes.json'); recettes = a.contenu ? JSON.parse(a.contenu) : [];
      const b = await lireFichierGh('data/planning.json'); planning = b.contenu ? JSON.parse(b.contenu) : null;
    } catch (e) { console.warn(e); toast('Connexion GitHub impossible : lecture du site publié.'); }
  }
  if (!recettes) recettes = await chargerPublic('data/recettes.json', []);
  if (!planning) planning = await chargerPublic('data/planning.json', null);
  etat.recettes = Array.isArray(recettes) ? recettes : [];
  const local = lireLocal('recettes-planning', null);
  const distant = planning && planning.repas ? planning : { majLe: 0, repas: {} };
  etat.planning = local && local.majLe > (distant.majLe || 0) ? local : distant;
  etat.coches = lireLocal('recettes-coches', {});
  etat.ajouts = lireLocal('recettes-ajouts', []);
}

function recette(id) { return etat.recettes.find(r => r.id === id); }

function urlPhoto(chemin) {
  if (!chemin) return '';
  return etat.photosTemp[chemin] || chemin;
}
/* Si la photo n'est pas encore publiée sur le site, on la prend directement dans le dépôt */
function secoursPhoto(img) {
  if (img.dataset.secours) { img.replaceWith(Object.assign(document.createElement('div'), { className: img.className + ' vignette-vide', textContent: img.dataset.emoji || '🍽️' })); return; }
  img.dataset.secours = '1';
  const c = config() || depotDetecte();
  if (c.proprio && c.depot) img.src = `https://raw.githubusercontent.com/${c.proprio}/${c.depot}/${(config() && config().branche) || 'main'}/${img.dataset.chemin}`;
  else secoursPhoto(img);
}
function imgRecette(r, classe) {
  const emoji = EMOJI[r.categorie] || '🍽️';
  if (!r.photo) return `<div class="${classe} vignette-vide" aria-hidden="true">${emoji}</div>`;
  return `<img class="${classe}" src="${echap(urlPhoto(r.photo))}" data-chemin="${echap(r.photo)}" data-emoji="${emoji}" alt="" loading="lazy" onerror="secoursPhoto(this)">`;
}
function tempsTexte(r) {
  const t = [];
  if (r.tempsPrep) t.push(`⏱️ Préparation ${r.tempsPrep} min`);
  if (r.tempsCuisson) t.push(`🔥 Cuisson ${r.tempsCuisson} min`);
  return t;
}

/* ---------------- Sauvegarde du planning ---------------- */
function sauverPlanning() {
  etat.planning.majLe = Date.now();
  ecrireLocal('recettes-planning', etat.planning);
  if (!estGestion()) return;
  clearTimeout(sauverPlanning._t);
  sauverPlanning._t = setTimeout(async () => {
    try {
      await ecrireFichierGh('data/planning.json', versBase64(JSON.stringify(etat.planning, null, 2) + '\n'), 'Menu de la semaine mis à jour');
    } catch (e) { console.warn(e); toast('Le menu est gardé sur cet ordinateur, mais pas encore envoyé en ligne.'); }
  }, 2000);
}

/* ---------------- Modale ---------------- */
function ouvrirModale(html) {
  const m = $('#modale'); $('.modale-boite', m).innerHTML = `<button class="fermer" data-action="fermer-modale" aria-label="Fermer">✕</button>` + html;
  m.hidden = false; document.body.style.overflow = 'hidden';
  const champ = $('.modale-boite input', m); if (champ && window.innerWidth > 760) champ.focus();
}
function fermerModale() { $('#modale').hidden = true; document.body.style.overflow = ''; }
function confirmer(titre, texte, libelleOui, fn, danger = false) {
  confirmer._fn = fn;
  ouvrirModale(`<h2>${echap(titre)}</h2><p>${texte}</p>
    <div class="rangee-btn"><button class="btn grand ${danger ? 'danger plein' : 'principal'}" data-action="confirmer-oui">${echap(libelleOui)}</button>
    <button class="btn grand discret" data-action="fermer-modale">Annuler</button></div>`);
}

/* =========================================================
   VUES
   ========================================================= */
function vueRecettes(seulementResultats = false) {
  const f = etat.filtre;
  const cats = CATEGORIES.filter(c => etat.recettes.some(r => r.categorie === c));
  const liste = etat.recettes
    .filter(r => !f.categorie || r.categorie === f.categorie)
    .filter(r => !f.texte || normaliser(r.titre + ' ' + (r.ingredients || []).map(i => i.nom).join(' ')).includes(normaliser(f.texte)))
    .sort((a, b) => a.titre.localeCompare(b.titre, 'fr'));

  const cartes = liste.map(r => `
    <a class="carte" href="#/recette/${encodeURIComponent(r.id)}">
      ${imgRecette(r, 'carte-photo')}
      <div class="carte-corps">
        <p class="carte-titre">${echap(r.titre)}</p>
        <div class="carte-info">${echap(r.categorie || '')}${r.tempsPrep || r.tempsCuisson ? ' · ' + ((+r.tempsPrep || 0) + (+r.tempsCuisson || 0)) + ' min' : ''}</div>
      </div>
    </a>`).join('');
  const resultats = liste.length ? `<div class="grille">${cartes}</div>` : `
      <div class="vide"><div class="gros">🍽️</div>
      <p>${etat.recettes.length ? 'Aucune recette ne correspond à cette recherche.' : 'Aucune recette pour le moment.'}</p>
      ${etat.recettes.length ? `<button class="btn" data-action="effacer-recherche">Voir toutes les recettes</button>` : ''}</div>`;
  if (seulementResultats) return resultats;

  return `
    <div class="barre-titre">
      <h1>Mes recettes</h1>
      ${estGestion() ? `<a class="btn principal grand" href="#/ajouter">➕ Ajouter une recette</a>` : ''}
    </div>
    <input type="search" class="recherche" id="recherche" placeholder="Chercher une recette ou un ingrédient…" value="${echap(f.texte)}" aria-label="Chercher une recette">
    ${cats.length > 1 ? `<div class="puces">
      <button class="puce ${!f.categorie ? 'actif' : ''}" data-action="filtre-cat" data-cat="">Toutes</button>
      ${cats.map(c => `<button class="puce ${f.categorie === c ? 'actif' : ''}" data-action="filtre-cat" data-cat="${echap(c)}">${EMOJI[c]} ${echap(c)}</button>`).join('')}
    </div>` : ''}
    <div id="resultats">${resultats}</div>`;
}

function vueRecette(id) {
  const r = recette(id);
  if (!r) return `<a class="btn retour" href="#/recettes">← Retour aux recettes</a><div class="vide"><p>Cette recette n'existe plus.</p></div>`;
  const pour = etat.portionsVues?.[id] || r.portions || 4;
  const ratio = r.portions ? pour / r.portions : 1;
  const ingr = (r.ingredients || []).map(i => {
    return `<li><span class="qte">${echap(qteTexte(i.q != null ? i.q * ratio : null, i.u))}</span> ${echap(i.nom)}</li>`;
  }).join('');
  const etapes = (r.etapes || []).map(e => `<li>${echap(e)}</li>`).join('');
  return `
    <a class="btn retour discret" href="#/recettes">← Retour aux recettes</a>
    <div class="fiche-tete">
      ${imgRecette(r, 'fiche-photo')}
      <div>
        ${r.categorie ? `<span class="categorie">${EMOJI[r.categorie] || ''} ${echap(r.categorie)}</span>` : ''}
        <h1>${echap(r.titre)}</h1>
        <div class="temps">${tempsTexte(r).map(t => `<span>${t}</span>`).join('')}</div>
        <div class="portions" aria-label="Nombre de personnes">
          <button data-action="portions" data-id="${echap(id)}" data-delta="-1" aria-label="Une personne de moins">−</button>
          <span class="pour-imp">Pour</span><span class="nb">${pour}</span>
          <button data-action="portions" data-id="${echap(id)}" data-delta="1" aria-label="Une personne de plus">+</button>
          <span class="lib">personne${pour > 1 ? 's' : ''}</span>
        </div>
        <div class="rangee-btn">
          <button class="btn principal grand" data-action="imprimer">🖨️ Imprimer</button>
          <button class="btn grand" data-action="ajouter-semaine" data-id="${echap(id)}">📅 Mettre au menu</button>
        </div>
        ${estGestion() ? `<div class="rangee-btn">
          <a class="btn discret" href="#/modifier/${encodeURIComponent(id)}">✏️ Modifier</a>
          <button class="btn danger" data-action="supprimer-recette" data-id="${echap(id)}">🗑️ Supprimer</button>
        </div>` : ''}
      </div>
    </div>
    <div class="fiche-corps">
      <section class="bloc"><h2>Ingrédients</h2><ul class="ingredients">${ingr || '<li>—</li>'}</ul></section>
      <section class="bloc"><h2>Préparation</h2><ol class="etapes">${etapes || '<li>—</li>'}</ol>
        ${r.notes ? `<div class="notes"><strong>💡 Astuce :</strong> ${echap(r.notes)}</div>` : ''}
      </section>
    </div>`;
}

function vueSemaine() {
  const nb = Object.keys(etat.planning.repas).length;
  let grille = `<div></div><div class="entete-col">☀️ Midi</div><div class="entete-col">🌙 Soir</div>`;
  JOURS.forEach((j, ij) => {
    grille += `<div class="jour">${j}</div>`;
    REPAS.forEach(rp => {
      const cle = `${ij}-${rp}`, p = etat.planning.repas[cle], r = p && recette(p.id);
      grille += `<div><div class="semaine-mobile-repas">${rp === 'Midi' ? '☀️ Midi' : '🌙 Soir'}</div>` + (r
        ? `<button class="case pleine" data-action="case" data-cle="${cle}">${r.photo ? imgRecette(r, '') : `<div class="mini-vide">${EMOJI[r.categorie] || '🍽️'}</div>`}
            <span><span class="case-titre">${echap(r.titre)}</span><span class="case-pour">pour ${p.portions} personne${p.portions > 1 ? 's' : ''}</span></span></button>`
        : `<button class="case vide-case" data-action="case" data-cle="${cle}"><span>＋ Choisir un plat</span></button>`) + `</div>`;
    });
  });
  return `
    <h1>Menu de la semaine</h1>
    <p class="no-print aide">Touchez une case pour choisir un plat. La liste de courses se fait toute seule.</p>
    <div class="semaine">${grille}</div>
    <div class="rangee-btn">
      <a class="btn principal grand" href="#/courses">🛒 Voir la liste de courses</a>
      <button class="btn grand" data-action="imprimer">🖨️ Imprimer le menu</button>
      ${nb ? `<button class="btn grand danger" data-action="vider-semaine">Effacer le menu</button>` : ''}
    </div>`;
}

/* Calcule la liste de courses à partir du menu */
function calculerCourses() {
  const articles = {};
  for (const p of Object.values(etat.planning.repas)) {
    const r = recette(p.id); if (!r) continue;
    const ratio = r.portions ? p.portions / r.portions : 1;
    for (const i of r.ingredients || []) {
      let q = i.q != null ? i.q * ratio : null, u = i.u || '';
      if (u === 'kg') { q = q != null ? q * 1000 : q; u = 'g'; }
      if (u === 'l') { q = q != null ? q * 1000 : q; u = 'ml'; }
      if (u === 'cl') { q = q != null ? q * 10 : q; u = 'ml'; }
      const cle = normaliser(i.nom) + '|' + u;
      if (!articles[cle]) articles[cle] = { cle, nom: i.nom, u, q: null, rayon: i.rayon || devinerRayon(i.nom), sources: new Set() };
      if (q != null) articles[cle].q = (articles[cle].q || 0) + q;
      articles[cle].sources.add(r.titre);
    }
  }
  return Object.values(articles).map(a => {
    let q = a.q, u = a.u;
    // Arrondi « magasin » : on arrondit toujours au-dessus
    if (q != null) {
      if (u === 'g' || u === 'ml') q = q > 100 ? Math.ceil(q / 10 - 1e-9) * 10 : Math.ceil(q - 1e-9);
      else if (u === 'c. à soupe' || u === 'c. à café') q = Math.ceil(q * 2 - 1e-9) / 2;
      else q = Math.ceil(q - 0.05);
    }
    if (u === 'g' && q >= 1000) { q /= 1000; u = 'kg'; }
    else if (u === 'ml' && q >= 1000) { q /= 1000; u = 'l'; }
    else if (u === 'ml' && q != null && q >= 50 && Math.abs(q / 10 - Math.round(q / 10)) < .01) { q /= 10; u = 'cl'; }
    return { ...a, texteQ: qteTexte(q, u), sources: [...a.sources] };
  });
}

function vueCourses() {
  const articles = calculerCourses();
  const nbRepas = Object.keys(etat.planning.repas).length;
  const parRayon = {};
  for (const a of articles) (parRayon[a.rayon] = parRayon[a.rayon] || []).push(a);
  const ligne = (a, perso) => {
    const c = !!etat.coches[a.cle];
    return `<label class="article ${c ? 'coche' : ''}">
      <input type="checkbox" data-action="cocher" data-cle="${echap(a.cle)}" ${c ? 'checked' : ''}>
      <span class="art-texte"><span class="art-nom">${a.texteQ ? `<strong>${echap(a.texteQ)}</strong> ` : ''}${echap(a.nom)}</span>
      ${a.sources ? `<span class="art-src">pour : ${echap(a.sources.join(', '))}</span>` : ''}</span>
      ${perso ? `<button class="suppr" data-action="suppr-ajout" data-cle="${echap(a.cle)}" aria-label="Retirer">✕</button>` : ''}
    </label>`;
  };
  let html = RAYONS.filter(r => parRayon[r]).map(r => `
    <div class="rayon"><h3>${echap(r)}</h3>
      ${parRayon[r].sort((a, b) => a.nom.localeCompare(b.nom, 'fr')).map(a => ligne(a)).join('')}
    </div>`).join('');
  if (etat.ajouts.length) html += `<div class="rayon"><h3>Ajouté à la main</h3>${etat.ajouts.map(a => ligne({ cle: a.cle, nom: a.nom }, true)).join('')}</div>`;

  return `
    <h1>Liste de courses</h1>
    <p class="aide">${nbRepas ? `Pour ${nbRepas > 1 ? 'les ' + nbRepas + ' repas' : 'le repas'} du menu de la semaine. Cochez au fur et à mesure dans le magasin.` : ''}</p>
    ${!nbRepas && !etat.ajouts.length ? `<div class="vide"><div class="gros">🛒</div><p>La liste est vide : choisissez d'abord des plats dans le menu de la semaine.</p>
      <a class="btn principal grand" href="#/semaine">📅 Aller au menu de la semaine</a></div>` : `<div class="bloc liste-courses">${html}</div>`}
    <form class="ajout-article no-print" data-action="ajout-article">
      <input type="text" id="nouvel-article" placeholder="Ajouter autre chose (ex. : papier toilette)" aria-label="Ajouter un article">
      <button class="btn principal" type="submit">Ajouter</button>
    </form>
    <div class="rangee-btn">
      <button class="btn principal grand" data-action="imprimer">🖨️ Imprimer la liste</button>
      <button class="btn grand" data-action="partager-courses">📤 Envoyer sur un téléphone</button>
      ${Object.keys(etat.coches).length ? `<button class="btn grand discret" data-action="decocher">Tout décocher</button>` : ''}
    </div>`;
}

/* ----- Formulaire d'ajout / modification ----- */
function vueEdition(id) {
  if (!estGestion()) return `<div class="vide"><p>L'ajout de recettes se fait depuis l'ordinateur où les réglages ont été faits.</p><a class="btn" href="#/reglages">⚙ Réglages</a></div>`;
  if (!etat.brouillon || etat.brouillon._pour !== (id || 'nouvelle')) {
    const r = id ? recette(id) : null;
    if (id && !r) return `<div class="vide"><p>Recette introuvable.</p></div>`;
    etat.brouillon = r ? JSON.parse(JSON.stringify(r)) : { id: '', titre: '', categorie: 'Plat', portions: 4, tempsPrep: '', tempsCuisson: '', photo: '', ingredients: [{ q: null, u: '', nom: '', rayon: 'Autre' }], etapes: [], notes: '' };
    etat.brouillon._pour = id || 'nouvelle';
    etat.brouillon._photoNouvelle = null;
  }
  const b = etat.brouillon;
  const apercu = b._photoNouvelle
    ? `<img src="${b._photoNouvelle}" alt="Aperçu">`
    : (b.photo ? imgRecette(b, '') : `<div class="vignette-vide">📷</div>`);
  return `
    <a class="btn retour discret" href="${id ? '#/recette/' + encodeURIComponent(id) : '#/recettes'}">← Annuler</a>
    <h1>${id ? 'Modifier la recette' : 'Nouvelle recette'}</h1>
    <form class="formulaire" id="form-recette" data-action="enregistrer" autocomplete="off">
      <div class="champ"><label for="f-titre">Nom de la recette</label>
        <input type="text" id="f-titre" required value="${echap(b.titre)}" placeholder="ex. : Quiche lorraine"></div>
      <div class="ligne-3">
        <div class="champ"><label for="f-cat">Catégorie</label>
          <select id="f-cat">${CATEGORIES.map(c => `<option ${b.categorie === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
        <div class="champ"><label for="f-port">Pour combien de personnes</label>
          <input type="number" id="f-port" min="1" max="50" value="${echap(b.portions || 4)}"></div>
        <div class="champ"><label>Temps (minutes)</label>
          <div style="display:flex;gap:.5rem"><input type="number" id="f-prep" min="0" placeholder="Prépa" value="${echap(b.tempsPrep)}" aria-label="Préparation en minutes">
          <input type="number" id="f-cuis" min="0" placeholder="Cuisson" value="${echap(b.tempsCuisson)}" aria-label="Cuisson en minutes"></div></div>
      </div>

      <div class="champ"><span class="etiquette">Photo</span>
        <div class="zone-photo">${apercu}
          <div><label class="btn" for="f-photo">📷 ${b.photo || b._photoNouvelle ? 'Changer la photo' : 'Choisir une photo'}</label>
          <input type="file" id="f-photo" accept="image/*" hidden>
          ${b.photo || b._photoNouvelle ? `<button type="button" class="btn discret" data-action="retirer-photo">Retirer</button>` : ''}
          <p class="aide">La photo est réduite automatiquement avant l'envoi.</p></div>
        </div></div>

      <div class="champ"><span class="etiquette">Ingrédients</span>
        <p class="aide">Pour aller vite : <button type="button" class="btn discret" style="min-height:40px;padding:.2rem .8rem" data-action="coller-ingr">📋 Coller une liste d'ingrédients</button></p>
        <div class="entete-ingr"><span>Quantité</span><span>Unité</span><span>Ingrédient</span><span>Rayon (courses)</span><span></span></div>
        <div id="lignes-ingr">${b.ingredients.map((i, n) => ligneIngredient(i, n)).join('')}</div>
        <button type="button" class="btn discret" data-action="ajout-ingr">＋ Ajouter un ingrédient</button>
      </div>

      <div class="champ"><label for="f-etapes">Préparation</label>
        <p class="aide">Une étape par ligne.</p>
        <textarea id="f-etapes" rows="8" placeholder="Préchauffer le four à 180 °C.&#10;Mélanger la farine et le sucre.&#10;…">${echap((b.etapes || []).join('\n'))}</textarea></div>

      <div class="champ"><label for="f-notes">Astuce (facultatif)</label>
        <textarea id="f-notes" rows="3" style="min-height:4rem">${echap(b.notes || '')}</textarea></div>

      <div class="rangee-btn">
        <button type="submit" class="btn principal grand">💾 Enregistrer la recette</button>
        <a class="btn grand discret" href="${id ? '#/recette/' + encodeURIComponent(id) : '#/recettes'}">Annuler</a>
      </div>
    </form>`;
}
function ligneIngredient(i, n) {
  return `<div class="ligne-ingr" data-n="${n}">
    <input type="text" inputmode="decimal" class="q-ingr" value="${i.q != null ? echap(String(i.q).replace('.', ',')) : ''}" placeholder="Qté" aria-label="Quantité">
    <input type="text" class="u-ingr" list="liste-unites" value="${echap(i.u || '')}" placeholder="unité" aria-label="Unité">
    <input type="text" class="nom-ingr" value="${echap(i.nom)}" placeholder="ex. : farine" aria-label="Ingrédient">
    <select class="rayon-ingr" aria-label="Rayon">${RAYONS.map(r => `<option ${i.rayon === r ? 'selected' : ''}>${r}</option>`).join('')}</select>
    <button type="button" data-action="suppr-ingr" data-n="${n}" aria-label="Retirer cet ingrédient">✕</button>
  </div>`;
}
/* Relit le formulaire dans le brouillon (avant de redessiner) */
function lireFormulaire() {
  const b = etat.brouillon; if (!b || !$('#form-recette')) return;
  b.titre = $('#f-titre').value.trim();
  b.categorie = $('#f-cat').value;
  b.portions = Math.max(1, parseInt($('#f-port').value) || 4);
  b.tempsPrep = parseInt($('#f-prep').value) || '';
  b.tempsCuisson = parseInt($('#f-cuis').value) || '';
  b.ingredients = [...document.querySelectorAll('.ligne-ingr')].map(l => ({
    q: lireNombre($('.q-ingr', l).value), u: $('.u-ingr', l).value.trim(),
    nom: $('.nom-ingr', l).value.trim(), rayon: $('.rayon-ingr', l).value
  }));
  b.etapes = $('#f-etapes').value.split('\n').map(s => s.replace(/^\s*\d+[.)-]\s*/, '').trim()).filter(Boolean);
  b.notes = $('#f-notes').value.trim();
}

async function reduirePhoto(fichier) {
  const url = URL.createObjectURL(fichier);
  const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = url; });
  const max = 1200, ech = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas'); c.width = Math.round(img.width * ech); c.height = Math.round(img.height * ech);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  return c.toDataURL('image/jpeg', 0.82);
}

async function enregistrerRecette() {
  lireFormulaire();
  const b = etat.brouillon;
  if (!b.titre) { toast('Il manque le nom de la recette.'); $('#f-titre').focus(); return; }
  b.ingredients = b.ingredients.filter(i => i.nom);
  attente(true, 'Enregistrement de la recette…');
  try {
    const nouvelle = !b.id;
    if (nouvelle) b.id = nouvelId(b.titre);
    const anciennePhoto = recette(b.id)?.photo;
    if (b._photoNouvelle) {
      attente(true, 'Envoi de la photo…');
      const chemin = `photos/${b.id}-${Date.now().toString(36)}.jpg`;
      await ecrireFichierGh(chemin, b._photoNouvelle.split(',')[1], `Photo : ${b.titre}`);
      etat.photosTemp[chemin] = b._photoNouvelle;
      b.photo = chemin;
    }
    const propre = { id: b.id, titre: b.titre, categorie: b.categorie, portions: b.portions, tempsPrep: b.tempsPrep || null, tempsCuisson: b.tempsCuisson || null, photo: b.photo || '', ingredients: b.ingredients, etapes: b.etapes, notes: b.notes };
    attente(true, 'Enregistrement de la recette…');
    await modifierRecettesGh(liste => {
      const i = liste.findIndex(r => r.id === propre.id);
      if (i >= 0) liste[i] = propre; else liste.push(propre);
      return liste;
    }, `${nouvelle ? 'Ajout' : 'Modification'} : ${b.titre}`);
    if (anciennePhoto && anciennePhoto !== propre.photo) supprimerFichierGh(anciennePhoto, `Ancienne photo : ${b.titre}`).catch(() => { });
    etat.brouillon = null;
    attente(false);
    toast('✅ Recette enregistrée. Visible sur les téléphones d\'ici 1 à 2 minutes.', 4500);
    location.hash = '#/recette/' + encodeURIComponent(propre.id);
  } catch (e) {
    attente(false);
    console.error(e);
    ouvrirModale(`<h2>L'enregistrement n'a pas marché</h2><div class="encart alerte">${echap(e.message)}</div>
      <p>Vérifiez la connexion Internet, puis réessayez. Si le problème continue, vérifiez le jeton dans les réglages.</p>
      <div class="rangee-btn"><button class="btn principal grand" data-action="fermer-modale">J'ai compris</button></div>`);
  }
}

/* ----- Réglages ----- */
function vueReglages() {
  const c = config() || {};
  const d = depotDetecte();
  return `
    <a class="btn retour discret" href="#/recettes">← Retour aux recettes</a>
    <h1>Réglages</h1>
    <div class="encart">Ces réglages servent <strong>uniquement sur l'ordinateur où l'on ajoute les recettes</strong>.
    Pour simplement consulter, imprimer et faire les courses, il n'y a rien à régler.</div>
    <form class="formulaire" data-action="sauver-reglages">
      <div class="ligne-3">
        <div class="champ"><label for="r-proprio">Compte GitHub</label><input type="text" id="r-proprio" value="${echap(c.proprio || d.proprio)}"></div>
        <div class="champ"><label for="r-depot">Nom du dépôt</label><input type="text" id="r-depot" value="${echap(c.depot || d.depot)}"></div>
        <div class="champ"><label for="r-branche">Branche</label><input type="text" id="r-branche" value="${echap(c.branche || 'main')}"></div>
      </div>
      <div class="champ"><label for="r-jeton">Jeton d'accès GitHub</label>
        <p class="aide">Un jeton « fine-grained » limité à ce dépôt, avec la permission <em>Contents : Read and write</em>. Il reste sur cet ordinateur.</p>
        <input type="password" id="r-jeton" value="${echap(c.jeton || '')}" placeholder="github_pat_…"></div>
      <div class="rangee-btn">
        <button class="btn principal grand" type="submit">Enregistrer et tester</button>
        ${c.jeton ? `<button class="btn grand danger" type="button" data-action="oublier-jeton">Oublier le jeton</button>` : ''}
      </div>
      <p class="aide">État : ${estGestion() ? '✅ mode gestion actif (ajout et modification possibles)' : 'consultation seule'}</p>
    </form>
    <h2 style="margin-top:2rem">Sauvegarde</h2>
    <div class="rangee-btn"><button class="btn" data-action="exporter">💾 Télécharger une copie de toutes les recettes</button></div>`;
}

/* =========================================================
   ROUTAGE ET AFFICHAGE
   ========================================================= */
function afficher() {
  const [, page, param] = (location.hash || '#/recettes').split('/');
  const id = param ? decodeURIComponent(param) : '';
  const app = $('#app');
  let html, onglet = page;
  switch (page) {
    case 'recette': html = vueRecette(id); onglet = 'recettes'; break;
    case 'semaine': html = vueSemaine(); break;
    case 'courses': html = vueCourses(); break;
    case 'ajouter': html = vueEdition(''); onglet = 'recettes'; break;
    case 'modifier': html = vueEdition(id); onglet = 'recettes'; break;
    case 'reglages': html = vueReglages(); break;
    default: html = vueRecettes(); onglet = 'recettes';
  }
  if (page !== 'ajouter' && page !== 'modifier') etat.brouillon = null;
  app.innerHTML = html;
  document.querySelectorAll('[data-onglet]').forEach(a => a.classList.toggle('actif', a.dataset.onglet === onglet));
  const titres = { recette: recette(id)?.titre, semaine: 'Menu de la semaine', courses: 'Liste de courses', reglages: 'Réglages' };
  document.title = (titres[page] ? titres[page] + ' — ' : '') + 'Nos recettes';
  if (!document.getElementById('liste-unites')) {
    const dl = document.createElement('datalist'); dl.id = 'liste-unites';
    dl.innerHTML = UNITES.filter(Boolean).map(u => `<option value="${u}">`).join('');
    document.body.appendChild(dl);
  }
}
function redessinerEnGardantPosition() { const y = window.scrollY; afficher(); window.scrollTo(0, y); }

window.addEventListener('hashchange', () => { fermerModale(); afficher(); window.scrollTo(0, 0); });

/* ----- Choisir un plat pour une case du menu ----- */
function ouvrirChoixPlat(cle, texte = '') {
  const [ij, rp] = cle.split('-');
  const liste = etat.recettes
    .filter(r => !texte || normaliser(r.titre).includes(normaliser(texte)))
    .sort((a, b) => a.titre.localeCompare(b.titre, 'fr'));
  const grille = liste.map(r => `<button class="choix" data-action="choisir-plat" data-cle="${cle}" data-id="${echap(r.id)}">${imgRecette(r, 'carte-photo')}<span>${echap(r.titre)}</span></button>`).join('');
  if (!$('#modale').hidden && $('#choix-resultats')) { $('#choix-resultats').innerHTML = grille || '<p>Aucune recette trouvée.</p>'; return; }
  ouvrirModale(`<h2>${JOURS[ij]} ${rp.toLowerCase()} : quel plat ?</h2>
    <input type="search" class="recherche" id="choix-recherche" data-cle="${cle}" placeholder="Chercher…" aria-label="Chercher une recette">
    <div class="choix-liste" id="choix-resultats">${grille || '<p>Aucune recette pour le moment.</p>'}</div>`);
}
function ouvrirCase(cle) {
  const p = etat.planning.repas[cle];
  if (!p) return ouvrirChoixPlat(cle);
  const r = recette(p.id); const [ij, rp] = cle.split('-');
  ouvrirModale(`<h2>${JOURS[ij]} ${rp.toLowerCase()}</h2>
    <p style="font-size:1.3rem;font-family:Georgia,serif;font-weight:bold">${echap(r ? r.titre : 'Recette supprimée')}</p>
    <div class="portions" style="margin-bottom:1rem">
      <button data-action="portions-case" data-cle="${cle}" data-delta="-1" aria-label="Une personne de moins">−</button>
      <span class="nb">${p.portions}</span>
      <button data-action="portions-case" data-cle="${cle}" data-delta="1" aria-label="Une personne de plus">+</button>
      <span class="lib">personne${p.portions > 1 ? 's' : ''}</span>
    </div>
    <div class="rangee-btn" style="flex-direction:column">
      ${r ? `<a class="btn principal grand large" href="#/recette/${encodeURIComponent(r.id)}">📖 Voir la recette</a>` : ''}
      <button class="btn grand large" data-action="changer-plat" data-cle="${cle}">🔄 Choisir un autre plat</button>
      <button class="btn grand large danger" data-action="retirer-plat" data-cle="${cle}">Enlever ce plat du menu</button>
    </div>`);
}
function ouvrirChoixCreneau(id) {
  const r = recette(id);
  let g = `<div></div><strong style="text-align:center">☀️ Midi</strong><strong style="text-align:center">🌙 Soir</strong>`;
  JOURS.forEach((j, ij) => {
    g += `<strong>${j}</strong>`;
    REPAS.forEach(rp => {
      const cle = `${ij}-${rp}`, p = etat.planning.repas[cle], o = p && recette(p.id);
      g += `<button class="btn ${o ? 'occupe' : ''}" data-action="mettre-creneau" data-cle="${cle}" data-id="${echap(id)}">${o ? echap(o.titre.slice(0, 18)) : 'Libre'}</button>`;
    });
  });
  ouvrirModale(`<h2>Quand voulez-vous faire « ${echap(r.titre)} » ?</h2><div class="grille-creneaux">${g}</div>`);
}

/* ----- Gestion de tous les clics ----- */
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-action]'); if (!el) return;
  const a = el.dataset.action;
  if (el.tagName === 'FORM' || el.tagName === 'INPUT' && el.type === 'checkbox') return;
  switch (a) {
    case 'fermer-modale': fermerModale(); break;
    case 'confirmer-oui': fermerModale(); confirmer._fn && confirmer._fn(); break;
    case 'imprimer': window.print(); break;
    case 'filtre-cat': etat.filtre.categorie = el.dataset.cat; afficher(); break;
    case 'effacer-recherche': etat.filtre = { texte: '', categorie: '' }; afficher(); break;
    case 'portions': {
      const r = recette(el.dataset.id); etat.portionsVues = etat.portionsVues || {};
      const v = (etat.portionsVues[r.id] || r.portions || 4) + Number(el.dataset.delta);
      etat.portionsVues[r.id] = Math.max(1, Math.min(50, v)); redessinerEnGardantPosition(); break;
    }
    case 'ajouter-semaine': ouvrirChoixCreneau(el.dataset.id); break;
    case 'mettre-creneau': {
      const r = recette(el.dataset.id);
      etat.planning.repas[el.dataset.cle] = { id: r.id, portions: etat.portionsVues?.[r.id] || r.portions || 4 };
      sauverPlanning(); fermerModale();
      const [ij, rp] = el.dataset.cle.split('-');
      toast(`📅 Ajouté au menu : ${JOURS[ij]} ${rp.toLowerCase()}`); break;
    }
    case 'case': ouvrirCase(el.dataset.cle); break;
    case 'changer-plat': fermerModale(); ouvrirChoixPlat(el.dataset.cle); break;
    case 'choisir-plat': {
      const r = recette(el.dataset.id); const ancien = etat.planning.repas[el.dataset.cle];
      etat.planning.repas[el.dataset.cle] = { id: r.id, portions: ancien?.portions || r.portions || 4 };
      sauverPlanning(); fermerModale(); redessinerEnGardantPosition(); break;
    }
    case 'retirer-plat': delete etat.planning.repas[el.dataset.cle]; sauverPlanning(); fermerModale(); redessinerEnGardantPosition(); break;
    case 'portions-case': {
      const p = etat.planning.repas[el.dataset.cle];
      p.portions = Math.max(1, Math.min(50, p.portions + Number(el.dataset.delta)));
      sauverPlanning(); ouvrirCase(el.dataset.cle); redessinerEnGardantPosition(); break;
    }
    case 'vider-semaine':
      confirmer('Effacer le menu ?', 'Tous les plats de la semaine seront enlevés. Les recettes, elles, ne sont pas supprimées.', 'Oui, effacer le menu', () => {
        etat.planning.repas = {}; etat.coches = {}; ecrireLocal('recettes-coches', {}); sauverPlanning(); afficher();
      }, true); break;
    case 'decocher': etat.coches = {}; ecrireLocal('recettes-coches', {}); redessinerEnGardantPosition(); break;
    case 'suppr-ajout': e.preventDefault(); etat.ajouts = etat.ajouts.filter(x => x.cle !== el.dataset.cle); ecrireLocal('recettes-ajouts', etat.ajouts); redessinerEnGardantPosition(); break;
    case 'partager-courses': partagerCourses(); break;
    case 'supprimer-recette': {
      const r = recette(el.dataset.id);
      confirmer('Supprimer cette recette ?', `« ${echap(r.titre)} » sera définitivement supprimée.`, 'Oui, supprimer', async () => {
        attente(true, 'Suppression…');
        try {
          await modifierRecettesGh(l => l.filter(x => x.id !== r.id), `Suppression : ${r.titre}`);
          if (r.photo) supprimerFichierGh(r.photo, `Photo supprimée : ${r.titre}`).catch(() => { });
          for (const [k, p] of Object.entries(etat.planning.repas)) if (p.id === r.id) delete etat.planning.repas[k];
          sauverPlanning(); attente(false); toast('Recette supprimée.'); location.hash = '#/recettes';
        } catch (err) { attente(false); toast('La suppression a échoué : ' + err.message, 6000); }
      }, true); break;
    }
    case 'ajout-ingr': lireFormulaire(); etat.brouillon.ingredients.push({ q: null, u: '', nom: '', rayon: 'Autre' }); redessinerEnGardantPosition();
      document.querySelectorAll('.q-ingr')[etat.brouillon.ingredients.length - 1]?.focus(); break;
    case 'suppr-ingr': lireFormulaire(); etat.brouillon.ingredients.splice(Number(el.dataset.n), 1); redessinerEnGardantPosition(); break;
    case 'coller-ingr':
      ouvrirModale(`<h2>Coller une liste d'ingrédients</h2>
        <p class="aide">Un ingrédient par ligne, par exemple : <em>200 g de farine</em>, <em>3 œufs</em>, <em>20 cl de crème</em>. Le rayon est deviné automatiquement.</p>
        <textarea id="texte-ingr" rows="10"></textarea>
        <div class="rangee-btn"><button class="btn principal grand" data-action="valider-coller">Ajouter ces ingrédients</button></div>`);
      break;
    case 'valider-coller': {
      lireFormulaire();
      const nouv = $('#texte-ingr').value.split('\n').map(analyserLigne).filter(Boolean);
      etat.brouillon.ingredients = etat.brouillon.ingredients.filter(i => i.nom).concat(nouv);
      fermerModale(); redessinerEnGardantPosition(); toast(`${nouv.length} ingrédient(s) ajouté(s). Vérifiez-les.`); break;
    }
    case 'retirer-photo': lireFormulaire(); etat.brouillon.photo = ''; etat.brouillon._photoNouvelle = null; redessinerEnGardantPosition(); break;
    case 'oublier-jeton': localStorage.removeItem('recettes-github'); toast('Jeton oublié sur cet ordinateur.'); afficher(); break;
    case 'exporter': {
      const blob = new Blob([JSON.stringify(etat.recettes, null, 2)], { type: 'application/json' });
      const lien = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `recettes-${new Date().toISOString().slice(0, 10)}.json` });
      lien.click(); break;
    }
  }
});

document.addEventListener('change', async e => {
  const el = e.target;
  if (el.dataset.action === 'cocher') {
    if (el.checked) etat.coches[el.dataset.cle] = 1; else delete etat.coches[el.dataset.cle];
    ecrireLocal('recettes-coches', etat.coches);
    el.closest('.article').classList.toggle('coche', el.checked);
  }
  if (el.classList.contains('nom-ingr')) { // devine le rayon quand on tape le nom
    const sel = $('.rayon-ingr', el.closest('.ligne-ingr'));
    if (sel.value === 'Autre') sel.value = devinerRayon(el.value);
  }
  if (el.id === 'f-photo' && el.files[0]) {
    lireFormulaire(); attente(true, 'Préparation de la photo…');
    try { etat.brouillon._photoNouvelle = await reduirePhoto(el.files[0]); }
    catch { toast('Cette image n\'a pas pu être lue.'); }
    attente(false); redessinerEnGardantPosition();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'recherche') {
    etat.filtre.texte = e.target.value;
    $('#resultats').innerHTML = vueRecettes(true);
  }
  if (e.target.id === 'choix-recherche') ouvrirChoixPlat(e.target.dataset.cle, e.target.value);
});

document.addEventListener('submit', async e => {
  e.preventDefault();
  const a = e.target.dataset.action;
  if (a === 'enregistrer') enregistrerRecette();
  if (a === 'ajout-article') {
    const v = $('#nouvel-article').value.trim(); if (!v) return;
    etat.ajouts.push({ cle: 'perso-' + Date.now(), nom: v }); ecrireLocal('recettes-ajouts', etat.ajouts);
    redessinerEnGardantPosition(); $('#nouvel-article').focus();
  }
  if (a === 'sauver-reglages') {
    const c = { proprio: $('#r-proprio').value.trim(), depot: $('#r-depot').value.trim(), branche: $('#r-branche').value.trim() || 'main', jeton: $('#r-jeton').value.trim() };
    ecrireLocal('recettes-github', c);
    attente(true, 'Test de la connexion…');
    try {
      await lireFichierGh('data/recettes.json');
      attente(false); toast('✅ Connexion réussie : vous pouvez ajouter des recettes.', 4000);
      await charger(); location.hash = '#/recettes';
    } catch (err) {
      attente(false);
      ouvrirModale(`<h2>La connexion a échoué</h2><div class="encart alerte">${echap(err.message)}</div><p>Vérifiez le nom du compte, du dépôt et le jeton.</p>
        <div class="rangee-btn"><button class="btn principal grand" data-action="fermer-modale">J'ai compris</button></div>`);
    }
  }
});

document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modale').hidden) fermerModale(); });

async function partagerCourses() {
  const articles = calculerCourses();
  const parRayon = {};
  for (const a of articles) if (!etat.coches[a.cle]) (parRayon[a.rayon] = parRayon[a.rayon] || []).push(a);
  let texte = '🛒 Liste de courses\n';
  for (const r of RAYONS) if (parRayon[r]) texte += `\n${r.toUpperCase()}\n` + parRayon[r].map(a => `- ${a.texteQ ? a.texteQ + ' ' : ''}${a.nom}`).join('\n') + '\n';
  const perso = etat.ajouts.filter(a => !etat.coches[a.cle]);
  if (perso.length) texte += '\nAUTRES\n' + perso.map(a => '- ' + a.nom).join('\n') + '\n';
  if (navigator.share) { try { await navigator.share({ title: 'Liste de courses', text: texte }); } catch { } return; }
  try { await navigator.clipboard.writeText(texte); toast('📋 Liste copiée : collez-la dans un SMS ou un e-mail.', 4500); }
  catch { ouvrirModale(`<h2>Liste de courses</h2><textarea rows="15">${echap(texte)}</textarea>`); }
}

/* ---------------- Démarrage ---------------- */
(async function demarrer() {
  await charger();
  afficher();
})();
