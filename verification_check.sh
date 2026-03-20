#!/bin/bash
echo "=== COMPREHENSIVE VERIFICATION CHECK ==="
echo ""

echo "✅ 1. UUID package installed:"
grep '"uuid"' frontend/package.json || echo "❌ MISSING"

echo ""
echo "✅ 2. Express-validator installed:"
grep '"express-validator"' backend/package.json || echo "❌ MISSING"

echo ""
echo "✅ 3. Math.random() removed from frontend:"
if grep -r "Math\.random()" frontend/src/screens/*.jsx 2>/dev/null; then
    echo "❌ FOUND Math.random()"
else
    echo "✅ No Math.random() found"
fi

echo ""
echo "✅ 4. UUID usage in MakeTimetable:"
grep -c "uuidv4" frontend/src/screens/MakeTimetable.jsx

echo ""
echo "✅ 5. Alert.alert usage (should be 17):"
grep -r "Alert\.alert" frontend/src/screens/*.jsx | wc -l

echo ""
echo "✅ 6. Standalone alert() calls (should be 0):"
grep -rn "^\s*alert(" frontend/src/screens/*.jsx | wc -l

echo ""
echo "✅ 7. Validation middleware exists:"
ls -lh backend/middleware/validation.js 2>/dev/null || echo "❌ MISSING"

echo ""
echo "✅ 8. Config files exist:"
ls -lh backend/.env.example backend/.prettierrc frontend/.prettierrc 2>/dev/null | grep -E "\.(example|prettierrc)"

echo ""
echo "✅ 9. rawAI conditional check:"
grep -A2 "NODE_ENV.*development" backend/controllers/aiController.js | grep -c "rawAI"

echo ""
echo "✅ 10. Validation in routes:"
echo "  - authRoutes:" $(grep -c "Validation" backend/routes/authRoutes.js)
echo "  - reportRoutes:" $(grep -c "Validation" backend/routes/reportRoutes.js)
echo "  - timetableRoutes:" $(grep -c "Validation" backend/routes/timetableRoutes.js)

echo ""
echo "=== VERIFICATION COMPLETE ==="
