# CSV Reformatter
Written for a psychology professor to automate reformatting CSV files containing experiment results.

The client generates excel spreadsheets containing experiment results, but they need to be re-structured for later use. 
This web app uses arrays and loops to split the .csv string and recreate it in the chosen format.

The client can:
1. Upload a .csv file exported from Excel
2. Choose which columns to keep 'as-is' unformatted (e.g., header columns), and which to remove completely (e.g., blank columns)
3. Choose columns to reformat
4. Rename columns in the final table
5. Export as a new .csv file
