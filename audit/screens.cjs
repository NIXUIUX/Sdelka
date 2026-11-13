const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1000, height: 760 } });
  for (const id of ['персональные','доход','подписание','клиент','окнобанка','прескоринг']) {
    await p.goto(`http://localhost:6107/iframe.html?id=экраны-сборка-из-библиотеки--${id}&viewMode=story`); await p.waitForTimeout(700);
    await p.screenshot({ path: path.resolve(__dirname, `../../smoke/audit/lib-${id}.png`) });
  }
  await b.close();
})();
