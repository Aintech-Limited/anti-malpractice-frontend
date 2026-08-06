echo "Building nextjs server..." && \
NODE_ENV=production npm run build && \
echo "Build complete" && \
echo "Copying static files..." && \
cp -r .next/static .next/standalone/.next/static && \
echo "Static files copy complete" && \
echo "Copying public files..." && \
cp -r public .next/standalone/public && \
echo "Public files copy complete" && \
echo "Running production server..." && \
HOSTNAME=localhost node .next/standalone/server.js
