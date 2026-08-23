function renderBannedItemsTable(items) {
  return items.map((item) => `
    <div class="banned-item-entry">
      <div class="item-main"><img src="${item.img}" alt="${item.name} icon" class="item-icon"><span class="item-name">${item.name}</span></div>
      <div class="item-observations">${item.observations || ''}</div>
    </div>`).join('');
}
