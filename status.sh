clear
echo "=== KRUSHYJERSEY CRAWL ==="
ps aux | grep crawl_images | grep -v grep | head -1 || echo "crawler NOT running"
MANIFEST=$(wc -l < okktt_manifest.jsonl 2>/dev/null || echo 0)
IMAGES=$(find public/images -maxdepth 1 -type f 2>/dev/null | wc -l)
SIZE=$(du -sh public/images 2>/dev/null | cut -f1)
echo "processed: $MANIFEST / 16093"
echo "remaining: $((16093 - MANIFEST))"
echo "images:    $IMAGES"
echo "size:      $SIZE"
echo "--- last log ---"
tail -3 crawl2.log 2>/dev/null
