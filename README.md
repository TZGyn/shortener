# Link Shortener

Link Shortener is a site to manage your short urls while providing analytics to the url traffics.
[Demo Here](https://shortener.tzgyn.com)

### One Click Deploy on Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/bWnD5H?referralCode=bSruGU)

## Development

### Frontend

```bash
npm install # tried using bun but it has lots of issues
npm run dev # will convert to bun once its stable with sveltekit
```

### Redirect

```bash
bun install
bun --hot run src/index.ts
```

## Deployment

### Frontend

```bash
npm install
npm run build
node build
```

### Redirect

```bash
bun install
bun run src/index.ts
```
