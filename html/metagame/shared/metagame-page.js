async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
  return response.json();
}

function renderPokemonHeader({ selectable = false } = {}) {
  const checkboxColumn = selectable ? '<div class="picker-column">Pick</div>' : '';
  return `<div class="pokemon-header${selectable ? ' pokemon-selectable' : ''}">${checkboxColumn}<div>Pokémon</div><div>Types</div><div>Abilities</div><div>Stats</div><div>Observations</div></div>`;
}

function renderPage(config, pokemonTables, bannedItems) {
  const root = document.getElementById('metagame-page');
  document.title = config.title;
  root.innerHTML = `
    <nav class="top-nav"><ul class="nav-list"><li><a href="../../../index.html">Shiny Calculator</a></li><li class="dropdown"><a href="#">Metagames</a><ul class="dropdown-content"><li><a href="../hellfire-1/index.html"${config.title === 'Hellfire Memorial I' ? ' class="active"' : ''}>Hellfire Memorial I</a></li><li><a href="../hellfire-2/index.html"${config.title === 'Hellfire Celebrational I' ? ' class="active"' : ''}>Hellfire Celebrational I</a></li></ul></li></ul></nav>
    <div class="page-container"><div class="content-wrap"><div class="wide-container">
      <div class="intro-card"><h1>${config.title}</h1><p>${config.description || ''}</p>${config.highlights && config.highlights.length ? `<ul>${config.highlights.map((highlight) => `<li>${highlight}</li>`).join('')}</ul>` : ''}${config.overview ? `<h2>Overview</h2><div class="overview-body">${config.overview}</div>` : ''}</div>
      ${config.clauses && config.clauses.length ? `<h2>Battle Clauses</h2>${config.clauses.map((clause) => `<div class="battle-clause-card"><div class="clause-title">${clause.title}</div><div class="clause-body">${clause.body}</div></div>`).join('')}` : ''}
      ${bannedItems.length ? `<div class="banned-items-section"><h2>Banned Held Items</h2><div class="banned-items-header"><div>Item</div><div>Observations</div></div><div class="banned-items-list">${renderBannedItemsTable(bannedItems)}</div></div>` : ''}
      ${pokemonTables.map((table) => `<div class="pokemon-table-section"><h2>${table.title}</h2>${renderPokemonHeader({ selectable: table.selectable })}<div class="pokemon-list">${renderPokemonTable(table.pokemon, { selectable: table.selectable })}</div></div>`).join('')}
    </div></div></div>`;

  bindPokemonSelection();
}

function bindPokemonSelection() {
  document.querySelectorAll('.pokemon-check input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const entry = checkbox.closest('.pokemon-entry');
      if (entry) {
        entry.classList.toggle('is-unavailable', checkbox.checked);
      }
    });
  });
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
    const allPokemon = await fetchJson(config.pokemonDataFile || '../../../data/all-pokemon.json');
    const pokemonByName = new Map(allPokemon.map((pokemon) => [pokemon.name, pokemon]));
    const mergePokemon = (formatPokemon) => formatPokemon.map((formatEntry) => {
      const sharedPokemon = pokemonByName.get(formatEntry.name);
      if (!sharedPokemon) throw new Error(`No shared data exists for ${formatEntry.name}.`);
      return { ...sharedPokemon, observations: formatEntry.observations || '' };
    });

    let tableConfigs = [];
    if (Array.isArray(config.pokemonTables) && config.pokemonTables.length) {
      tableConfigs = config.pokemonTables.map((table) => ({
        title: table.title,
        file: table.file,
        selectable: !!table.selectable
      }));
    } else {
      if (config.mandatoryPokemonFile) {
        tableConfigs.push({ title: 'Required Pokémon (Choose at Least 1)', file: config.mandatoryPokemonFile, selectable: false });
      }
      if (config.pokemonFormatFile) {
        tableConfigs.push({ title: 'Allowed Pokémon', file: config.pokemonFormatFile, selectable: false });
      }
    }

    const formatPokemonFiles = await Promise.all(tableConfigs.map((table) => fetchJson(table.file)));
    const pokemonTables = tableConfigs.map((table, index) => ({
      ...table,
      pokemon: mergePokemon(formatPokemonFiles[index])
    }));

    let bannedItems = [];
    if (config.bannedItemsFile) {
      const allHeldItems = await fetchJson(config.heldItemsDataFile || '../../../data/held-items.json');
      const formatHeldItems = await fetchJson(config.bannedItemsFile);
      const heldItemsByName = new Map(allHeldItems.map((item) => [item.name, item]));
      bannedItems = formatHeldItems.map((formatItem) => {
        const sharedItem = heldItemsByName.get(formatItem.name);
        if (!sharedItem) throw new Error(`No shared data exists for ${formatItem.name}.`);
        return { ...sharedItem, observations: formatItem.observations || '' };
      });
    }

    renderPage(config, pokemonTables, bannedItems);
  } catch (error) {
    console.error('Error loading metagame:', error);
    document.getElementById('metagame-page').textContent = 'Unable to load this metagame.';
  }
}

document.addEventListener('DOMContentLoaded', loadMetagame);
