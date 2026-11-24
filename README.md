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
5. **Open the app.** The address is `https://OWNER.github.io/REPOSITORY/rll-app/` (if you uploaded the folder) or `https://OWNER.github.io/REPOSITORY/` (if you uploaded the files at the top of the repository). Pages can take 1–2 minutes after each upload. Sign in, then install it from the sign-in screen.
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

## Live address

- **App:** https://duazonboystownlabors.github.io/duazonapp/. The files are at the top of the `duazonapp` repository.
- **Install guide:** https://duazonboystownlabors.github.io/duazonapp/install.html
- **How to use:** https://duazonboystownlabors.github.io/duazonapp/help.html. Add `?role=reg`, `cl`, `pl`, `co` or `cen` to open on one role.
- **Public homepage:** stays on Google Sites. Its **Team sign-in** and **Team: install the app** links point to the addresses above.

## Modules (Nov 2026)

- Each user has **module ticks**: Dashboard, Class attendance, Meetings, People, Follow-ups, Counselor hand-off, Assignments, Messages, Statistics, Admin tools.
- The role gives the usual ticks; an Admin or Center Leader changes them per user under **Users & programs → Users** (stored in the Leaders column `Modules`; blank = usual for the role).
- Ticks decide screens only; whose data someone sees still comes from what they lead or are given. The server checks every tick.
- **Users & programs → App settings** switches a whole module off for everyone (currently: Assignments). Stored in the Apps Script's script properties, not in the sheet.

## Built in Nov 2026 (one upload)

- **Areas** — fixed list in the Lists tab (column `Area`), edited in Users & programs → App settings (rename carries over to records; areas in use cannot be removed). People have `Area` + typed community (`Address / Community`); old text kept in `Old Address`. "Sort old addresses" suggests areas (also used on import). Denominations list (column `Denomination`) edited there too.
- **Churches** — `Churches` tab (ChurchID, name, denomination, area, community, address, pastor/contact names and phones, GPS, photo, status Not mapped/Mapped/Checked, Assigned To, history). Import from Excel (all sheets; sheet name = area when it matches). People link to a church with `ChurchID` ("Link people to churches" groups typed spellings). Church page lists who attends. Photos go to a Drive folder "RLL Church Photos" (shared by link) — the script needs Google Drive permission once.
- **Mobilization** — tabs `Mob Drives` (outreaches open for reports), `Mob People` (name + phone; never mixed with People), `Mob Churches`. New role **Mobilizer**; modules **Churches**, **Mobilization**, **Manage mobilization**. Mobilizers see team counts, their own list (call/SMS/WhatsApp, message my list), and churches without phone numbers except those given to them. Mapping can be given by area (Leaders column `Map Areas`) or by church.
- **Church report** = letter delivered (who received it) + the church's details and mapping (GPS, photo) in one save. Columns on `Mob Churches`: Letter Delivered, Delivered Date, Received By (+ optional Receiver Role/Phone/Proof Photo, unused in the simple form).
- **Who came** (computed, nothing extra stored): people marked at the outreach program's meetings are matched by phone to `Mob People` (✓ came, per mobilizer) and grouped by their church (`ChurchID`, chosen on the newcomer form as "Their church"); churches with a letter but nobody yet are flagged. Leaders see it under Mobilization → 📊 Who came.
- **Offline** (installed app only): after one online sign-in the phone keeps a mobilization-only copy (PIN stored as a hash); reports and church edits wait in an outbox and send automatically; repeated sends are ignored (client IDs).
- **Simple view** (default): optional form fields under "+ More details"; "Show more options" in the name menu. **Today** screen for people without the dashboard (registrars, counselors).
- **Messages filters**: church, decision progress, counselor, not seen for N weeks / never came, first came between dates; quick picks for church pastors & contacts by area and for people mobilized per outreach.
- Tests: `test/` (mock Google + real Code.gs/Index.html, Playwright) — 176 checks incl. the installed app offline. Source copy kept with the outputs.

## Agreed plan (Nov 2026)

1. Modules per user + simpler tabs — **done**. Steps 2–6 below — **done** (see "Built in Nov 2026").
2. Fixed **Area** list (VOA/R2 · Rock Crusher/Silver Beach/Sand Beach · Duazon · Transit · Boystown · Marshall Road · Scheiffelin Town/Disco Hill/Tower Hill · Others), editable by Admin, plus typed **Community**; a "Sort addresses" screen to fit old addresses into areas (old text kept).
3. **Churches**: list with area, community, address, pastor, contact person, optional denomination, GPS, photo (shrunk on the phone); import from the existing Excel (columns: Names of Churches, Address, Pastor's name, Phone number, Contact Person Name, Phone number; several sheets, some named by area, some mixed); link people to churches ("Fix church names"); church statistics.
4. **Mobilization**: public page on GitHub; reporters are portal users with a Report mobilization tick and their own code; two kinds of report (people mobilized: name + phone; church/organization mobilized). Admin activates the outreach/meeting being mobilized for, so reports are sorted per outreach. Mobilized people stay in Mobilization, never in People. Anyone with the mobilization tick can map any church and save partial details; mapping can be assigned by church or by area.
5. Simple/Full mode and a "Today" screen per role.
6. Messages: more filters (area, community, church, gender, age, decision, counselor, attendance, church pastors/contacts, mobilized people).
