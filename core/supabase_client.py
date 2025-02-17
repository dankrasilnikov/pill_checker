import os

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()


def get_supabase_client() -> Client:

    url = os.getenv("SUPABASE_URL", "postgres")
    key = os.getenv("SUPABASE_KEY", "mysecretpassword")
    return create_client(url, key)
