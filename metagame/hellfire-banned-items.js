async function loadBannedItems() {
  const container = document.querySelector('.banned-items-list');

  try {
    const response = await fetch('hellfire-banned-items.json');
    const items = await response.json();

    for (const item of items) {
      const entry = document.createElement('div');
      entry.className = 'banned-item-entry';

      entry.innerHTML = `
        <div class="item-main">
          <img src="${item.img}" alt="${item.name} icon" class="item-icon" />
          <span class="item-name">${item.name}</span>
        </div>
        <div class="item-observations">${item.observations}</div>
      `;

      container.appendChild(entry);
    }
  } catch (error) {
    console.error('Error loading banned items:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadBannedItems);
