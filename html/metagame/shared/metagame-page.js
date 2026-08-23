async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
  return response.json();
}

function renderPokemonHeader() {
  return '<div class="pokemon-header"><div>Pokémon</div><div>Types</div><div>Abilities</div><div>Stats</div><div>Observations</div></div>';
}

function renderPage(config, pokemon, bannedItems, mandatoryPokemon) {
  const root = document.getElementById('metagame-page');
  document.title = config.title;
  root.innerHTML = `
    <nav class="top-nav"><ul class="nav-list"><li><a href="../../../index.html">Shiny Calculator</a></li><li class="dropdown"><a href="#">Metagames</a><ul class="dropdown-content"><li><a href="../hellfire-1/index.html"${config.title === 'Hellfire Memorial I' ? ' class="active"' : ''}>Hellfire Memorial I</a></li><li><a href="../hellfire-2/index.html"${config.title === 'Hellfire Celebrational I' ? ' class="active"' : ''}>Hellfire Celebrational I</a></li></ul></li></ul></nav>
    <div class="page-container"><div class="content-wrap"><div class="wide-container">
      <div class="intro-card"><h1>${config.title}</h1><p>${config.description || ''}</p>${config.highlights.length ? `<ul>${config.highlights.map((highlight) => `<li>${highlight}</li>`).join('')}</ul>` : ''}${config.overview ? `<h2>Overview</h2><p>${config.overview}</p>` : ''}</div>
      ${config.clauses.length ? `<h2>Battle Clauses</h2>${config.clauses.map((clause) => `<div class="battle-clause-card"><div class="clause-title">${clause.title}</div><div class="clause-body">${clause.body}</div></div>`).join('')}` : ''}
      <div class="banned-items-section"><h2>Banned Held Items</h2><div class="banned-items-header"><div>Item</div><div>Observations</div></div><div class="banned-items-list">${renderBannedItemsTable(bannedItems)}</div></div>
      ${config.mandatoryPokemonFile ? `<h2>Required Pokémon (Choose at Least 1)</h2>${renderPokemonHeader()}<div class="pokemon-list">${renderPokemonTable(mandatoryPokemon)}</div>` : ''}
      <h2>Allowed Pokémon</h2>${renderPokemonHeader()}<div class="pokemon-list">${renderPokemonTable(pokemon)}</div>
    </div></div></div>`;
}

async function loadMetagame() {
  if (window.location.protocol === 'file:') {
    document.getElementById('metagame-page').innerHTML = `
      <div class="page-container"><div class="content-wrap"><div class="wide-container">
        <div class="intro-card">
          <h1>Local server required</h1>
          <p>Metagame data is loaded from JSON files, which browsers cannot read when this page is opened directly from your computer.</p>
          <p>Open this project through a local web server instead—for example, use VS Code's <strong>Live Server</strong> extension and open the address it provides (such as <code>http://localhost:5500</code>).</p>
        </div>
      </div></div></div>`;
    return;
  }

  try {
    const configPath = document.body.dataset.metagameConfig || 'metagame.json';
    const config = await fetchJson(configPath);
    const [allPokemon, formatPokemon, allHeldItems, formatHeldItems, formatMandatoryPokemon] = await Promise.all([
      fetchJson(config.pokemonDataFile),
      fetchJson(config.pokemonFormatFile),
      fetchJson(config.heldItemsDataFile),
      fetchJson(config.bannedItemsFile),
      config.mandatoryPokemonFile ? fetchJson(config.mandatoryPokemonFile) : Promise.resolve([])
    ]);
    const pokemonByName = new Map(allPokemon.map((pokemon) => [pokemon.name, pokemon]));
    const mergePokemon = (formatPokemon) => formatPokemon.map((formatEntry) => {
      const sharedPokemon = pokemonByName.get(formatEntry.name);
      if (!sharedPokemon) throw new Error(`No shared data exists for ${formatEntry.name}.`);
      return { ...sharedPokemon, observations: formatEntry.observations || '' };
    });
    const pokemon = mergePokemon(formatPokemon);
    const mandatoryPokemon = mergePokemon(formatMandatoryPokemon);
    const heldItemsByName = new Map(allHeldItems.map((item) => [item.name, item]));
    const bannedItems = formatHeldItems.map((formatItem) => {
      const sharedItem = heldItemsByName.get(formatItem.name);
      if (!sharedItem) throw new Error(`No shared data exists for ${formatItem.name}.`);
      return { ...sharedItem, observations: formatItem.observations || '' };
    });
    renderPage(config, pokemon, bannedItems, mandatoryPokemon);
  } catch (error) {
    console.error('Error loading metagame:', error);
    document.getElementById('metagame-page').textContent = 'Unable to load this metagame.';
  }
}

document.addEventListener('DOMContentLoaded', loadMetagame);
