const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const usuarios = [
  { user: 'error_uno@test.com',       pass: 'claveWrong',   valido: false },
  { user: 'error_dos@test.com',       pass: 'claveWrong',   valido: false },
  { user: 'error_tres@test',          pass: 'claveWrong',   valido: false },
  { user: 'error_cuatroUCP',          pass: 'claveWrong',   valido: false },
  { user: 'EsteNoEsUnUsuarioValido',  pass: 'claveWrong',   valido: false },
  { user: 'FacuPelosoMcpNovalido',    pass: 'claveWrong',   valido: false },
  { user: 'tomsmith',                 pass: 'SuperSecretPassword!',  valido: true},
];


const screenshotDir = path.join(__dirname, '..', 'screenshots');
const logPath = path.join(__dirname, 'reporte.txt');

test.beforeAll(() => {
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
  // Limpiamos el reporte anterior al empezar
  fs.writeFileSync(logPath, `LOG DE INCIDENCIAS - ${new Date().toLocaleString()}\n${'='.repeat(40)}\n`);
});

for (const { user, pass, valido } of usuarios) {
  test(`Login ${valido ? 'válido' : 'inválido'}: ${user}`, async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');

    await page.fill('#username', user);
    await page.fill('#password', pass);

    await page.click('button[type="submit"]');

    const screenshotName = `${valido ? 'OK' : 'ERROR'}_${user.replace(/[^a-z0-9]/gi, '_')}.png`;
    const screenshotPath = path.join(screenshotDir, screenshotName);
    await page.screenshot({ path: screenshotPath });

  
    const message = page.locator('#flash');

    if (valido) {
      
      fs.appendFileSync(logPath, `[OK] Usuario: ${user} | Screenshot: ${screenshotName}\n`);
      await expect(message).toContainText('You logged into a secure area!');
    } else {
      fs.appendFileSync(logPath, `[FALLO] Usuario: ${user} | Screenshot: ${screenshotName}\n`);
      await expect(message).toContainText('is invalid');
    }
  });
}