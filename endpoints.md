---
menu: Endpoints
parent: api.md
weight: 1
---
# Endpoints
Base URL: `https://api.kunisu.tk`

#### /anime
This returns an object:
```json
{
    "id": 148755,
    "url": "https://myanimelist.net/character/148755/Atsuya_Kirishima",
    "name": "Atsuya Kirishima",
    "kanjiname": null,
    "about": "No biography written.\\n\\n\n\t\t\t\n\t\t\t\\n\\n",
    "img": "https://cdn.myanimelist.net/images/characters/3/325102.jpg"
}
```

JavaScript Example
```js
const fetch = require('node-fetch')

(async () => {
    const anime = await fetch('https://api.kunisu.tk/anime')
        .then(res => res.json());

    console.log(anime);
})();
```
