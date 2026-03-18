#!/bin/bash

echo "======================================"
echo "   Your Local Network IP Addresses"
echo "======================================"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Wi-Fi IP:"
    ipconfig getifaddr en0 2>/dev/null || echo "  Not connected"
    echo ""
    echo "Ethernet IP:"
    ipconfig getifaddr en1 2>/dev/null || echo "  Not connected"
else
    # Linux/Windows WSL
    echo "Network IPs:"
    hostname -I | awk '{print $1}'
fi

echo ""
echo "======================================"
echo "Update frontend/src/api.js with the IP above"
echo "======================================"
