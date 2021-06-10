echo "NPM install"
npm ci

echo "NPM build"
npm run build

exec "$@"