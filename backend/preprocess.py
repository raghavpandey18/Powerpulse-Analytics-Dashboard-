import pandas as pd
import json
import os

def preprocess_data():
    csv_path = '../data/Consumption.csv'
    if not os.path.exists(csv_path):
        print(f"Error: {csv_path} not found.")
        return

    # Load data
    df = pd.read_csv(csv_path)
    
    # Convert Dates to datetime
    df['Dates'] = pd.to_datetime(df['Dates'], format='%d/%m/%Y')
    
    # Mapping regions to full names as per user images
    region_map = {
        'ER': 'Eastern',
        'NER': 'Northeastern',
        'NR': 'Northern',
        'SR': 'Southern',
        'WR': 'Western'
    }
    df['Regions'] = df['Regions'].map(region_map)
    
    # Sort by date
    df = df.sort_values(by='Dates')
    
    # 1. Regional Monthly Consumption (Line Plot Data)
    df['YearMonth'] = df['Dates'].dt.to_period('M')
    # Use sum because the image X-axis labels imply monthly totals/averages across states
    # Actually, the Y-label says "Total Regional Consumption (GWh)". 
    # Let's sum usage per region per month.
    regional_monthly = df.groupby(['YearMonth', 'Regions'])['Usage'].sum().unstack().fillna(0)
    regional_monthly.index = regional_monthly.index.astype(str)
    regional_monthly.to_json('../data/regional_monthly.json', orient='index')
    
    # 2. National Monthly Consumption (Line Plot with Overlay)
    national_monthly = df.groupby('YearMonth')['Usage'].sum()
    national_monthly.index = national_monthly.index.astype(str)
    national_monthly.to_json('../data/national_monthly.json')
    
    # 3. Recovery Percentage Change (Jul-Dec 2020 vs 2019)
    # Filter for 2019 and 2020, and months Jul-Dec (7-12)
    df['Month'] = df['Dates'].dt.month
    df['Year'] = df['Dates'].dt.year
    
    comparison_months = [7, 8, 9, 10, 11, 12]
    recovery_df = df[df['Month'].isin(comparison_months) & df['Year'].isin([2019, 2020])]
    
    # Group by Year, Month, Region for comparison
    monthly_regional = recovery_df.groupby(['Year', 'Month', 'Regions'])['Usage'].sum().unstack()
    
    # Calculate % change for each month/region
    # (Data 2020 / Data 2019 - 1) * 100
    try:
        data_2019 = monthly_regional.loc[2019]
        data_2020 = monthly_regional.loc[2020]
        pct_change = ((data_2020 / data_2019) - 1) * 100
        
        # Month names mapping
        month_names = {7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'}
        pct_change.index = pct_change.index.map(month_names)
        pct_change.to_json('../data/recovery_pct.json', orient='index')
    except Exception as e:
        print(f"Warning: Could not calculate recovery % change: {e}")

    # Standard stats mapping
    stats = {
        "total_usage": float(df['Usage'].sum()),
        "avg_usage": float(df['Usage'].mean()),
        "peak_usage": float(df['Usage'].max()),
        "peak_state": df.loc[df['Usage'].idxmax(), 'States'],
        "days_covered": len(df['Dates'].unique())
    }
    with open('../data/stats.json', 'w') as f:
        json.dump(stats, f)

    # Save cleaned CSV for reference
    df.to_csv('../data/Consumption_Cleaned.csv', index=False)
    
    print("Preprocessing complete. New data files generated.")

if __name__ == "__main__":
    preprocess_data()
