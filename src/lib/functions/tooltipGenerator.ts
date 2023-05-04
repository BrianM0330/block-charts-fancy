const getOrCreateTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltipEl.style.borderRadius = '3px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'relative';
    tooltipEl.style.transition = 'all .2s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltipHandler = (context) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const { wasSignificant } = tooltip.dataPoints?.[0].raw ?? false;

  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const tableHead = document.createElement('thead');

    titleLines.forEach((title) => {
      const tr = document.createElement('tr');
      tr.style.borderWidth = 0;

      const th = document.createElement('th');
      th.style.borderWidth = 0;
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '2px';
      span.style.marginRight = '10px';
      span.style.height = '10px';
      span.style.width = '10px';
      span.style.display = 'none';

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = 0;

      const td = document.createElement('td');
      td.style.borderWidth = 0;

      const text = document.createTextNode('$' + body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableFooter = document.createElement('div');
    tableFooter.style.display = 'flex';
    tableFooter.style.flexDirection = 'column';
    tableFooter.style.gap = '8px';
    if (wasSignificant) {
      const alert = document.createElement('div');
      alert.innerHTML = 'THIS ARTICLE WAS A MARKET MOVER';
      alert.style.color = 'red';
      alert.style.fontSize = '16px';
      alert.style.fontWeight = '600';

      const title = document.createElement('div');
      title.innerHTML = 'Bitcoin Transactions reach record high as Inscriptions surge';
      title.style.fontWeight = '700';
      title.style.fontSize = '20px';

      const thumbnail = document.createElement('img');
      thumbnail.style.width = '300px';
      thumbnail.style.height = 'auto';
      thumbnail.style.objectFit = 'scale-down';
      thumbnail.src =
        'https://www.tbstat.com/wp/uploads/2023/03/20230322_Bitcoin_Generic-1200x675.jpg?isSafari=false&isMobile=false';

      const excerpt = document.createElement('div');
      excerpt.style.fontWeight = '400';
      excerpt.innerHTML =
        'The number of transactions on the Bitcoin network reached a new all-time high yesterday when tracked daily using a seven-day moving average.';

      tableFooter.appendChild(alert);
      tableFooter.appendChild(title);
      tableFooter.appendChild(thumbnail);
      tableFooter.appendChild(excerpt);
    }

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
    tableRoot.appendChild(tableFooter);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};
