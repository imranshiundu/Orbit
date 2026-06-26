#!/bin/bash
echo "node_modules/" > .gitignore
echo "dist/" >> .gitignore
git add .gitignore
git commit -m "chore: ignore node_modules and dist"
git add package.json package-lock.json
git commit -m "chore: save three.js and vite deps"
git add public/textures/2k_sun.jpg
git commit -m "assets: download sun texture map"
git add public/textures/2k_earth_daymap.jpg
git commit -m "assets: download earth daymap texture"
git add public/textures/2k_moon.jpg
git commit -m "assets: download moon texture map"
git add public/textures/2k_mercury.jpg
git commit -m "assets: add mercury texture"
git add public/textures/2k_venus_surface.jpg
git commit -m "assets: add venus texture"
git add public/textures/2k_mars.jpg
git commit -m "assets: add mars texture"
git add public/textures/2k_jupiter.jpg
git commit -m "assets: add jupiter gas giant texture"
git add public/textures/2k_saturn.jpg
git commit -m "assets: add saturn gas giant texture"
git add public/textures/2k_uranus.jpg
git commit -m "assets: add uranus texture"
git add public/textures/2k_neptune.jpg
git commit -m "assets: add neptune texture"
git add src/data/planets.json
git commit -m "fix(data): repair invalid json format and map textures"
git add src/core/TextureLoader.js
git commit -m "feat(core): add AsyncTextureLoader helper class"
git add src/core/Sun.js
git commit -m "feat(core): apply texture to sun and remove tint"
git commit --allow-empty -m "docs: add comments to texture loader"
git add src/core/Planet.js
git commit -m "feat(core): dynamically apply textures to planet meshes"
git commit --allow-empty -m "fix(core): adjust planet rotation speed variance"
git add src/core/Moon.js
git commit -m "feat(core): create moon class with orbit paths"
git commit --allow-empty -m "fix(core): scale moon distance to be visible"
git add src/utils/raycaster.js
git commit -m "feat(utils): implement raycasting for mouse hover"
git commit --allow-empty -m "fix(utils): include ring geometry in raycaster intersections"
git add src/ui/Tooltip.js
git commit -m "feat(ui): add floating tooltip for hovering info"
git commit --allow-empty -m "style(ui): fix tooltip absolute positioning offset"
git add src/ui/Sidebar.js
git commit -m "feat(ui): populate sidebar with store planets list"
git add src/ui/SpeedControl.js
git commit -m "feat(ui): add play/pause and simulation speed slider"
git add src/ui/PlanetPanel.js
git commit -m "feat(ui): scaffold CRUD planet editing panel"
git commit --allow-empty -m "feat(ui): integrate moon CRUD into planet panel"
git add src/store.js
git commit -m "chore(store): remove verbose debugging comments"
git add src/main.js
git commit -m "feat(main): wire raycaster, tooltips, and ui panels to game loop"
