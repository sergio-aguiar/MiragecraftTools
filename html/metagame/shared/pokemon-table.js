function renderPokemonTable(pokemon) {
  return pokemon.map((mon) => {
    const hiddenAbility = mon.abilities.hidden
      ? `<div><strong>${mon.abilities.hidden}</strong></div>`
      : '';

    return `
      <div class="pokemon-entry">
        <div class="poke-main"><div class="poke-icon"><img src="${mon.icon}" alt="${mon.name}"></div><div class="poke-name">${mon.name}</div></div>
        <div class="poke-types">${mon.types.map((type) => `<span class="type ${type.toLowerCase()}">${type}</span>`).join('')}</div>
        <div class="poke-abilities"><div class="ability-column regular-abilities">${mon.abilities.regular.map((ability) => `<div>${ability}</div>`).join('')}</div><div class="ability-column hidden-ability">${hiddenAbility}</div></div>
        <div class="poke-stats">${Object.entries(mon.stats).map(([stat, value]) => `<div><strong>${stat}</strong>${value}</div>`).join('')}</div>
        <div class="observations">${(mon.observations || '').trim()}</div>
      </div>`;
  }).join('');
}
