import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory database
const users = [];
const calculations = [];

// Middleware to extract user from token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (token.startsWith('token_')) {
    const userId = parseInt(token.replace('token_', ''));
    req.userId = userId;
    const user = users.find(u => u.id === userId);
    if (user) {
      req.user = user;
    }
  }
  next();
};

app.use(authMiddleware);
const RAINFALL_DATA = {
  'mumbai': 2200, 'pune': 650, 'delhi': 715, 'bangalore': 970, 'hyderabad': 775,
  'kolkata': 1582, 'ahmedabad': 630, 'jaipur': 625, 'lucknow': 812, 'indore': 1101,
  'nashik': 748, 'nagpur': 1033, 'surat': 1930, 'vadodara': 700, 'coimbatore': 2400,
};

const TUTORIALS = [
  {
    id: 1,
    title: 'Getting Started with Rainwater Harvesting',
    category: 'basics',
    difficulty: 'beginner',
    readTime: 8,
    videoUrl: 'https://www.youtube.com/embed/Hx6q5p82-6o',
    content: 'Rainwater harvesting is the process of collecting and storing rainwater from rooftops and other surfaces for later use. This guide covers the basics.\n\nKey benefits:\n✓ Reduces dependence on municipal water supply\n✓ Lowers water bills significantly\n✓ Environmentally friendly and sustainable\n✓ Provides backup during dry seasons\n✓ Reduces flooding and erosion\n\nWhy rainwater harvesting matters:\nRainwater is free and renewable. A typical residential rooftop can collect between 3,000-10,000 liters of water annually depending on rainfall patterns. This can meet 50-100% of household water needs for non-potable uses like gardening, cleaning, and toilet flushing.\n\nQuick facts:\n• One inch of rain on a 1,000 sq ft roof collects about 600 gallons\n• Average family uses 300 gallons of water daily\n• Rainwater is free from chlorine and minerals',
  },
  {
    id: 2,
    title: 'Roof Collection Systems',
    category: 'installation',
    difficulty: 'intermediate',
    readTime: 12,
    videoUrl: 'https://www.youtube.com/embed/Xyp-DZpLwQo',
    content: 'The most common and cost-effective method for residential rainwater harvesting is roof collection. Your roof is the primary collection surface!\n\nCollection surface efficiency by roof material:\n• RCC/Concrete - 80% runoff coefficient\n• Clay Tiles - 85% runoff coefficient \n• Metal Sheets - 90% runoff coefficient\n• Asphalt/Tar - 95% runoff coefficient\n• Paved surfaces - 95% runoff coefficient\n\nKey system components:\n1. Gutters and downpipes - Collect and direct water flow\n2. Leaf strainers - Remove leaves and debris\n3. First flush diverters - Remove initial dirty water (important!)\n4. Storage tanks - Hold collected water\n5. Filtration systems - Clean the water for use\n6. Overflow outlet - Excess water management\n\nDesign considerations:\n• Roof slope affects collection efficiency\n• Choose corrosion-resistant materials (copper, aluminum)\n• Size gutters for maximum rainfall in your area\n• Install mosquito screens on all outlets',
  },
  {
    id: 3,
    title: 'Water Storage & Tank Options',
    category: 'installation',
    difficulty: 'beginner',
    readTime: 10,
    videoUrl: 'https://www.youtube.com/embed/WyY3bBmcfVM',
    content: 'Selecting the right storage tank is crucial for your rainwater harvesting system success.\n\nPopular tank options and their benefits:\n\n1. Underground tanks (Most common)\n   • Space-saving - hidden from view\n   • Temperature stable\n   • Protected from debris\n   • Cost: ₹15,000-₹50,000\n\n2. Overhead elevated tanks\n   • Gravity-fed distribution\n   • No pumping required\n   • Good for multi-story buildings\n   • Cost: ₹10,000-₹30,000\n\n3. Sump/Bore well integration\n   • Combines with existing systems\n   • Best for urban areas\n   • Cost: ₹20,000-₹60,000\n\n4. Modular/Portable tanks\n   • Flexible capacity\n   • Easy relocation\n   • Suitable for apartments\n   • Cost: ₹8,000-₹25,000\n\nMaterial comparison:\n• Reinforced Concrete - Durable (20+ years), heavy, difficult to install\n• Fiberglass (FRP) - Lightweight, corrosion-resistant, cost-effective\n• Polyethylene (HDPE) - Food-grade, UV-resistant, affordable\n• Metal (stainless/painted) - Strong, prone to rust, expensive\n\nTank sizing formula:\nCapacity = Average monthly rainfall × Roof area × 0.8 / 12',
  },
  {
    id: 4,
    title: 'Filtration & Water Quality',
    category: 'maintenance',
    difficulty: 'intermediate',
    readTime: 14,
    videoUrl: 'https://www.youtube.com/embed/dJQHf32tJcE',
    content: 'Proper filtration ensures clean, safe, and usable water from your rainwater system.\n\nMulti-layer filtration system:\n\nLayer 1 - Coarse screens (1-3mm)\n   • Remove leaves, twigs, and debris\n   • Easy to clean daily\n   • Prevents system clogging\n\nLayer 2 - Sand filter (50-100cm)\n   • Removes fine particles\n   • Use coarse to fine sand grades\n   • Improves water clarity significantly\n\nLayer 3 - Charcoal layer (30-50cm)\n   • Removes odors and bad taste\n   • Improves water quality\n   • Can be activated charcoal\n\nLayer 4 - Gravel support (50cm)\n   • Provides structural support\n   • Allows water drainage\n   • Prevent sand mixing\n\nMaintenance schedule:\n• Daily: Check screen overflow\n• Weekly: Clean strainers and screens\n• Monthly: Empty first-flush diverter\n• Quarterly: Test water quality (TDS, pH, turbidity)\n• Bi-annually: Replace sand and charcoal\n• Annually: Professional water testing\n\nWater quality parameters to test:\n✓ pH level (should be 6.5-8.5)\n✓ Total Dissolved Solids - TDS (< 500 ppm)\n✓ Turbidity (< 1 NTU)\n✓ Hardness (< 300 ppm)\n✓ Coliform bacteria (should be absent)',
  },
  {
    id: 5,
    title: 'Government Schemes & Incentives',
    category: 'policy',
    difficulty: 'beginner',
    readTime: 9,
    videoUrl: 'https://www.youtube.com/embed/ynlmr0Y2P2c',
    content: 'Various government schemes and incentives support rainwater harvesting installations across India.\n\nNational Government Schemes:\n\n1. PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)\n   • Focus: Agricultural water security\n   • Subsidy: Up to 50% of installation cost\n   • Application: Contact local irrigation dept\n\n2. AIBP (Accelerated Irrigation Benefit Programme)\n   • Focus: Irrigation infrastructure\n   • Subsidy: Varies by state\n   • Best for: Agricultural rainwater harvesting\n\n3. Jal Shakti Mission\n   • Focus: Water conservation and management\n   • Subsidy: Up to ₹1,00,000 per household\n   • Priority: Rural areas\n\n4. MNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)\n   • Labor cost support for installation\n   • Work guarantee program\n   • Best for: Rural communities\n\nState-specific incentives:\n\nMaharashtra:\n   • Subsidy: 25-50% for residential systems\n   • Max grant: ₹50,000\n   • Contact: State water authority\n\nRajasthan:\n   • Water conservation grants: Up to ₹50,000\n   • Zero-interest loans available\n   • Priority in dry districts\n\nKerala:\n   • Building code compliance incentives\n   • Subsidy: 30% of cost\n   • Max amount: ₹1,00,000\n\nTamil Nadu:\n   • Interest-free loans up to ₹2 lakhs\n   • Subsidy on tank purchase\n   • Tax exemptions available\n\nHow to apply:\n1. Contact your local municipality/gram panchayat\n2. Submit filled application form\n3. Site inspection by officials\n4. Approval and fund disbursement\n5. Installation and verification\n6. Final subsidy payment',
  },
  {
    id: 6,
    title: 'System Maintenance & Troubleshooting',
    category: 'maintenance',
    difficulty: 'intermediate',
    readTime: 11,
    videoUrl: 'https://www.youtube.com/embed/wGrH9lH8-4Q',
    content: 'Regular maintenance ensures your rainwater harvesting system operates efficiently for 15-20+ years.\n\nCommon issues & quick solutions:\n\n1. Leaking pipes or joints\n   • Check all connection points\n   • Tighten loose fittings\n   • Replace worn gaskets/seals\n   • Use waterproof tape on threads\n\n2. Cloudy or discolored water\n   • Improve filtration quality\n   • Add additional sand layer\n   • Replace charcoal layer\n   • Check tank cleanliness\n\n3. Algae growth in tank\n   • Ensure tank is covered/shaded\n   • Install fine mesh on vents\n   • Add UV filtration\n   • Regular cleaning schedule\n\n4. Low water flow rate\n   • Clean strainers and screens\n   • Check for pipe blockages\n   • Clear gutters of debris\n   • Verify downpipe connections\n\n5. No water in tank\n   • Verify inlet pipes are connected\n   • Check if gutters are blocked\n   • Inspect first-flush diverter\n   • Monitor rainfall patterns\n\n6. Bad odor from water\n   • Clean tank interior thoroughly\n   • Replace charcoal filter\n   • Improve air circulation\n   • Add beneficial bacteria\n\nAnnual maintenance checklist:\n□ Inspect all gutters and downpipes for damage\n□ Clean and flush entire system\n□ Empty and clean first-flush diverter\n□ Replace/clean filtration media\n□ Test water quality parameters\n□ Check tank for cracks or leaks\n□ Trim trees near roof\n□ Verify overflow drain function\n□ Check pump and pressure settings\n□ Document all maintenance activities',
  },
  {
    id: 7,
    title: 'Advanced: Greywater Integration',
    category: 'installation',
    difficulty: 'advanced',
    readTime: 15,
    videoUrl: 'https://www.youtube.com/embed/LtGGVBE1XpA',
    content: 'Combining rainwater with greywater (from washing/bathing) maximizes your water savings potential.\n\nGreywater sources and quality levels:\n\nClean sources (Tier 1 - Best quality):\n   • Washing machine outlet\n   • Air conditioner condensate\n   • Dehumidifier water\n   • Reuse immediately with minimal treatment\n\nModerate sources (Tier 2 - Medium quality):\n   • Bathroom sinks and showers\n   • Garden and landscape drainage\n   • Rainwater overflow\n   • Requires basic filtration\n\nLow-quality sources (Tier 3 - Requires treatment):\n   • Kitchen sink (contains oils/grease)\n   • Toilet water (blackwater - never reuse!)\n   • Dishwasher water\n   • Generally avoid or heavily treat\n\nIntegration considerations:\n• Separate greywater filtration system required\n• Higher maintenance demands\n• Check local regulations - may have restrictions\n• Professional installation recommended\n• Additional cost: ₹30,000-₹80,000\n\nBenefits of combined system:\n   ✓ Potential 50-60% additional water savings\n   ✓ Reduced municipal water consumption\n   ✓ Greater resilience during drought\n   ✓ Lower water bills significantly\n\nTypical combined system layout:\nRainwater collection (roof) → Tank A\nGreywater collection (drains) → Filtration → Tank B\nCombined → Further treatment → Storage → Distribution\n\nStorage and reuse options:\n   • Toilet flushing (most common reuse)\n   • Garden and landscape irrigation\n   • Car and outdoor cleaning\n   • Cooling tower makeup\n   • Fire protection systems\n\nDO NOT use for:\n   ✗ Drinking or cooking\n   ✗ Personal hygiene (unless heavily treated)\n   ✗ Food production\n   ✗ Swimming pools\n\nCost-benefit analysis:\nInitial investment: ₹50,000-₹1,50,000\nMonthly savings: ₹500-₹2,000\nPayback period: 3-5 years\nSystem life: 15-20 years\nTotal savings over lifetime: ₹1,50,000-₹5,00,000',
  },
  {
    id: 8,
    title: 'Water Conservation Tips for Daily Use',
    category: 'basics',
    difficulty: 'beginner',
    readTime: 7,
    videoUrl: 'https://www.youtube.com/embed/p5mVn8vI3S4',
    content: 'Beyond harvesting, here are practical ways to reduce water consumption in your daily life.\n\nBathroom habits:\n   • Take shorter showers (5-10 minutes)\n   • Install low-flow showerheads (saves 40%)\n   • Turn off tap while brushing teeth\n   • Use half-flush for liquid waste\n   • Fix running toilets immediately\n   • Collect warm-up water in a bucket\n\nLaundry and cleaning:\n   • Wash full loads only\n   • Use water-efficient washing machines\n   • Reuse water for initial rinse\n   • Collect floor washing water for mopping\n\nKitchen conservation:\n   • Thaw frozen food in fridge, not sink\n   • Rinse dishes in a bowl, not running tap\n   • Install aerators on kitchen tap\n   • Collect vegetable washing water for plants\n   • Don\'t run dishwasher for few items\n\nGarden and outdoor:\n   • Water plants early morning or evening\n   • Use drip irrigation, not sprinklers\n   • Mulch garden beds to retain moisture\n   • Group plants by water needs\n   • Collect rainwater in barrels\n   • Avoid watering paved areas\n\nHousehold fixes:\n   • Fix leaks immediately (1 drop/sec = 5 liters/day!)\n   • Install tap aerators (saves 30%)\n   • Get water meter to track usage\n   • Use water-efficient appliances\n   • Insulate hot water pipes\n   • Regular plumbing maintenance\n\nTargets you can achieve:\n   • Current average: 135 liters/person/day\n   • Target conservation: 100 liters/person/day\n   • With rainwater harvesting: 50-75 liters/day needed',
  },
];


// Routes

// Auth
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  if (users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already registered' });
  
  const user = { id: Date.now(), name, email, password };
  users.push(user);
  res.json({ token: `token_${user.id}`, user: { id: user.id, name, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
  res.json({ token: `token_${user.id}`, user: { id: user.id, name: user.name, email: user.email } });
});

// Tutorials
app.get('/api/tutorials', (req, res) => {
  const { category } = req.query;
  const filtered = category && category !== 'all' 
    ? TUTORIALS.filter(t => t.category === category)
    : TUTORIALS;
  res.json(filtered);
});

// Geocoding
app.get('/api/calculator/geocode', (req, res) => {
  const { name } = req.query;
  if (!name) return res.json([]);
  
  // Simple mock geocoding
  const cities = [
    { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 },
    { name: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567 },
    { name: 'Delhi', country: 'India', latitude: 28.7041, longitude: 77.1025 },
    { name: 'Bangalore', country: 'India', latitude: 12.9716, longitude: 77.5946 },
    { name: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867 },
    { name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639 },
    { name: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714 },
    { name: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873 },
    { name: 'Lucknow', country: 'India', latitude: 26.8467, longitude: 80.9462 },
    { name: 'Indore', country: 'India', latitude: 22.7196, longitude: 75.8577 },
    { name: 'Nashik', country: 'India', latitude: 19.9975, longitude: 73.7898 },
    { name: 'Nagpur', country: 'India', latitude: 21.1458, longitude: 79.0882 },
    { name: 'Surat', country: 'India', latitude: 21.1702, longitude: 72.8311 },
    { name: 'Vadodara', country: 'India', latitude: 22.3072, longitude: 73.1812 },
    { name: 'Coimbatore', country: 'India', latitude: 11.0026, longitude: 76.9124 },
  ];
  
  const result = cities.filter(c => c.name.toLowerCase().startsWith(name.toLowerCase()));
  res.json(result);
});

// Rainfall
app.get('/api/calculator/rainfall', (req, res) => {
  const { lat, lng } = req.query;
  
  // Find nearest city based on latitude/longitude
  const cities = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, rainfall: 2200 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, rainfall: 650 },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025, rainfall: 715 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, rainfall: 970 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, rainfall: 775 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, rainfall: 1582 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, rainfall: 630 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, rainfall: 625 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462, rainfall: 812 },
    { name: 'Indore', lat: 22.7196, lng: 75.8577, rainfall: 1101 },
    { name: 'Nashik', lat: 19.9975, lng: 73.7898, rainfall: 748 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882, rainfall: 1033 },
    { name: 'Surat', lat: 21.1702, lng: 72.8311, rainfall: 1930 },
    { name: 'Vadodara', lat: 22.3072, lng: 73.1812, rainfall: 700 },
    { name: 'Coimbatore', lat: 11.0026, lng: 76.9124, rainfall: 2400 },
  ];
  
  let closest = cities[0];
  let minDist = Infinity;
  
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  
  for (let city of cities) {
    const dist = Math.abs(city.lat - latNum) + Math.abs(city.lng - lngNum);
    if (dist < minDist) {
      minDist = dist;
      closest = city;
    }
  }
  
  res.json({ annualRainfall: closest.rainfall });
});

// Calculator
app.post('/api/calculator/calculate', (req, res) => {
  const { roofArea, roofMaterial, annualRainfall, numPeople, dailyConsumption, drySpellDays, city } = req.body;
  
  const materialCoeff = { concrete: 0.80, tiles: 0.85, turf: 0.10 }[roofMaterial] || 0.80;
  const harvestVolume = roofArea * annualRainfall * materialCoeff;
  const dailyDemand = numPeople * dailyConsumption;
  const storageCapacity = dailyDemand * drySpellDays;
  const feasibilityResult = harvestVolume > storageCapacity ? 'GO' : harvestVolume > storageCapacity * 0.5 ? 'PARTIAL' : 'NO-GO';
  
  const costPerLiter = 5;
  const annualSavings = harvestVolume * costPerLiter * 0.01;
  const installationCost = storageCapacity * 8;
  const paybackPeriod = installationCost > 0 ? Math.ceil(installationCost / annualSavings) : 0;
  
  const calc = {
    id: Date.now(),
    userId: req.userId || null,
    userName: req.user?.name || 'Anonymous',
    userEmail: req.user?.email || null,
    city: city || 'Unknown',
    roofArea: parseFloat(roofArea),
    roofMaterial,
    annualRainfall: parseInt(annualRainfall),
    numPeople: parseInt(numPeople),
    harvestVolume: Math.round(harvestVolume),
    storageCapacity: Math.round(storageCapacity),
    feasibilityResult,
    annualSavings: Math.round(annualSavings),
    installationCost: Math.round(installationCost),
    paybackPeriod,
    runoffCoefficient: materialCoeff,
    createdAt: new Date().toISOString(),
    recommendation: feasibilityResult === 'GO' 
      ? `Excellent! Your rooftop can harvest ${Math.round(harvestVolume)} liters annually, exceeding your ${Math.round(storageCapacity)} liter requirement.`
      : feasibilityResult === 'PARTIAL'
      ? `Good potential. Your system can meet ${Math.round((harvestVolume/storageCapacity)*100)}% of your water needs.`
      : `Limited feasibility. Consider supplementing with greywater or increasing tank size.`,
  };
  
  calculations.push(calc);
  res.json({ ...calc, logId: calc.id });
});

// Get user's calculation history
app.get('/api/calculator/history', (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userCalcs = calculations
    .filter(c => c.userId === req.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json(userCalcs);
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  // Aggregate by user
  const userStats = {};
  
  calculations.forEach(calc => {
    if (calc.userId) {
      if (!userStats[calc.userId]) {
        userStats[calc.userId] = {
          userId: calc.userId,
          userName: calc.userName,
          userEmail: calc.userEmail,
          totalVolume: 0,
          totalSavings: 0,
          calculationCount: 0,
          cities: new Set(),
          latestCalc: calc.createdAt,
        };
      }
      userStats[calc.userId].totalVolume += calc.harvestVolume || 0;
      userStats[calc.userId].totalSavings += calc.annualSavings || 0;
      userStats[calc.userId].calculationCount++;
      if (calc.city) userStats[calc.userId].cities.add(calc.city);
      if (new Date(calc.createdAt) > new Date(userStats[calc.userId].latestCalc)) {
        userStats[calc.userId].latestCalc = calc.createdAt;
      }
    }
  });
  
  const leaderboard = Object.values(userStats)
    .map(u => ({
      ...u,
      cities: Array.from(u.cities).join(', '),
    }))
    .sort((a, b) => b.totalVolume - a.totalVolume);
  
  res.json(leaderboard);
});

// Get user's rank
app.get('/api/leaderboard/me', (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userCalcs = calculations.filter(c => c.userId === req.userId);
  if (userCalcs.length === 0) {
    return res.json({
      rank: null,
      totalVolume: 0,
      totalSavings: 0,
      calculationCount: 0,
    });
  }
  
  const totalVolume = userCalcs.reduce((s, c) => s + (c.harvestVolume || 0), 0);
  const totalSavings = userCalcs.reduce((s, c) => s + (c.annualSavings || 0), 0);
  
  // Find rank
  const allUsers = {};
  calculations.forEach(calc => {
    if (calc.userId) {
      if (!allUsers[calc.userId]) {
        allUsers[calc.userId] = { totalVolume: 0 };
      }
      allUsers[calc.userId].totalVolume += calc.harvestVolume || 0;
    }
  });
  
  const sorted = Object.entries(allUsers)
    .sort((a, b) => b[1].totalVolume - a[1].totalVolume)
    .map(([uid]) => parseInt(uid));
  
  const rank = sorted.indexOf(req.userId) + 1;
  
  res.json({
    rank,
    totalVolume,
    totalSavings,
    calculationCount: userCalcs.length,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ API Server running on http://localhost:${PORT}`));
