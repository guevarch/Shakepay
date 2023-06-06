import pandas as pd
from datetime import datetime

df_list = []

for i in range(1, 31):
    try:
        filename = f'resources/transactions_summary ({i}).csv'
        df = pd.read_csv(filename)
        df_list.append(df)
        print(f'Successfully loaded file {filename}')
        # Perform any data analysis or manipulation you need
    except FileNotFoundError:
        pass

shake_data_df = pd.concat(df_list, ignore_index=True)
shake_data_df['Date'] = pd.to_datetime(shake_data_df['Date'])


# Below are quick example
start_date = '2021-01-01'
end_date = '2023-05-30'
# Select DataFrame rows between two dates
search = (shake_data_df['Date'] >= start_date) & (shake_data_df['Date'] <= end_date)
shake_data_df = shake_data_df.loc[search]

#Drop Unecessary Columns and Set Transaction Type As Index
shake_data_df = shake_data_df.drop(columns = ['Blockchain Transaction ID','Debit Currency','Direction','Credit Currency'])
shake_df = shake_data_df.set_index('Transaction Type')
shake_df['Date'] =shake_df['Date'].dt.strftime('%Y/%m/%d')

#Find total $ From shakingats
shaking_df = shake_df.loc[['shakingsats',], :]
sum_shakingsats = shaking_df['Amount Credited'] * shaking_df['Spot Rate']
sumshakingstats = "{:.2f}".format(sum_shakingsats.sum())

sum_shakingsats = shaking_df['Amount Credited'] * shaking_df['Spot Rate']
sumshakingstats = "{:.2f}".format(sum_shakingsats.sum())

#Find total $ From cashbacks
card_df = shake_df.loc[['card cashbacks',], :]
sum_cardcashbacks = card_df['Amount Credited'] * card_df['Spot Rate']
sumcards = "{:.2f}".format(sum_cardcashbacks.sum())

# Find total $ From purchase/sale
ps_df = shake_df.loc[['purchase/sale',], :]
sum_ps = ps_df['Amount Debited']
sum_ps = "{:.2f}".format(sum_ps.sum())

summary_spending_df = shake_df.groupby(['Source / Destination','Date']).sum()
summary_spending_df = summary_spending_df.drop(columns = ['Amount Credited', 'Buy / Sell Rate', 'Spot Rate'])
summary_spending_df = summary_spending_df[summary_spending_df['Amount Debited'] > 1]
summary_spending_df = summary_spending_df.reset_index(drop=False)
summary_spending_df = summary_spending_df.reindex(columns=['Amount Debited','Source / Destination','Date'])
summary_spending_df = summary_spending_df.set_index('Source / Destination')   
total_spend = summary_spending_df['Amount Debited'].sum()
total_spend = "{:.2f}".format(total_spend)

#Find summary spending
summary_spending_df = summary_spending_df.reset_index()
summary_spending_df = summary_spending_df.set_index('Amount Debited')

from dateutil import parser
dt0 = parser.parse(end_date)
dt1 = parser.parse(start_date)
time_d = dt0 - dt1
number_of_days = float(time_d.days)
intsumps = float(sum_ps)
avgspend = "${:.2f}".format(intsumps/number_of_days)

summary_spending_df = summary_spending_df.sort_values(by=['Date'])
# combined_summary = combined_summary.sort_values(by=['Date']).drop(columns = ['Date'])
combined_summary = summary_spending_df[~summary_spending_df["Source / Destination"].isin(["MASSAGE ADDICT","guevarch@gmail.com","FREEDOM MOBILE", "yansunique@yahoo.ca", "CITY CENTRE BAPTIST", "GOOGLE YouTubePremium"])]
combined_summary.to_csv('resources/combined_summary.csv')