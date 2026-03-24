import { query } from '../db/index.js';

// GET /api/workers/profile
export const getProfile = async (req, res) => {
  const worker_id = req.worker.worker_id;

  try {
    const result = await query(
      `SELECT 
        worker_id, full_name, email, phone_number, platform,
        city, zone_id, avg_daily_earning, upi_id, risk_score,
        kyc_verified, created_at
       FROM workers WHERE worker_id = $1`,
      [worker_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json({ worker: result.rows[0] });
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

// PATCH /api/workers/profile
export const updateProfile = async (req, res) => {
  const worker_id = req.worker.worker_id;
  const { full_name, upi_id, city, zone_id, avg_daily_earning, platform } =
    req.body;

  // Build dynamic update query — only update fields that are provided
  const updates = [];
  const params = [];
  let paramCount = 1;

  if (full_name) {
    updates.push(`full_name = $${paramCount++}`);
    params.push(full_name);
  }
  if (upi_id) {
    updates.push(`upi_id = $${paramCount++}`);
    params.push(upi_id);
  }
  if (city) {
    updates.push(`city = $${paramCount++}`);
    params.push(city);
  }
  if (zone_id) {
    updates.push(`zone_id = $${paramCount++}`);
    params.push(zone_id);
  }
  if (avg_daily_earning) {
    updates.push(`avg_daily_earning = $${paramCount++}`);
    params.push(avg_daily_earning);
  }
  if (platform) {
    updates.push(`platform = $${paramCount++}`);
    params.push(platform);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update' });
  }

  params.push(worker_id);

  try {
    const result = await query(
      `UPDATE workers SET ${updates.join(', ')} 
       WHERE worker_id = $${paramCount}
       RETURNING worker_id, full_name, email, phone_number, platform,
                 city, zone_id, avg_daily_earning, upi_id, risk_score,
                 kyc_verified, created_at`,
      params
    );

    res.json({
      message: 'Profile updated successfully',
      worker: result.rows[0],
    });
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
};

// GET /api/workers/dashboard
export const getDashboard = async (req, res) => {
  const worker_id = req.worker.worker_id;

  try {
    // Get worker
    const workerResult = await query(
      `SELECT worker_id, full_name, platform, city, zone_id,
              avg_daily_earning, risk_score, kyc_verified
       FROM workers WHERE worker_id = $1`,
      [worker_id]
    );

    if (workerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const worker = workerResult.rows[0];

    // Get active policy this week
    const activePolicyResult = await query(
      `SELECT * FROM policies
       WHERE worker_id = $1
       AND status = 'ACTIVE'
       AND week_start_date <= CURRENT_DATE
       AND week_end_date >= CURRENT_DATE`,
      [worker_id]
    );

    // Get claims summary
    const claimsSummaryResult = await query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'PENDING') AS pending_claims,
        COUNT(*) FILTER (WHERE status = 'APPROVED') AS approved_claims,
        COUNT(*) FILTER (WHERE status = 'PAID') AS paid_claims,
        COUNT(*) FILTER (WHERE status = 'FLAGGED') AS flagged_claims,
        COALESCE(SUM(claim_amount) FILTER (WHERE status = 'PAID'), 0) AS total_paid_out
       FROM claims
       WHERE worker_id = $1`,
      [worker_id]
    );

    // Get total policies purchased
    const policiesCountResult = await query(
      `SELECT COUNT(*) AS total_policies
       FROM policies WHERE worker_id = $1`,
      [worker_id]
    );

    // Get recent claims (last 5)
    const recentClaimsResult = await query(
      `SELECT 
        c.claim_id,
        c.claim_amount,
        c.status,
        c.created_at,
        c.payout_at,
        de.event_type,
        de.city,
        de.severity
       FROM claims c
       LEFT JOIN disruption_events de ON c.event_id = de.event_id
       WHERE c.worker_id = $1
       ORDER BY c.created_at DESC
       LIMIT 5`,
      [worker_id]
    );

    // Calculate GigScore (1.0 - 5.0)
    // Formula: base 3.0, +/- based on claim history and risk score
    const risk = worker.risk_score;
    const gigScore = Math.max(
      1.0,
      Math.min(5.0, (5.0 - (risk / 100) * 4).toFixed(1))
    );

    const claims = claimsSummaryResult.rows[0];

    res.json({
      worker: {
        ...worker,
        gig_score: parseFloat(gigScore),
      },
      active_policy: activePolicyResult.rows[0] || null,
      stats: {
        total_policies: parseInt(policiesCountResult.rows[0].total_policies),
        pending_claims: parseInt(claims.pending_claims),
        approved_claims: parseInt(claims.approved_claims),
        paid_claims: parseInt(claims.paid_claims),
        flagged_claims: parseInt(claims.flagged_claims),
        total_income_protected: `₹${parseFloat(claims.total_paid_out).toFixed(2)}`,
      },
      recent_claims: recentClaimsResult.rows,
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ error: 'Server error while fetching dashboard' });
  }
};
