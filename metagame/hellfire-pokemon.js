async function loadPokemonList() {
  const container = document.getElementById('pokemon-list');

  const response = await fetch('hellfire-pokemon.json');
  const data = await response.json();

  for (const mon of data) {
    const entry = document.createElement('div');
    entry.className = 'pokemon-entry';

    entry.innerHTML = `
      <div class="poke-main">
        <div class="poke-icon">
          <img src="${mon.icon}" alt="${mon.name}">
        </div>
        <div class="poke-name">${mon.name}</div>
      </div>
      <div class="poke-types">
        ${mon.types.map(t => `<span class="type ${t.toLowerCase()}">${t}</span>`).join('')}
      </div>
      <div class="poke-abilities">
        <div class="ability-column regular-abilities">
          ${mon.abilities.regular.map(a => `<div>${a}</div>`).join('')}
        </div>
        <div class="ability-column hidden-ability">
          <div><strong>${mon.abilities.hidden}</strong></div>
        </div>
      </div>
      <div class="poke-stats">
        ${Object.entries(mon.stats).map(([stat, value]) => `
          <div><strong>${stat}</strong>${value}</div>
        `).join('')}
      </div>
      <div class="observations">${(mon.observations || "").trim()}</div>
    `;

    container.appendChild(entry);
  }
}

document.addEventListener('DOMContentLoaded', loadPokemonList);
