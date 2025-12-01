import express, { Request, Response } from 'express';
import { pool, testConnection } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Blood types for validation
const VALID_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ==================== INSTITUTION ROUTES ====================

// Create BloodBank or Hospital
app.post('/api/institutions', async (req: Request, res: Response) => {
  try {
    const { institution_type, institution_name, location, phone_number } = req.body;

    if (!institution_type || !institution_name) {
      return res.status(400).json({ error: 'Institution type and name are required' });
    }

    if (institution_type === 'bloodbank') {
      const result = await pool.query(
        'INSERT INTO BloodBank (BloodBank_name, Location, Phone_Number) VALUES ($1, $2, $3) RETURNING BloodBank_ID',
        [institution_name, location, phone_number]
      );
      res.json({ message: 'Blood Bank created successfully', id: result.rows[0].bloodbank_id });
    } else if (institution_type === 'hospital') {
      const result = await pool.query(
        'INSERT INTO Hospital (Hospital_Name, Location, Phone_Number) VALUES ($1, $2, $3) RETURNING Hospital_ID',
        [institution_name, location, phone_number]
      );
      res.json({ message: 'Hospital created successfully', id: result.rows[0].hospital_id });
    } else {
      res.status(400).json({ error: 'Invalid institution type' });
    }
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({ error: 'Failed to create institution' });
  }
});

// Get all blood banks
app.get('/api/bloodbanks', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM BloodBank ORDER BY BloodBank_name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching blood banks:', error);
    res.status(500).json({ error: 'Failed to fetch blood banks' });
  }
});

// Get all hospitals
app.get('/api/hospitals', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM Hospital ORDER BY Hospital_Name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// ==================== DONOR ROUTES ====================

// Create donor
app.post('/api/donors', async (req: Request, res: Response) => {
  try {
    const { f_name, m_initial, l_name, date_of_birth, phone_number, last_donation_date, gender, blood_type, bb_id } = req.body;

    if (!f_name || !l_name || !date_of_birth || !phone_number || !blood_type) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    if (!VALID_BLOOD_TYPES.includes(blood_type)) {
      return res.status(400).json({ error: 'Invalid blood type' });
    }

    const result = await pool.query(
      'INSERT INTO Donor (f_name, m_initial, l_name, Date_Of_Birth, Phone_Number, Last_Day_Of_Donation, Gender, BB_ID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING Donor_ID',
      [f_name, m_initial || null, l_name, date_of_birth, phone_number, last_donation_date || null, gender, bb_id || null]
    );

    res.json({ message: 'Donor created successfully', id: result.rows[0].donor_id });
  } catch (error) {
    console.error('Error creating donor:', error);
    res.status(500).json({ error: 'Failed to create donor' });
  }
});

// Get all donors
app.get('/api/donors', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT d.*, b.BloodBank_name
      FROM Donor d
      LEFT JOIN BloodBank b ON d.BB_ID = b.BloodBank_ID
      ORDER BY d.Donor_ID DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ error: 'Failed to fetch donors' });
  }
});

// Get single donor
app.get('/api/donors/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM Donor WHERE Donor_ID = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ error: 'Failed to fetch donor' });
  }
});

// Update donor
app.put('/api/donors/:id', async (req: Request, res: Response) => {
  try {
    const { f_name, m_initial, l_name, date_of_birth, phone_number, last_donation_date, gender, bb_id } = req.body;

    const result = await pool.query(
      'UPDATE Donor SET f_name = $1, m_initial = $2, l_name = $3, Date_Of_Birth = $4, Phone_Number = $5, Last_Day_Of_Donation = $6, Gender = $7, BB_ID = $8 WHERE Donor_ID = $9',
      [f_name, m_initial || null, l_name, date_of_birth, phone_number, last_donation_date || null, gender, bb_id || null, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.json({ message: 'Donor updated successfully' });
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).json({ error: 'Failed to update donor' });
  }
});

// Delete donor
app.delete('/api/donors/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'DELETE FROM Donor WHERE Donor_ID = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ error: 'Failed to delete donor. May have related records.' });
  }
});

// ==================== RECIPIENT ROUTES ====================

// Create recipient
app.post('/api/recipients', async (req: Request, res: Response) => {
  try {
    const { f_name, m_initial, l_name, date_of_birth, gender, blood_type, phone_number } = req.body;

    if (!f_name || !l_name || !date_of_birth || !blood_type || !phone_number) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    if (!VALID_BLOOD_TYPES.includes(blood_type)) {
      return res.status(400).json({ error: 'Invalid blood type' });
    }

    const result = await pool.query(
      'INSERT INTO Recipient (f_name, m_initial, l_name, Date_Of_Birth, Gender, Blood_Type, Phone_Number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING Recipient_ID',
      [f_name, m_initial || null, l_name, date_of_birth, gender, blood_type, phone_number]
    );

    res.json({ message: 'Recipient created successfully', id: result.rows[0].recipient_id });
  } catch (error) {
    console.error('Error creating recipient:', error);
    res.status(500).json({ error: 'Failed to create recipient' });
  }
});

// Get all recipients
app.get('/api/recipients', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM Recipient ORDER BY Recipient_ID DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recipients:', error);
    res.status(500).json({ error: 'Failed to fetch recipients' });
  }
});

// Get single recipient
app.get('/api/recipients/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM Recipient WHERE Recipient_ID = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching recipient:', error);
    res.status(500).json({ error: 'Failed to fetch recipient' });
  }
});

// Update recipient
app.put('/api/recipients/:id', async (req: Request, res: Response) => {
  try {
    const { f_name, m_initial, l_name, date_of_birth, gender, blood_type, phone_number } = req.body;

    if (blood_type && !VALID_BLOOD_TYPES.includes(blood_type)) {
      return res.status(400).json({ error: 'Invalid blood type' });
    }

    const result = await pool.query(
      'UPDATE Recipient SET f_name = $1, m_initial = $2, l_name = $3, Date_Of_Birth = $4, Gender = $5, Blood_Type = $6, Phone_Number = $7 WHERE Recipient_ID = $8',
      [f_name, m_initial || null, l_name, date_of_birth, gender, blood_type, phone_number, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    res.json({ message: 'Recipient updated successfully' });
  } catch (error) {
    console.error('Error updating recipient:', error);
    res.status(500).json({ error: 'Failed to update recipient' });
  }
});

// Delete recipient
app.delete('/api/recipients/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'DELETE FROM Recipient WHERE Recipient_ID = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    res.json({ message: 'Recipient deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipient:', error);
    res.status(500).json({ error: 'Failed to delete recipient. May have related records.' });
  }
});

// ==================== DONATION ROUTES ====================

// Record donation
app.post('/api/donations', async (req: Request, res: Response) => {
  try {
    const { donor_id, blood_type, expiration_date, quantity_donated, bloodbank_id } = req.body;

    if (!donor_id || !blood_type || !expiration_date || !quantity_donated || !bloodbank_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!VALID_BLOOD_TYPES.includes(blood_type)) {
      return res.status(400).json({ error: 'Invalid blood type' });
    }

    // Verify donor exists
    const donorResult = await pool.query(
      'SELECT Donor_ID FROM Donor WHERE Donor_ID = $1',
      [donor_id]
    );

    if (donorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    // Verify bloodbank exists
    const bloodbankResult = await pool.query(
      'SELECT BloodBank_ID FROM BloodBank WHERE BloodBank_ID = $1',
      [bloodbank_id]
    );

    if (bloodbankResult.rows.length === 0) {
      return res.status(404).json({ error: 'Blood bank not found' });
    }

    // Insert into Blood table
    const bloodResult = await pool.query(
      'INSERT INTO Blood (Blood_Type, Expiration_Date, Quantity_Donated, Donor_ID) VALUES ($1, $2, $3, $4) RETURNING Blood_ID',
      [blood_type, expiration_date, quantity_donated, donor_id]
    );

    const bloodId = bloodResult.rows[0].blood_id;

    // Insert into Stored_To table
    await pool.query(
      'INSERT INTO Stored_To (Blood_ID, BloodBank_ID) VALUES ($1, $2)',
      [bloodId, bloodbank_id]
    );

    // Update donor's last donation date
    await pool.query(
      'UPDATE Donor SET Last_Day_Of_Donation = CURRENT_DATE WHERE Donor_ID = $1',
      [donor_id]
    );

    res.json({ message: 'Donation recorded successfully', blood_id: bloodId });
  } catch (error) {
    console.error('Error recording donation:', error);
    res.status(500).json({ error: 'Failed to record donation' });
  }
});

// ==================== SEARCH ROUTES ====================

// Search blood inventory
app.post('/api/search', async (req: Request, res: Response) => {
  try {
    const { blood_type, bloodbank_id, expiration_start, expiration_end } = req.body;

    if (!blood_type) {
      return res.status(400).json({ error: 'Blood type is required' });
    }

    let query = `
      SELECT b.Blood_ID, b.Blood_Type, b.Expiration_Date, b.Quantity_Donated,
             bb.BloodBank_ID, bb.BloodBank_name, bb.Location,
             (b.Expiration_Date - CURRENT_DATE) as Days_Until_Expiration
      FROM Blood b
      INNER JOIN Stored_To st ON b.Blood_ID = st.Blood_ID
      INNER JOIN BloodBank bb ON st.BloodBank_ID = bb.BloodBank_ID
      WHERE b.Blood_Type = $1
    `;

    const params: any[] = [blood_type];
    let paramCount = 1;

    if (bloodbank_id) {
      paramCount++;
      query += ` AND bb.BloodBank_ID = $${paramCount}`;
      params.push(bloodbank_id);
    }

    if (expiration_start) {
      paramCount++;
      query += ` AND b.Expiration_Date >= $${paramCount}`;
      params.push(expiration_start);
    }

    if (expiration_end) {
      paramCount++;
      query += ` AND b.Expiration_Date <= $${paramCount}`;
      params.push(expiration_end);
    }

    query += ' ORDER BY b.Expiration_Date';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching inventory:', error);
    res.status(500).json({ error: 'Failed to search inventory' });
  }
});

// ==================== START SERVER ====================

async function startServer() {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log('✓ API endpoints available at /api/*');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
