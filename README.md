VOOM - VTC Suite (prêt pour GitHub Actions)

Contenu du projet :
- backend/ (Express + sqlite3) : stocke localement dans data/voom.db (SQLite) et propose export JSON.
- web-frontend/ (React + Vite) : interface simple (import CSV, lister courses, exporter JSON, générer PDFs).
- desktop/ (Electron) : wrapper pour le front + packaging via electron-builder.
- assets/logo/ : logo SVG (noir luxe + accent doré). Remplacez ces fichiers pour changer l'icône.
- .github/workflows/windows-build.yml : workflow prêt pour builder (.exe portable + installer) via GitHub Actions.

Comment l'utiliser :
1. Dézippez ce repo et uploadez son contenu sur un nouveau dépôt GitHub.
2. Dans GitHub Actions, lancez le workflow "Build Windows app".
3. Téléchargez les artefacts (VOOM_Portable... et VOOM_Installer...).

Changer le logo :
- Remplacez les fichiers dans assets/logo/ (logo.svg, logo.png, logo.ico si vous en avez) puis relancez le workflow pour regénérer les .exe.

Base locale :
- Le backend utilise SQLite (data/voom.db). Les données restent en local (dans le dossier backend/data).
- Vous pouvez exporter en JSON via l'endpoint /export/json ou via l'interface Web.
