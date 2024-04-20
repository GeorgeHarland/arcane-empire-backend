echo "1 -- Cleaning up previous build: "

rm -rf dist/
rm -rf node_modules/
rm -rf deployment/

echo "2 -- Creating build: "

npm install --production
npm run build

echo "3 -- Creating the deployment package: "

mkdir -p deployment
mkdir -p dist
cp -R node_modules/ dist/node_modules/
cp -R package.json dist/package.json
cp -R package-lock.json dist/package-lock.json
cd dist/
zip -r ../deployment/deployment.zip . -x "*.git*" -x "*.env*"
cd ..

echo "4 -- Restoring dev dependencies and cleaning up: "

rm -rf dist/node_modules/
npm install

echo "5 -- Deployment package ready: deployment.zip"
