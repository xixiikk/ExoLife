import httpx

NASA_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"

NASA_QUERY = """
SELECT
    pl_name,
    hostname,
    pl_rade,
    pl_bmasse,
    pl_bmassprov,
    pl_orbper,
    pl_eqt,
    pl_insol,
    pl_orbeccen,
    st_teff,
    disc_year,
    discoverymethod
FROM pscomppars
"""


def fetch_exoplanets():
    """Получение подтверждённых экзопланет из NASA."""

    response = httpx.get(
        NASA_URL,
        params={
            "query": NASA_QUERY,
            "format": "json"
        },
        timeout=120.0,
        follow_redirects=True
    )

    response.raise_for_status()

    return response.json()


