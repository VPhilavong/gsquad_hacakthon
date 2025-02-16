import requests
from bs4 import BeautifulSoup
import pandas as pd
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# URL and headers setup
def scraper():
    URL = "https://github.com/SimplifyJobs/Summer2025-Internships?tab=readme-ov-file"
    HEADERS = {"User-Agent": "Mozilla/5.0"}

    if os.path.exists('jobs.csv'):
        os.remove('jobs.csv')

    # Fetch and parse
    response = requests.get(URL, headers=HEADERS)
    soup = BeautifulSoup(response.text, "html.parser")

    # Find rows and create list for data
    rows = soup.find_all("tr")
    jobs_data = []

    # Unwanted entries
    unwanted = ['.github', 'archived', '.gitignore', 'CONTRIBUTING.md', 
                'README-Off-Season.md', 'README.md']

    # Extract job details
    last_company = ""
    for row in rows:
        cols = row.find_all("td")
        if len(cols) > 2:
            job_title = cols[1].text.strip()
            company = cols[0].text.strip()
            
            # Skip unwanted entries
            if job_title not in unwanted:
                # If company is arrow (↳), use last company name
                if company == "↳":
                    company = last_company
                else:
                    last_company = company
                
                # Extract job links (inside the <td>)
                application_link = None

                # Get all <a> tags in the job column
                link_tags = cols[3].find_all("a")  # Changed to cols[3] where links are

                for link in link_tags:
                    if "href" in link.attrs:
                        href = link["href"]
                        if "simplify.jobs" not in href:  # Only get non-simplify links
                            application_link = href
                            break  # Exit after finding first application link

                # Only append if application_link exists
                if application_link:  # This checks if application_link is not None
                    jobs_data.append({
                        'company': company,
                        'title': job_title,
                        'location': cols[2].text.strip(),
                        'date': cols[-1].text.strip(),
                        'job_link': application_link
                    })

    # Create DataFrame and export
    df = pd.DataFrame(jobs_data)
    print("CSV file created successfully!")
    print(f"Total jobs with links: {len(df)}")  # Debug print
    return df

def clear_supabase_table(supabase):
    try:
        response = supabase.table('jobs').delete().neq('id', 0).execute()
        print("Cleared existing records from database")
        return response
    except Exception as e:
        print(f"Error clearing table: {e}")
        return None

def load_data_supabase(df):
    dotenv_path = Path('../../.env')
    load_dotenv(dotenv_path)

    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key)
    
    try:
        # Clear existing data first
        clear_supabase_table(supabase)
        
        # Format and insert new data
        records = df.to_dict('records')
        response = supabase.table('jobs').insert(records).execute()
        print(f"Successfully inserted {len(records)} new records")
        return response
        
    except Exception as e:
        print(f"Error type: {type(e)}")
        print(f"Error message: {str(e)}")
        return None

if __name__ == "__main__":
    df = scraper()
    result = load_data_supabase(df)
