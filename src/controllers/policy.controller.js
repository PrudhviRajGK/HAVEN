import { query } from '../db/index.js';

// Coverage tier config
const COVERAGE_TIERS = {
  BASIC: {
    premium: 29,
    coverage: 1500,
  },
  STANDARD: {
    premium: 59,
    coverage: 3000,
  },
  PREMIUM: {
    premium: 99,
    coverage: 6000,
  },
};

// Helper — get week start and end dates (Monday to Sunday)
const getWeekDates = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday...
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    week_start_date: monday.toISOString().split('T')[0],
    week_end_date: sunday.toISOString().split('T')[0],
  };
};

// POST /api/policies
export const purchasePolicy = async (req, res) => {
  const { coverage_tier, disruption_types, payment_txn_id } = req.body;
  const worker_id = req.worker.worker_id;

  // Validation
  if (!coverage_tier || !disruption_types || !Array.isArray(disruption_types)) {
    return res.status(400).json({
      error: 'coverage_tier and disruption_types (array) are required',
    });
  }

  if (!COVERAGE_TIERS[coverage_tier]) {
    return res.status(400).json({
      error: 'Invalid coverage tier. Must be BASIC, STANDARD or PREMIUM',
    });
  }

  if (disruption_types.length === 0) {
    return res.status(400).json({
      error: 'Select at least one disruption type',
    });
  }

  try {
    // Get worker details
    const workerResult = await query(
      'SELECT * FROM workers WHERE worker_id = $1',
      [worker_id]
    );

    if (workerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const worker = workerResult.rows[0];

    // Check if worker already has an active policy this week
    const { week_start_date, week_end_date } = getWeekDates();

    const existingPolicy = await query(
      `SELECT policy_id FROM policies 
       WHERE worker_id = $1 
       AND status = 'ACTIVE' 
       AND week_start_date = $2`,
      [worker_id, week_start_date]
    );

    if (existingPolicy.rows.length > 0) {
      return res.status(409).json({
        error: 'You already have an active policy for this week',
        policy_id: existingPolicy.rows[0].policy_id,
      });
    }

    // Get tier config
    const tier = COVERAGE_TIERS[coverage_tier];

    // Apply risk score adjustment
    // risk_score > 70 → +10% premium
    // risk_score < 30 → -10% premium
    let premium_amount = tier.premium;
    if (worker.risk_score > 70) {
      premium_amount = Math.round(premium_amount * 1.1);
    } else if (worker.risk_score < 30) {
      premium_amount = Math.round(premium_amount * 0.9);
    }

    // Create policy
    const result = await query(
      `INSERT INTO policies 
        (worker_id, week_start_date, week_end_date, premium_amount, coverage_amount, 
         coverage_tier, disruption_types, zone_id, payment_txn_id)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        worker_id,
        week_start_date,
        week_end_date,
        premium_amount,
        tier.coverage,
        coverage_tier,
        disruption_types,
        worker.zone_id,
        payment_txn_id || null,
      ]
    );

    const policy = result.rows[0];

    res.status(201).json({
      message: 'Policy purchased successfully',
      policy,
      summary: {
        worker_name: worker.full_name,
        coverage_tier,
        premium_paid: `₹${premium_amount}`,
        max_payout: `₹${tier.coverage}`,
        valid_from: week_start_date,
        valid_until: week_end_date,
        covers: disruption_types.join(', '),
      },
    });
  } catch (err) {
    console.error('Purchase policy error:', err.message);
    res.status(500).json({ error: 'Server error while purchasing policy' });
  }
};

// GET /api/policies/my
export const getMyPolicies = async (req, res) => {
  const worker_id = req.worker.worker_id;

  try {
    const result = await query(
      `SELECT * FROM policies 
       WHERE worker_id = $1 
       ORDER BY created_at DESC`,
      [worker_id]
    );

    res.json({
      count: result.rows.length,
      policies: result.rows,
    });
  } catch (err) {
    console.error('Get policies error:', err.message);
    res.status(500).json({ error: 'Server error while fetching policies' });
  }
};

// GET /api/policies/:id
export const getPolicyById = async (req, res) => {
  const { id } = req.params;
  const worker_id = req.worker.worker_id;

  try {
    const result = await query(
      `SELECT * FROM policies 
       WHERE policy_id = $1 AND worker_id = $2`,
      [id, worker_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    res.json({ policy: result.rows[0] });
  } catch (err) {
    console.error('Get policy error:', err.message);
    res.status(500).json({ error: 'Server error while fetching policy' });
  }
};
