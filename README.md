# RLL Disciples — installable app (PWA)

The LivingSeed · Revival Labors Liberia discipleship tracker as an app people install on their phone or computer.

- These files are only the **screens**. All data stays in the Google Sheet and goes through the Apps Script web app.
- The folder holds **no names, phone numbers or other data**. Never upload the spreadsheet or any downloaded lists to this repository.

| File | What it is |
|---|---|
| `index.html` | The app |
| `config.js` | The address of your Apps Script web app. **Set it once, then keep it** |
| `pwa.js` | Install button on the sign-in screen and the "Update now" bar |
| `sw.js` | Keeps the app on the phone so it opens fast; brings in updates |
| `manifest.webmanifest`, `icons/` | App name and icons |
| `install.html` | Guide for users: how to install and update |
| `help.html`, `help/` | Guide for users: how to use the app, by role, with pictures (made-up names). The same guide opens inside the app from **Help** |

## First-time setup

1. **Update the Apps Script.**
   1. Paste the new `Code.gs` (it adds `doPost`, which the app uses) and click Save.
   2. Go to **Deploy → Manage deployments → ✏️ Edit**.
   3. Under **Version**, choose **New version**.
   4. Check two settings:
      - **Execute as:** Me
      - **Who has access:** **Anyone**. "Anyone with Google account" will not work from the app.
   5. Click **Deploy**, then copy the **Web app URL** (it ends in `/exec`).
2. **Connect the app.** `config.js` already holds your web app address:
   `https://script.google.com/macros/s/AKfycbwQO2JA6G6gERV62vxQ887QV2_hzTGywUyuA5ag6d_DXLeiInvDt45e-x6MhlYce4fc/exec`.
   It only needs changing if you ever create a **new** deployment, which gives a different address.
3. **Upload the folder.**
   1. In the repository, choose **Add file → Upload files**.
   2. Drag in the whole `rll-app` folder.
   3. Click **Commit changes**.
4. **GitHub Pages.** If Pages is not already on for this repository, the repository owner turns it on:
   1. Go to **Settings → Pages**.
   2. Under **Source**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
   3. Click **Save**.
5. **Open the app.** The address is `https://OWNER.github.io/REPOSITORY/rll-app/`. Pages can take 1–2 minutes after each upload. Sign in, then install it from the sign-in screen.
6. **Share** the app address and `…/rll-app/install.html` (the guide) with your users.

## Updating later

1. **Server first.** If `Code.gs` changed:
   1. Paste it in and click Save.
   2. Go to **Deploy → Manage deployments → ✏️ Edit**, choose **New version**, then click **Deploy**.
   3. The URL stays the same, so `config.js` does not change.
2. **Then the app files.** Upload all the new files over the old ones **except `config.js`**, which keeps your URL.

Every build has a new version number inside `sw.js`. Phones with the app see **"A new version of the app is ready — Update now"**. Users stay signed in.

## It does not touch other apps on the same site

- The app lives only in its own folder (`rll-app/`). Its service worker only handles files inside that folder.
- Its stored files are named `rll-discipleship-…`. It only ever removes its own old copies, never another app's.
- It has its own app identity (`id` in the manifest), so it installs as a separate app with its own icon.
- **Don't rename or move the `rll-app` folder** after people have installed it. A new address counts as a new app.
- **Don't put it at the repository root** if another app already lives there.

## The old link still works

The Apps Script link (`…/exec`) still opens the tracker in the browser, exactly as before.
