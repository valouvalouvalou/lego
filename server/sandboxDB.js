/*const { connectDB, readJSON } = require('./db');

async function insertData() {
    const db = await connectDB();

    const dealabsDeals = readJSON('./server/lego_deals_from_dealabs.json');
    const vintedSales = readJSON('./server/lego_deals_from_dealabs.json');
    
    try {
        if (!dealabsDeals) {
            console.error('❌ Impossible de récupérer les données JSON Dealabs.');
        }
        else {
            await db.collection('Dealabs').insertMany(dealabsDeals);
            console.log('✅ Données Dealabs insérées avec succès !');
        }
        if (!vintedSales) {
            console.error('❌ Impossible de récupérer les données JSON Vinted.');
        } else {
            await db.collection('Vinted').insertMany(vintedSales);
            console.log('✅ Données Vinted insérées avec succès !');
        }
    } catch (error) {
        console.error('❌ Erreur lors de l’insertion des données :', error);
    }
    
}

insertData();*/



const { connectDB, readJSON } = require('./db');

const dealabs = require('./websites/dealabs');
websiteDealabs = 'https://www.dealabs.com/groupe/lego';

const MONGODB_DB_NAME = 'DB_Lego';

const getIdsFromDeals = deals => {
    return deals.map(deal => deal.idLego)
}

const vinted = require('./websites/vinted');


async function main(){
    let client;
    try {
        client = await connectDB(); // Connect to MongoDB
        const db = client.db(MONGODB_DB_NAME);
        
        const dealabsDeals = await dealabs.scrape(websiteDealabs); // Scraping data from Dealabs
        console.log('✅ Dealabs scraping completed successfully!');

        await db.collection('Dealabs').deleteMany({}); // Delete old Dealabs data 
        console.log('✅ Old Dealabs data deleted successfully!');
        await db.collection('Dealabs').insertMany(dealabsDeals); // and insert new
        console.log('✅ New Dealabs data inserted successfully!');

        const ids = getIdsFromDeals(dealabsDeals); // Get all IDs from Dealabs deals for Vinted search
        console.log('✅ Extracted Dealabs IDs for Vinted scraping');

        await db.collection('Vinted').deleteMany({});// Delete old Vinted data
        console.log('✅ Old Vinted data deleted successfully!');

        // Scraping Vinted for each Dealabs ID
        for (const id of ids) {
            const website = `https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1741851955&search_text=${id}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=&color_ids=&material_ids=`;
            //console.log(` ID : ${id} `);
            //console.log(` Website ${website} `);
            const vintedSales = await vinted.scrape(website, id);
            console.log(`✅ Vinted scraping for ID ${id} completed successfully!`);
            
            // Insert Vinted data into the database
            if (vintedSales.length > 0) {
                await db.collection('Vinted').insertMany(vintedSales);
                console.log(`✅ Vinted sales data for ID ${id} inserted successfully!`);
            } else {
                console.log(`⚠️ No Vinted sales data found for ID ${id}`);
            }
        }

        console.log('✅ All Vinted data inserted successfully!');

    } catch (error) {
        console.error("❌ Error during the scraping process or database operations:", error);
    } finally {
        if (client) {
            await client.close(); // Close MongoDB connection
            console.log('MongoDB connection closed');
        }
    }
}

main();