import axios from "axios";
// Function to update or create coin details in Airtable
export const updateOrCreateCoinDetailsInAirtable = async (coin: any) => {
    const recordId = coin.id; // Use coin's ID as Airtable record ID
    const updateUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}/${recordId}`;
    
    try {
      // Fetch existing record details from Airtable (if needed)
      let existingRecord = null;
      try {
        const existingRecordResponse = await axios.get(updateUrl, {
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          },
        });
        existingRecord = existingRecordResponse.data;
      } catch (error) {
        // Record not found, we'll create a new one
      }
      
      // Update the record with new details
      const updatedFields = {
        Name: coin.name,
        Symbol: coin.symbol,
        // ... other fields ...
      };
  
      if (existingRecord) {
        await axios.patch(updateUrl, { fields: updatedFields }, {
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(`Updated coin details for ${coin.name}`);
      } else {
        await axios.post(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`, {
          fields: updatedFields,
        }, {
          headers: {
            Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(`Created coin details for ${coin.name}`);
      }
    } catch (error : any) {
      console.error(`Error updating or creating coin details for ${coin.name}:`, error.message);
    }
  };
  

