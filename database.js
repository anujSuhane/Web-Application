import mysql from 'mysql2';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'sql1234',
  database: 'orders'
}).promise();

const create_order_header = `
  CREATE TABLE order_header (
    ORDER_ID VARCHAR(40) NOT NULL PRIMARY KEY,
    ORDER_NAME VARCHAR(255) DEFAULT NULL,
    PLACED_DATE DATETIME DEFAULT NULL,
    STATUS_ID VARCHAR(40) DEFAULT NULL,
    CURRENCY_UOM_ID VARCHAR(40) DEFAULT NULL,
    PRODUCT_STORE_ID VARCHAR(40) DEFAULT NULL,
    SALES_CHANNEL_ENUM_ID VARCHAR(40) DEFAULT NULL,
    GRAND_TOTAL DECIMAL(24,4) DEFAULT NULL,
    COMPLETED_DATE DATETIME NULL
  )
`;

async function createTables() {
  const connection = await pool.getConnection();
  try {
    // Execute the SQL query to create the order_header table
    await connection.query(create_order_header);

    // Execute the SQL queries to create other tables
    await connection.query(`
      CREATE TABLE party (
        PARTY_ID varchar(40) NOT NULL,
        PARTY_TYPE_ENUM_ID varchar(40) DEFAULT NULL,
        PRIMARY KEY (PARTY_ID)
      );
    `);

    await connection.query(`
      CREATE TABLE order_part (
        ORDER_ID varchar(40) NOT NULL,
        ORDER_PART_SEQ_ID varchar(40) NOT NULL,
        PART_NAME varchar(255) DEFAULT NULL,
        STATUS_ID varchar(40) DEFAULT NULL,
        VENDOR_PARTY_ID varchar(40) DEFAULT NULL,
        CUSTOMER_PARTY_ID varchar(40) DEFAULT NULL,
        PART_TOTAL decimal(24,4) DEFAULT NULL,
        FACILITY_ID varchar(40) DEFAULT NULL,
        SHIPMENT_METHOD_ENUM_ID varchar(40) DEFAULT NULL,
        PRIMARY KEY (ORDER_ID, ORDER_PART_SEQ_ID),
        FOREIGN KEY (ORDER_ID) REFERENCES order_header(ORDER_ID),
        FOREIGN KEY (CUSTOMER_PARTY_ID) REFERENCES party(PARTY_ID)
      );
    `);
    

    await connection.query(`CREATE TABLE product (
        PRODUCT_ID VARCHAR(40) NOT NULL,
        OWNER_PARTY_ID VARCHAR(40) DEFAULT NULL,
        PRODUCT_NAME VARCHAR(255) DEFAULT NULL,
        DESCRIPTION VARCHAR(4095) DEFAULT NULL,
        CHARGE_SHIPPING CHAR(1) DEFAULT NULL,
        RETURNABLE CHAR(1) DEFAULT NULL,
        PRIMARY KEY (PRODUCT_ID),
        CONSTRAINT product_ibfk_1
          FOREIGN KEY (OWNER_PARTY_ID) REFERENCES party (PARTY_ID)
      )`);

    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await connection.release();
  }
}

// Call the function to create tables
// createTables();


async function insertData() {
    const connection = await pool.getConnection();
    try {
      // Insert Party data
      await connection.query(`
        INSERT INTO party (PARTY_ID, PARTY_TYPE_ENUM_ID)
        VALUES
          ('ORG_ZIZI_RETAIL', 'PtyOrganization'),
          ('CustJqp', 'PtyPerson'),
          ('CustDemo2', 'PtyPerson');
      `);
  
      // Insert Product data
      await connection.query(`
        INSERT INTO Product (PRODUCT_ID, OWNER_PARTY_ID, PRODUCT_NAME, CHARGE_SHIPPING, RETURNABLE)
        VALUES
          ('DEMO_UNIT', 'ORG_ZIZI_RETAIL', 'Demo Product One Unit', 'Y', 'Y'),
          ('DEMO_1_1', 'ORG_ZIZI_RETAIL', 'Demo Product One One', 'Y', 'Y'),
          ('DEMO_1_2', 'ORG_ZIZI_RETAIL', 'Demo Product One Two', 'Y', 'Y');
      `);
  
      console.log('Data inserted successfully!');
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      await connection.release();
    }
  }
  
  // Call the function to insert data
//   insertData();
